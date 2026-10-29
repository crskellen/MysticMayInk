import { plainCaption, postPlatform, tokenRecordIsEmpty } from "./sync.js";

// Instagram API with Instagram Login. Docs checked 2026-10-29:
// Business Login (updated 13 Mar 2026), IG Media (updated 20 Oct 2026).
// graph.instagram.com. One permission: instagram_business_basic.
// A long-lived token lasts about 60 days. Refresh needs the token to be
// at least 24 hours old and not yet expired. The refresh call does not
// use the app secret. The secret is still required here so a server
// without the app configured never calls Instagram.
const GRAPH_VERSION = "v26.0";
const MEDIA_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_product_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "shortcode",
  "timestamp",
  "children{media_type,media_url,thumbnail_url}",
].join(",");
const DAY_MS = 24 * 60 * 60 * 1000;
const REFRESH_LEAD_MS = 10 * DAY_MS;

function accountHandle(key) {
  return String(key).replace(/^@/, "");
}

function stillUrl(media) {
  if (!media || media.media_product_type === "STORY") return "";
  if (media.media_type === "VIDEO") return media.thumbnail_url || "";
  if (media.media_type === "CAROUSEL_ALBUM") {
    if (media.media_url) return media.media_url;
    const child = media.children?.data?.[0];
    if (!child) return "";
    if (child.media_type === "VIDEO") return child.thumbnail_url || "";
    return child.media_url || "";
  }
  if (media.media_type === "IMAGE") return media.media_url || "";
  return "";
}

function pageUrlOf(media) {
  if (typeof media.permalink === "string" && media.permalink.startsWith("https://")) {
    return media.permalink;
  }
  if (media.shortcode) return `https://www.instagram.com/p/${media.shortcode}/`;
  return "";
}

async function refreshLongLived(fetchImpl, account, now) {
  const expiresAt = Number(account.accessExpiresAt ?? 0);
  const obtainedAt = Number(account.obtainedAt ?? 0);
  if (!account.accessToken) throw new Error("missing access token");
  if (expiresAt && expiresAt <= now) throw new Error("token expired");
  const oldEnough = !obtainedAt || now - obtainedAt >= DAY_MS;
  const due = !expiresAt || expiresAt <= now + REFRESH_LEAD_MS;
  if (!due || !oldEnough) return account;

  const url = new URL("https://graph.instagram.com/refresh_access_token");
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", account.accessToken);
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`token refresh failed (${response.status})`);
  }
  const payload = await response.json();
  if (payload.error || !payload.access_token) {
    throw new Error(payload.error?.message || "token refresh returned no token");
  }
  return {
    accessToken: payload.access_token,
    accessExpiresAt: now + Number(payload.expires_in ?? 0) * 1000,
    obtainedAt: now,
  };
}

async function listAllMedia(fetchImpl, accessToken) {
  const params = new URLSearchParams({
    fields: MEDIA_FIELDS,
    limit: "25",
    access_token: accessToken,
  });
  let url = `https://graph.instagram.com/${GRAPH_VERSION}/me/media?${params}`;
  const media = [];
  let guard = 0;
  let previousAfter = "";

  while (guard < 100) {
    guard += 1;
    const response = await fetchImpl(url);
    if (!response.ok) {
      throw new Error(`media list failed (${response.status})`);
    }
    const payload = await response.json();
    if (payload.error) {
      throw new Error(payload.error.message || "media list error");
    }
    media.push(...(payload.data ?? []));
    const next = payload.paging?.next;
    const after = payload.paging?.cursors?.after;
    if (next) {
      url = next;
      continue;
    }
    if (after && after !== previousAfter) {
      previousAfter = after;
      const page = new URLSearchParams({
        fields: MEDIA_FIELDS,
        limit: "25",
        after,
        access_token: accessToken,
      });
      url = `https://graph.instagram.com/${GRAPH_VERSION}/me/media?${page}`;
      continue;
    }
    return media;
  }

  throw new Error("media list did not end");
}

