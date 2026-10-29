import { homeSocials } from "../data/socials.js";

export function normalizeHandle(handle) {
  return String(handle ?? "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();
}

function idRank(id) {
  return String(id ?? "");
}

export function comparePosts(a, b) {
  const timeDelta = Number(a.createTime) - Number(b.createTime);
  if (timeDelta !== 0) return timeDelta;
  return idRank(a.id).localeCompare(idRank(b.id), "en", { numeric: true });
}

function platformOf(post) {
  return post.platform ?? "tiktok";
}

function shopHandle(platform) {
  const account = homeSocials.find((item) => item.platform === platform);
  return normalizeHandle(account?.handle);
}

function collect(posts, accept) {
  const seen = new Set();
  const kept = [];
  for (const post of posts ?? []) {
    if (!accept(post)) continue;
    if (seen.has(post.id)) continue;
    seen.add(post.id);
    kept.push(post);
  }
  kept.sort(comparePosts);
  return kept;
}

// One TikTok feed for the handles in `artists`, earliest post first.
// A video id is kept once. A handle that is not on the list is left out.
// The page rail reverses this with newestFirst so scrolling goes back in time.
export function postsForArtists(posts, artists) {
  const handles = new Set(
    (artists ?? []).map((artist) => normalizeHandle(artist.tiktokHandle)),
  );
  return collect(posts, (post) => {
    if (platformOf(post) !== "tiktok") return false;
    return handles.has(normalizeHandle(post.handle));
  });
}

function instagramHandle(artist) {
  const account = artist.socials?.find((item) => item.platform === "instagram");
  return account?.handle ?? "";
}

// Earliest first. Facebook is the shop page only. Instagram on Home also
// includes the shop account when `includeShop` is set. An artist page does not.
export function postsForPlatform(posts, artists, platform, options = {}) {
  if (platform === "facebook") {
    if (!options.includeShop) return [];
    const shop = shopHandle("facebook");
    return collect(posts, (post) => {
      return (
        platformOf(post) === "facebook" &&
        normalizeHandle(post.handle) === shop
      );
    });
  }
  if (platform === "instagram") {
    const handles = new Set(
      (artists ?? [])
        .map((artist) => normalizeHandle(instagramHandle(artist)))
        .filter(Boolean),
    );
    if (options.includeShop) handles.add(shopHandle("instagram"));
    return collect(posts, (post) => {
      return (
        platformOf(post) === "instagram" &&
        handles.has(normalizeHandle(post.handle))
      );
    });
  }
  return postsForArtists(posts, artists);
}

export function postsForArtist(posts, artist) {
  if (!artist) return [];
  return postsForArtists(posts, [artist]);
}

// One artist's newsfeed. Their TikTok and Instagram only, earliest first.
// Shop Instagram, the shop Facebook page, and the other artist stay out.
// Meagan's TikTok is @capriceink_, which is also the shop TikTok, so those
// videos are hers here.
export function postsForArtistFeed(posts, artist) {
  if (!artist) return [];
  const tiktok = normalizeHandle(artist.tiktokHandle);
  const instagram = normalizeHandle(instagramHandle(artist));
  return collect(posts, (post) => {
    const handle = normalizeHandle(post.handle);
    const platform = platformOf(post);
    if (platform === "tiktok") return handle === tiktok;
    if (platform === "instagram") return Boolean(instagram) && handle === instagram;
    return false;
  });
}

// One home newsfeed. Shop accounts and every artist's accounts, on every
// platform, earliest first. The same profile on two platforms stays twice,
// because those are different posts. @capriceink_ is both the shop TikTok
// and Meagan's TikTok, so that profile is included once.
export function postsForNewsfeed(posts, artists) {
  const tiktok = new Set(
    (artists ?? []).map((artist) => normalizeHandle(artist.tiktokHandle)),
  );
  const instagram = new Set(
    (artists ?? [])
      .map((artist) => normalizeHandle(instagramHandle(artist)))
      .filter(Boolean),
  );
  tiktok.add(shopHandle("tiktok"));
  instagram.add(shopHandle("instagram"));
  const facebook = shopHandle("facebook");
  return collect(posts, (post) => {
    const handle = normalizeHandle(post.handle);
    const platform = platformOf(post);
    if (platform === "tiktok") return tiktok.has(handle);
    if (platform === "instagram") return instagram.has(handle);
    if (platform === "facebook") return handle === facebook;
    return false;
  });
}

// `posts` must already be in comparePosts order. The rail starts at the newest.
export function newestFirst(posts) {
  return [...(posts ?? [])].reverse();
}
