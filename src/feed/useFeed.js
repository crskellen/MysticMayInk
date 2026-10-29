import { useEffect, useState } from "react";
import { connectedPlatforms, postsToShow } from "./catalog.js";
import { withSampleCovers } from "./sample-covers.js";
import {
  facebookStandIns,
  instagramStandIns,
  standInCatalog,
  standInPosts,
} from "./stand-in.js";

function present(catalog) {
  const connected = new Set(connectedPlatforms(catalog));
  const section = (platform, standIns) => {
    const posts = postsToShow(catalog, platform, standIns);
    return connected.has(platform) ? posts : withSampleCovers(posts);
  };
  return {
    source: catalog?.source ?? "stand-in",
    posts: [
      ...section("tiktok", standInPosts),
      ...section("instagram", instagramStandIns),
      ...section("facebook", facebookStandIns),
    ],
  };
}

export function useFeed() {
  const [catalog, setCatalog] = useState(() => present(standInCatalog()));

  useEffect(() => {
    let cancelled = false;

    fetch("/api/feed")
      .then((response) => {
        if (!response.ok) throw new Error("feed unavailable");
        return response.json();
      })
      .then((payload) => {
        if (cancelled || !payload || !Array.isArray(payload.posts)) return;
        if (payload.source === "catalog") setCatalog(present(payload));
      })
      .catch(() => {
        if (!cancelled) setCatalog(present(standInCatalog()));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return catalog;
}