async function copyStill(fetchImpl, saveCover, id, url) {
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`cover download failed (${response.status})`);
  }
  const bytes = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return saveCover(id, bytes, contentType);
}

// Copies each new still once. A video or reel stores thumbnail_url, not the file.
// Stories are skipped. With no token, or no app id and secret, it makes no request.
export async function runInstagramSync({
  appId,
  appSecret,
  tokenRecord,
  catalog = [],
  fetchImpl,
  now = () => Date.now(),
  saveCover,
  saveTokens,
  saveCatalog,
}) {
  if (tokenRecordIsEmpty(tokenRecord)) {
    return { ok: false, reason: "no-token", calledInstagram: false };
  }
  if (!appId || !appSecret) {
    return { ok: false, reason: "no-app-credentials", calledInstagram: false };
  }

  let calledInstagram = false;
  const callInstagram = async (...args) => {
    calledInstagram = true;
    return fetchImpl(...args);
  };

  const accounts = { ...tokenRecord.accounts };
  let tokensChanged = false;
  let completedAccounts = 0;
  const nextCatalog = [...catalog];
  const errors = [];
  const clock = now();

  for (const [rawHandle, account] of Object.entries(accounts)) {
    const handle = accountHandle(rawHandle);
    const handleKey = handle.toLowerCase();
    try {
      let current = await refreshLongLived(callInstagram, { ...account }, clock);
      if (current !== account && current.accessToken !== account.accessToken) {
        accounts[rawHandle] = current;
        tokensChanged = true;
      } else if (current.obtainedAt !== account.obtainedAt) {
        accounts[rawHandle] = current;
        tokensChanged = true;
      }

      const media = await listAllMedia(callInstagram, current.accessToken);
      const seen = new Set();

      for (const item of media) {
        if (!item?.id || item.media_product_type === "STORY") continue;
        const id = String(item.id);
        seen.add(id);
        const existing = nextCatalog.find((post) => String(post.id) === id);
        if (existing && postPlatform(existing) !== "instagram") continue;
        const caption = plainCaption(item.caption);
        const created = Date.parse(item.timestamp);
        const createTime = Number.isFinite(created) ? Math.floor(created / 1000) : existing?.createTime;
        const pageUrl = pageUrlOf(item);
        if (existing?.coverUrl && postPlatform(existing) === "instagram") {
          existing.caption = caption;
          if (createTime != null) existing.createTime = createTime;
          existing.handle = `@${handle}`;
          if (pageUrl) existing.pageUrl = pageUrl;
          continue;
        }
        const imageUrl = stillUrl(item);
        if (!imageUrl || !pageUrl || createTime == null) continue;
        const coverUrl = await copyStill(callInstagram, saveCover, id, imageUrl);
        const row = {
          id,
          platform: "instagram",
          handle: `@${handle}`,
          createTime,
          caption,
          coverUrl,
          pageUrl,
          standIn: false,
        };
        if (existing) {
          Object.assign(existing, row);
        } else {
          nextCatalog.push(row);
        }
      }

      for (let index = nextCatalog.length - 1; index >= 0; index -= 1) {
        const post = nextCatalog[index];
        const postHandle = String(post.handle ?? "").replace(/^@/, "").toLowerCase();
        if (
          postPlatform(post) === "instagram" &&
          postHandle === handleKey &&
          !seen.has(String(post.id))
        ) {
          nextCatalog.splice(index, 1);
        }
      }
      completedAccounts += 1;
    } catch (error) {
      errors.push({ handle, message: error.message });
    }
  }

  if (tokensChanged) await saveTokens({ accounts });
  if (completedAccounts > 0) await saveCatalog(nextCatalog);

  return {
    ok: errors.length === 0,
    reason: errors.length === 0 ? "synced" : "partial",
    calledInstagram,
    errors,
    posts: nextCatalog,
  };
}
