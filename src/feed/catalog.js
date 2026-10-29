// A real catalog replaces stand-ins one platform at a time.
// An older TikTok catalog has no syncedPlatforms list. That file is TikTok only.
export function connectedPlatforms(catalog) {
  if (catalog?.source !== "catalog") return [];
  if (Array.isArray(catalog.syncedPlatforms)) return catalog.syncedPlatforms;
  return ["tiktok"];
}

export function postsToShow(catalog, platform, standIns) {
  if (!connectedPlatforms(catalog).includes(platform)) return standIns ?? [];
  return (catalog.posts ?? [])
    .filter((post) => (post.platform ?? "tiktok") === platform)
    .map((post) => ({ ...post, platform: post.platform ?? "tiktok" }));
}
