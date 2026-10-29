import { FACEBOOK_PAGE_ID } from "./links.js";
import { plainCaption, postPlatform, tokenRecordIsEmpty } from "./sync.js";

// Page posts for one shop page. Docs checked 2026-10-29.
// GET /{page-id}/published_posts on graph.facebook.com v26.0.
// Permissions used by this call: pages_show_list, pages_read_engagement.
// A long-lived Page token has no expiration date (token guide, 30 Jun 2026).
// This function does not refresh it. published_posts is capped at about
// 600 ranked posts a year, so a missing older id is not a deletion.
const GRAPH_VERSION = "v26.0";
const FIELDS = "id,message,created_time,permalink_url,full_picture";

function pageUrlOf(post) {
  if (typeof post.permalink_url === "string" && post.permalink_url.startsWith("https://")) {
    return post.permalink_url;
  }
  if (post.id) return `https://www.facebook.com/${post.id}`;
  return "";
}

async function listPublished(fetchImpl, pageId, accessToken) {
  const params = new URLSearchParams({
    fields: FIELDS,
    limit: "100",
    access_token: accessToken,
  });
  let url = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/published_posts?${params}`;
  const posts = [];
  let guard = 0;
  let previousAfter = "";

  while (guard < 20) {
    guard += 1;
    const response = await fetchImpl(url);
    if (!response.ok) throw new Error(`post list failed (${response.status})`);
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error.message || "post list error");
    posts.push(...(payload.data ?? []));
    const next = payload.paging?.next;
    const after = payload.paging?.cursors?.after;
    if (next) {
      url = next;
      continue;
    }
    if (after && after !== previousAfter) {
      previousAfter = after;
      const page = new URLSearchParams({
        fields: FIELDS,
        limit: "100",
        after,
        access_token: accessToken,
      });
      url = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/published_posts?${page}`;
      continue;
    }
    return posts;
  }

  throw new Error("post list did not end");
}

async function copyPicture(fetchImpl, saveCover, id, url) {
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`cover download failed (${response.status})`);
  const bytes = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return saveCover(id, bytes, contentType);
}

// Copies a still for each new Page post. Does not download a video file.
// An empty list does not wipe stored posts. A post older than the oldest
// post in a finished list is kept, because the list is not the whole page.
export async function runFacebookSync({
  appId,
  appSecret,
  pageId = FACEBOOK_PAGE_ID,
  pageHandle,
  tokenRecord,
  catalog = [],
  fetchImpl,
  saveCover,
  saveCatalog,
}) {
  if (tokenRecordIsEmpty(tokenRecord)) {
    return { ok: false, reason: "no-token", calledFacebook: false };
  }
  if (!appId || !appSecret) {
    return { ok: false, reason: "no-app-credentials", calledFacebook: false };
  }

  const account = tokenRecord.accounts?.[pageId];
  if (!account?.accessToken) {
    return { ok: false, reason: "wrong-page", calledFacebook: false };
  }

  let calledFacebook = false;
  const callFacebook = async (...args) => {
    calledFacebook = true;
    return fetchImpl(...args);
  };

  const nextCatalog = [...catalog];
  try {
    const listed = await listPublished(callFacebook, pageId, account.accessToken);
    const seen = new Set();
    const returnedTimes = [];

    for (const item of listed) {
      if (!item?.id) continue;
      const id = String(item.id);
      seen.add(id);
      const existing = nextCatalog.find((post) => String(post.id) === id);
      if (existing && postPlatform(existing) !== "facebook") continue;
      const created = Date.parse(item.created_time);
      const createTime = Number.isFinite(created) ? Math.floor(created / 1000) : null;
      if (createTime != null) returnedTimes.push(createTime);
      const caption = plainCaption(item.message);
      const pageUrl = pageUrlOf(item);
      if (existing?.coverUrl && postPlatform(existing) === "facebook") {
        existing.caption = caption;
        if (createTime != null) existing.createTime = createTime;
        existing.handle = pageHandle;
        if (pageUrl) existing.pageUrl = pageUrl;
        continue;
      }
      if (!item.full_picture || !pageUrl || createTime == null) continue;
      const coverUrl = await copyPicture(
        callFacebook,
        saveCover,
        id,
        item.full_picture,
      );
      const row = {
        id,
        platform: "facebook",
        handle: pageHandle,
        createTime,
        caption,
        coverUrl,
        pageUrl,
        standIn: false,
      };
      if (existing) Object.assign(existing, row);
      else nextCatalog.push(row);
    }

    // Only ids inside the returned time window can be treated as deleted.
    if (returnedTimes.length > 0) {
      const oldest = Math.min(...returnedTimes);
      const handleKey = String(pageHandle ?? "").replace(/^@/, "").toLowerCase();
      for (let index = nextCatalog.length - 1; index >= 0; index -= 1) {
        const post = nextCatalog[index];
        const postHandle = String(post.handle ?? "").replace(/^@/, "").toLowerCase();
        if (postPlatform(post) !== "facebook" || postHandle !== handleKey) continue;
        if (Number(post.createTime) >= oldest && !seen.has(String(post.id))) {
          nextCatalog.splice(index, 1);
        }
      }
    }

    await saveCatalog(nextCatalog);
    return {
      ok: true,
      reason: "synced",
      calledFacebook,
      posts: nextCatalog,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "partial",
      calledFacebook,
      errors: [{ handle: pageHandle, message: error.message }],
      posts: catalog,
    };
  }
}
