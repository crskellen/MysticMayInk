import { normalizeHandle } from "./order.js";

const TIKTOK_PACKAGE = "com.zhiliaoapp.musically";

export function videoPageUrl(handle, id) {
  const name = normalizeHandle(handle);
  return `https://www.tiktok.com/@${name}/video/${id}`;
}

export function androidIntentUrl(handle, id) {
  const page = videoPageUrl(handle, id);
  const fallback = encodeURIComponent(page);
  return `intent://www.tiktok.com/@${normalizeHandle(handle)}/video/${id}#Intent;scheme=https;package=${TIKTOK_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

export function deviceFromUserAgent(userAgent) {
  const agent = userAgent ?? "";
  if (/Android/i.test(agent)) return "android";
  if (/iPhone|iPad|iPod/i.test(agent)) return "ios";
  return "desktop";
}

const ANDROID_PACKAGES = {
  tiktok: "com.zhiliaoapp.musically",
  instagram: "com.instagram.android",
  facebook: "com.facebook.katana",
};

export const FACEBOOK_PAGE_ID = "100092596201830";

export function postPageUrl(post) {
  if (typeof post.pageUrl === "string" && post.pageUrl.startsWith("https://")) {
    return post.pageUrl;
  }
  const platform = post.platform ?? "tiktok";
  if (platform === "instagram") {
    return `https://www.instagram.com/p/${post.id}/`;
  }
  if (platform === "facebook") {
    return `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/${post.id}`;
  }
  return videoPageUrl(post.handle, post.id);
}

// Desktop opens a new tab. Phones stay in the same tab so the OS can
// hand the https address to the installed app. Android uses an intent
// for that app's package. No instagram://, fb://, or snssdk scheme.
export function linkForPost(post, device) {
  const platform = post.platform ?? "tiktok";
  const page = postPageUrl(post);
  if (device === "android") {
    const path = page.replace(/^https:\/\//, "");
    const fallback = encodeURIComponent(page);
    const pkg = ANDROID_PACKAGES[platform];
    return {
      href: `intent://${path}#Intent;scheme=https;package=${pkg};S.browser_fallback_url=${fallback};end`,
      newTab: false,
    };
  }
  if (device === "ios") return { href: page, newTab: false };
  return { href: page, newTab: true };
}

// Desktop opens a new tab. Phones stay in the same tab so the OS can
// hand the address to the TikTok app. Android uses the US package intent.
export function linkForDevice(handle, id, device) {
  const page = videoPageUrl(handle, id);
  if (device === "android") {
    return { href: androidIntentUrl(handle, id), newTab: false };
  }
  if (device === "ios") {
    return { href: page, newTab: false };
  }
  return { href: page, newTab: true };
}
