const LIST_URL = "https://open.tiktokapis.com/v2/video/list/";
const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const LIST_FIELDS = "id,create_time,cover_image_url,video_description";
const PAGE_SIZE = 20;

export function tokenRecordIsEmpty(record) {
  const accounts = record?.accounts;
  if (!accounts || typeof accounts !== "object") return true;
  return Object.keys(accounts).length === 0;
}

function accountHandle(key) {
  return String(key).replace(/^@/, "");
}

async function refreshAccessToken(fetchImpl, clientKey, clientSecret, account) {
  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: account.refreshToken,
  });
  const response = await fetchImpl(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    throw new Error(`token refresh failed (${response.status})`);
  }
  const payload = await response.json();
  const data = payload.data ?? payload;
  if (!data.access_token || !data.refresh_token) {
    throw new Error("token refresh returned no token");
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    accessExpiresAt: Date.now() + Number(data.expires_in ?? 0) * 1000,
    refreshExpiresAt:
      Date.now() + Number(data.refresh_expires_in ?? 0) * 1000,
  };
}

async function listAllVideos(fetchImpl, accessToken) {
  const videos = [];
  let cursor = 0;
  let guard = 0;

  while (guard < 100) {
    guard += 1;
    const response = await fetchImpl(
      `${LIST_URL}?fields=${LIST_FIELDS}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ max_count: PAGE_SIZE, cursor }),
      },
    );
    if (!response.ok) {
      throw new Error(`video list failed (${response.status})`);
    }
    const payload = await response.json();
    if (payload.error && payload.error.code && payload.error.code !== "ok") {
      throw new Error(payload.error.message || "video list error");
    }
    const page = payload.data?.videos ?? [];
    videos.push(...page);
    if (!payload.data?.has_more) {
      return videos;
    }
    cursor = payload.data.cursor;
  }

  throw new Error("video list did not end");
}

async function copyCover(fetchImpl, saveCover, video) {
  if (!video.cover_image_url) {
    throw new Error("missing cover");
  }
  const response = await fetchImpl(video.cover_image_url);
  if (!response.ok) {
    throw new Error(`cover download failed (${response.status})`);
  }
  const bytes = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return saveCover(video.id, bytes, contentType);
}

export function plainCaption(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function captionOf(video) {
  return plainCaption(video.video_description);
}

export function postPlatform(post) {
  return post.platform ?? "tiktok";
}

// Asks TikTok for new videos and copies each new cover once.
// With no stored artist token, it returns before any network call.
export async function runSync({
  clientKey,
  clientSecret,
  tokenRecord,
  catalog = [],
  fetchImpl,
  now = () => Date.now(),
  saveCover,
  saveTokens,
  saveCatalog,
}) {
  if (tokenRecordIsEmpty(tokenRecord)) {
    return { ok: false, reason: "no-token", calledTikTok: false };
  }
  if (!clientKey || !clientSecret) {
    return { ok: false, reason: "no-app-credentials", calledTikTok: false };
  }

  let calledTikTok = false;
  const callTikTok = async (...args) => {
    calledTikTok = true;
    return fetchImpl(...args);
  };

  const accounts = { ...tokenRecord.accounts };
  let tokensChanged = false;
  let completedAccounts = 0;
  const nextCatalog = [...catalog];
  const errors = [];

  for (const [rawHandle, account] of Object.entries(accounts)) {
    const handle = accountHandle(rawHandle);
    try {
      let current = { ...account };
      const expiresAt = Number(current.accessExpiresAt ?? 0);
      if (!current.accessToken || expiresAt <= now() + 60_000) {
        current = await refreshAccessToken(
          callTikTok,
          clientKey,
          clientSecret,
          current,
        );
        accounts[rawHandle] = current;
        tokensChanged = true;
      }

      const videos = await listAllVideos(callTikTok, current.accessToken);
      const seen = new Set(videos.map((video) => String(video.id)));
      const handleKey = handle.toLowerCase();

      for (const video of videos) {
        const id = String(video.id);
        const existing = nextCatalog.find((post) => post.id === id);
        const caption = captionOf(video);
        if (existing?.coverUrl) {
          existing.caption = caption;
          existing.createTime = Number(video.create_time);
          existing.handle = `@${handle}`;
          existing.platform = "tiktok";
          continue;
        }
        const coverUrl = await copyCover(callTikTok, saveCover, video);
        if (existing) {
          existing.coverUrl = coverUrl;
          existing.caption = caption;
          existing.createTime = Number(video.create_time);
          existing.handle = `@${handle}`;
          existing.platform = "tiktok";
          existing.standIn = false;
        } else {
          nextCatalog.push({
            id,
            platform: "tiktok",
            handle: `@${handle}`,
            createTime: Number(video.create_time),
            caption,
            coverUrl,
            standIn: false,
          });
        }
      }

      for (let index = nextCatalog.length - 1; index >= 0; index -= 1) {
        const post = nextCatalog[index];
        const postHandle = String(post.handle ?? "")
          .replace(/^@/, "")
          .toLowerCase();
        // Same @handle can be Instagram. Only a finished TikTok list drops TikTok posts.
        if (
          postPlatform(post) === "tiktok" &&
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

  if (tokensChanged) {
    await saveTokens({ accounts });
  }
  if (completedAccounts > 0) {
    await saveCatalog(nextCatalog);
  }

  return {
    ok: errors.length === 0,
    reason: errors.length === 0 ? "synced" : "partial",
    calledTikTok,
    errors,
    posts: nextCatalog,
  };
}
