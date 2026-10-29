import { get, put } from "@vercel/blob";
import { homeSocials } from "../data/socials.js";
import { runFacebookSync } from "./facebook-sync.js";
import { runInstagramSync } from "./instagram-sync.js";
import { FACEBOOK_PAGE_ID } from "./links.js";
import { runSync, tokenRecordIsEmpty } from "./sync.js";
import { standInCatalog } from "./stand-in.js";

const CATALOG_PATH = "feed/catalog.json";
const TOKEN_PATHS = {
  tiktok: "tiktok/tokens.json",
  instagram: "instagram/tokens.json",
  facebook: "facebook/tokens.json",
};
const HOUR_MS = 60 * 60 * 1000;
const HOUR_SECONDS = 3600;
const COVER_CACHE_SECONDS = 60 * 60 * 24 * 365;

function publicToken() {
  return (
    process.env.BLOB_PUBLIC_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    ""
  );
}

function privateToken() {
  return process.env.BLOB_PRIVATE_READ_WRITE_TOKEN || "";
}

export function cronAuthorized(request) {
  const secret = process.env.CRON_SECRET || "";
  const header = request.headers.get("authorization") || "";
  return Boolean(secret) && header === `Bearer ${secret}`;
}

async function readJson(pathname, token, access) {
  const result = await get(pathname, {
    access,
    token,
    useCache: false,
  });
  if (!result || result.statusCode === 304 || !result.stream) return null;
  const text = await new Response(result.stream).text();
  if (!text) return null;
  return JSON.parse(text);
}

async function readCatalog() {
  const token = publicToken();
  if (!token) return null;
  try {
    return await readJson(CATALOG_PATH, token, "public");
  } catch {
    return null;
  }
}

async function readTokens(platform) {
  const token = privateToken();
  if (!token) return null;
  try {
    return await readJson(TOKEN_PATHS[platform], token, "private");
  } catch {
    return null;
  }
}

function storedPosts(catalog) {
  return Array.isArray(catalog?.posts)
    ? catalog.posts.filter((post) => !post.standIn)
    : [];
}

async function writeCatalog(posts, platform) {
  const existing = await readCatalog();
  const synced = new Set(
    Array.isArray(existing?.syncedPlatforms) ? existing.syncedPlatforms : [],
  );
  if (platform) synced.add(platform);
  await put(
    CATALOG_PATH,
    JSON.stringify({
      source: "catalog",
      updatedAt: Date.now(),
      syncedPlatforms: [...synced],
      posts,
    }),
    {
      access: "public",
      token: publicToken(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: HOUR_SECONDS,
    },
  );
}

function coverSaver(platform) {
  return async (id, bytes, contentType) => {
    const saved = await put(`covers/${platform}/${id}.jpg`, Buffer.from(bytes), {
      access: "public",
      token: publicToken(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      cacheControlMaxAge: COVER_CACHE_SECONDS,
    });
    return saved.url;
  };
}

function tokenSaver(platform) {
  return async (next) => {
    await put(TOKEN_PATHS[platform], JSON.stringify(next), {
      access: "private",
      token: privateToken(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  };
}

export async function syncIfPossible() {
  const tokenRecord = await readTokens("tiktok");
  if (tokenRecordIsEmpty(tokenRecord)) {
    return { ok: false, reason: "no-token", calledTikTok: false };
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY || "";
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "";
  const existing = await readCatalog();

  return runSync({
    clientKey,
    clientSecret,
    tokenRecord,
    catalog: storedPosts(existing),
    fetchImpl: fetch,
    saveCover: coverSaver("tiktok"),
    saveTokens: tokenSaver("tiktok"),
    saveCatalog: (posts) => writeCatalog(posts, "tiktok"),
  });
}

export async function syncInstagramIfPossible() {
  const tokenRecord = await readTokens("instagram");
  if (tokenRecordIsEmpty(tokenRecord)) {
    return { ok: false, reason: "no-token", calledInstagram: false };
  }

  const existing = await readCatalog();
  return runInstagramSync({
    appId: process.env.INSTAGRAM_APP_ID || "",
    appSecret: process.env.INSTAGRAM_APP_SECRET || "",
    tokenRecord,
    catalog: storedPosts(existing),
    fetchImpl: fetch,
    saveCover: coverSaver("instagram"),
    saveTokens: tokenSaver("instagram"),
    saveCatalog: (posts) => writeCatalog(posts, "instagram"),
  });
}

export async function syncFacebookIfPossible() {
  const tokenRecord = await readTokens("facebook");
  if (tokenRecordIsEmpty(tokenRecord)) {
    return { ok: false, reason: "no-token", calledFacebook: false };
  }

  const page = homeSocials.find((item) => item.platform === "facebook");
  const existing = await readCatalog();
  return runFacebookSync({
    appId: process.env.FACEBOOK_APP_ID || "",
    appSecret: process.env.FACEBOOK_APP_SECRET || "",
    pageId: FACEBOOK_PAGE_ID,
    pageHandle: page?.handle ?? "",
    tokenRecord,
    catalog: storedPosts(existing),
    fetchImpl: fetch,
    saveCover: coverSaver("facebook"),
    saveCatalog: (posts) => writeCatalog(posts, "facebook"),
  });
}

export async function serveFeed() {
  const catalog = await readCatalog();
  const fresh =
    catalog?.source === "catalog" &&
    Array.isArray(catalog.posts) &&
    Date.now() - Number(catalog.updatedAt ?? 0) <= HOUR_MS;

  if (fresh) return catalog;

  await syncIfPossible();
  await syncInstagramIfPossible();
  await syncFacebookIfPossible();
  const refreshed = await readCatalog();
  if (refreshed?.source === "catalog" && Array.isArray(refreshed.posts)) {
    return refreshed;
  }
  return standInCatalog();
}
