import assert from "node:assert/strict";
import test from "node:test";
import { postsToShow } from "../src/feed/catalog.js";
import { runFacebookSync } from "../src/feed/facebook-sync.js";
import { runInstagramSync } from "../src/feed/instagram-sync.js";
import { FACEBOOK_PAGE_ID, linkForPost } from "../src/feed/links.js";
import { instagramStandIns } from "../src/feed/stand-in.js";
import { runSync } from "../src/feed/sync.js";

const DAY = 24 * 60 * 60 * 1000;

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function igToken(overrides = {}) {
  return {
    accounts: {
      capriceink: {
        accessToken: "ig-token",
        accessExpiresAt: Date.now() + 50 * DAY,
        obtainedAt: Date.now(),
        ...overrides,
      },
    },
  };
}

function igSync(overrides) {
  return runInstagramSync({
    appId: "app",
    appSecret: "secret",
    tokenRecord: igToken(),
    catalog: [],
    fetchImpl: async () => {
      throw new Error("unexpected request");
    },
    saveCover: async () => "https://blob.example/cover.jpg",
    saveTokens: async () => {},
    saveCatalog: async () => {},
    ...overrides,
  });
}

test("tiktok sync does not drop an instagram post with the same handle", async () => {
  const result = await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: {
      accounts: {
        inksbybritt: {
          accessToken: "act",
          accessExpiresAt: Date.now() + DAY,
          refreshToken: "rft",
        },
      },
    },
    catalog: [
      {
        id: "9",
        platform: "tiktok",
        handle: "@inksbybritt",
        createTime: 10,
        caption: "gone on TikTok",
        coverUrl: "https://blob.example/9.jpg",
      },
      {
        id: "ig-1",
        platform: "instagram",
        handle: "@inksbybritt",
        createTime: 11,
        caption: "stays",
        coverUrl: "https://blob.example/ig-1.jpg",
      },
    ],
    fetchImpl: async () =>
      jsonResponse({
        data: { videos: [], has_more: false },
        error: { code: "ok" },
      }),
    saveCover: async () => "unused",
    saveTokens: async () => {},
    saveCatalog: async () => {},
  });

  assert.deepEqual(
    result.posts.map((post) => post.id),
    ["ig-1"],
  );
});

test("instagram sync refuses without a token and does not call Instagram", async () => {
  let calls = 0;
  const result = await igSync({
    tokenRecord: null,
    fetchImpl: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
  });
  assert.equal(result.reason, "no-token");
  assert.equal(result.calledInstagram, false);
  assert.equal(calls, 0);
});

test("instagram sync refuses without app credentials", async () => {
  let calls = 0;
  const result = await igSync({
    appId: "",
    appSecret: "",
    fetchImpl: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
  });
  assert.equal(result.reason, "no-app-credentials");
  assert.equal(calls, 0);
});

test("instagram copies a still once and updates the caption without downloading again", async () => {
  const downloads = [];
  const media = (caption) =>
    jsonResponse({
      data: [
        {
          id: "1789",
          caption,
          media_type: "IMAGE",
          media_url: "https://cdn.example/ig.jpg",
          permalink: "https://www.instagram.com/p/abc/",
          timestamp: "2026-10-29T18:00:00+0000",
        },
      ],
    });

  const first = await igSync({
    fetchImpl: async (url) => {
      if (String(url).includes("cdn.example/ig.jpg")) {
        downloads.push(url);
        return new Response(new Uint8Array([1]), {
          status: 200,
          headers: { "content-type": "image/jpeg" },
        });
      }
      return media("First line");
    },
    saveCover: async (id) => `https://blob.example/${id}.jpg`,
  });

  assert.equal(downloads.length, 1);
  assert.equal(first.posts[0].coverUrl, "https://blob.example/1789.jpg");
  assert.equal(first.posts[0].platform, "instagram");
  assert.equal(first.posts[0].pageUrl, "https://www.instagram.com/p/abc/");
  assert.equal(first.posts[0].handle, "@capriceink");

  const second = await igSync({
    catalog: first.posts,
    fetchImpl: async (url) => {
      if (String(url).includes("cdn.example")) {
        throw new Error("cover was downloaded again");
      }
      return media("Edited line");
    },
    saveCover: async () => {
      throw new Error("cover was saved again");
    },
  });
  assert.equal(second.posts[0].caption, "Edited line");
  assert.equal(second.posts[0].coverUrl, "https://blob.example/1789.jpg");
});

test("instagram video stores the thumbnail, not the video file", async () => {
  const result = await igSync({
    fetchImpl: async (url) => {
      const address = String(url);
      if (address.includes("video.mp4")) throw new Error("video file was requested");
      if (address.includes("thumb.jpg")) {
        return new Response(new Uint8Array([1]), { status: 200 });
      }
      return jsonResponse({
        data: [
          {
            id: "55",
            media_type: "VIDEO",
            media_product_type: "REELS",
            media_url: "https://cdn.example/video.mp4",
            thumbnail_url: "https://cdn.example/thumb.jpg",
            permalink: "https://www.instagram.com/reel/xyz/",
            timestamp: "2026-10-29T18:00:00+0000",
            caption: "A reel",
          },
        ],
      });
    },
    saveCover: async (id) => `https://blob.example/${id}.jpg`,
  });
  assert.equal(result.posts[0].pageUrl, "https://www.instagram.com/reel/xyz/");
  assert.equal(result.posts[0].coverUrl, "https://blob.example/55.jpg");
});

test("instagram carousel uses the first child still", async () => {
  let requested = "";
  const result = await igSync({
    fetchImpl: async (url) => {
      const address = String(url);
      if (address.includes("cdn.example")) {
        requested = address;
        return new Response(new Uint8Array([1]), { status: 200 });
      }
      return jsonResponse({
        data: [
          {
            id: "77",
            media_type: "CAROUSEL_ALBUM",
            permalink: "https://www.instagram.com/p/car/",
            timestamp: "2026-10-29T18:00:00+0000",
            caption: "Three slides",
            children: {
              data: [
                { media_type: "IMAGE", media_url: "https://cdn.example/slide.jpg" },
              ],
            },
          },
        ],
      });
    },
  });
  assert.match(requested, /slide\.jpg/);
  assert.equal(result.posts.length, 1);
});

test("a story is not stored", async () => {
  let saved = false;
  const result = await igSync({
    fetchImpl: async () =>
      jsonResponse({
        data: [
          {
            id: "story-1",
            media_type: "IMAGE",
            media_product_type: "STORY",
            media_url: "https://cdn.example/story.jpg",
            permalink: "https://www.instagram.com/stories/capriceink/1/",
            timestamp: "2026-10-29T18:00:00+0000",
          },
        ],
      }),
    saveCover: async () => {
      saved = true;
      return "nope";
    },
  });
  assert.equal(saved, false);
  assert.equal(result.posts.length, 0);
});

test("an unfinished instagram list does not drop a stored post", async () => {
  let saved = false;
  const stored = {
    id: "1789",
    platform: "instagram",
    handle: "@capriceink",
    createTime: 100,
    caption: "kept",
    coverUrl: "https://blob.example/1789.jpg",
    pageUrl: "https://www.instagram.com/p/abc/",
  };
  const result = await igSync({
    catalog: [stored],
    fetchImpl: async (url) => {
      if (String(url).includes("after=next")) {
        return new Response("no", { status: 500 });
      }
      return jsonResponse({
        data: [],
        paging: { next: "https://graph.instagram.com/v26.0/me/media?after=next" },
      });
    },
    saveCatalog: async () => {
      saved = true;
    },
  });
  assert.equal(result.ok, false);
  assert.equal(saved, false);
  assert.equal(result.posts[0].id, "1789");
});

test("a finished instagram list drops only that account's instagram posts", async () => {
  const result = await igSync({
    tokenRecord: igToken(),
    catalog: [
      {
        id: "ig-old",
        platform: "instagram",
        handle: "@capriceink",
        createTime: 10,
        caption: "removed",
        coverUrl: "https://blob.example/ig-old.jpg",
      },
      {
        id: "tt-1",
        platform: "tiktok",
        handle: "@capriceink",
        createTime: 11,
        caption: "tiktok stays",
        coverUrl: "https://blob.example/tt-1.jpg",
      },
    ],
    fetchImpl: async () => jsonResponse({ data: [] }),
  });
  assert.deepEqual(
    result.posts.map((post) => post.id),
    ["tt-1"],
  );
});

test("instagram refreshes a token that is old enough and near expiry", async () => {
  let saved = null;
  await igSync({
    tokenRecord: igToken({
      accessToken: "old-token",
      accessExpiresAt: Date.now() + 2 * DAY,
      obtainedAt: Date.now() - 2 * DAY,
    }),
    fetchImpl: async (url) => {
      if (String(url).includes("refresh_access_token")) {
        return jsonResponse({ access_token: "new-token", expires_in: 5183944 });
      }
      return jsonResponse({ data: [] });
    },
    saveTokens: async (record) => {
      saved = record;
    },
  });
  assert.equal(saved.accounts.capriceink.accessToken, "new-token");
});

test("instagram does not refresh a token younger than 24 hours", async () => {
  await igSync({
    tokenRecord: igToken({
      accessToken: "young-token",
      accessExpiresAt: Date.now() + 2 * DAY,
      obtainedAt: Date.now() - 60 * 60 * 1000,
    }),
    fetchImpl: async (url) => {
      if (String(url).includes("refresh_access_token")) {
        throw new Error("refreshed too soon");
      }
      return jsonResponse({ data: [] });
    },
    saveTokens: async () => {
      throw new Error("tokens should stay");
    },
  });
});

test("facebook sync refuses without a token", async () => {
  let calls = 0;
  const result = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: null,
    fetchImpl: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
    saveCover: async () => "unused",
    saveCatalog: async () => {
      throw new Error("should not save");
    },
  });
  assert.equal(result.reason, "no-token");
  assert.equal(result.calledFacebook, false);
  assert.equal(calls, 0);
});

test("facebook sync ignores a token for a different page", async () => {
  let calls = 0;
  const result = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: { accounts: { 999: { accessToken: "other" } } },
    fetchImpl: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
    saveCover: async () => "unused",
    saveCatalog: async () => {
      throw new Error("should not save");
    },
  });
  assert.equal(result.reason, "wrong-page");
  assert.equal(calls, 0);
});

test("facebook copies a picture once and updates the caption", async () => {
  const downloads = [];
  const post = (message) =>
    jsonResponse({
      data: [
        {
          id: `${FACEBOOK_PAGE_ID}_10`,
          message,
          created_time: "2026-10-29T20:00:00+0000",
          permalink_url: `https://www.facebook.com/${FACEBOOK_PAGE_ID}/posts/10`,
          full_picture: "https://cdn.example/fb.jpg",
        },
      ],
    });
  const first = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: {
      accounts: { [FACEBOOK_PAGE_ID]: { accessToken: "page-token" } },
    },
    fetchImpl: async (url) => {
      if (String(url).includes("cdn.example/fb.jpg")) {
        downloads.push(String(url));
        return new Response(new Uint8Array([1]), { status: 200 });
      }
      return post("Wrapped");
    },
    saveCover: async (id) => `https://blob.example/${id}.jpg`,
    saveCatalog: async () => {},
  });
  assert.equal(downloads.length, 1);
  assert.equal(first.posts[0].handle, "Mystic May Tattoo");
  assert.equal(first.posts[0].platform, "facebook");

  const second = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: {
      accounts: { [FACEBOOK_PAGE_ID]: { accessToken: "page-token" } },
    },
    catalog: first.posts,
    fetchImpl: async (url) => {
      if (String(url).includes("cdn.example")) throw new Error("downloaded again");
      return post("Wrapped today");
    },
    saveCover: async () => {
      throw new Error("saved again");
    },
    saveCatalog: async () => {},
  });
  assert.equal(second.posts[0].caption, "Wrapped today");
});

test("facebook keeps a post older than the returned list", async () => {
  const result = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: {
      accounts: { [FACEBOOK_PAGE_ID]: { accessToken: "page-token" } },
    },
    catalog: [
      {
        id: "old",
        platform: "facebook",
        handle: "Mystic May Tattoo",
        createTime: 1000,
        caption: "older than the window",
        coverUrl: "https://blob.example/old.jpg",
      },
    ],
    fetchImpl: async (url) => {
      if (String(url).includes("cdn.example")) {
        return new Response(new Uint8Array([1]), { status: 200 });
      }
      return jsonResponse({
        data: [
          {
            id: "new",
            message: "recent",
            created_time: "2026-10-29T20:00:00+0000",
            permalink_url: "https://www.facebook.com/p/10",
            full_picture: "https://cdn.example/new.jpg",
          },
        ],
      });
    },
    saveCover: async () => "https://blob.example/new.jpg",
    saveCatalog: async () => {},
  });
  assert.equal(
    result.posts.some((post) => post.id === "old"),
    true,
  );
});

test("facebook drops a missing post inside the returned window", async () => {
  const result = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: {
      accounts: { [FACEBOOK_PAGE_ID]: { accessToken: "page-token" } },
    },
    catalog: [
      {
        id: "gone",
        platform: "facebook",
        handle: "Mystic May Tattoo",
        createTime: 1793290000,
        caption: "deleted",
        coverUrl: "https://blob.example/gone.jpg",
      },
      {
        id: "ig",
        platform: "instagram",
        handle: "@mysticmaytattoo",
        createTime: 1793290000,
        caption: "not facebook",
        coverUrl: "https://blob.example/ig.jpg",
      },
    ],
    fetchImpl: async () =>
      jsonResponse({
        data: [
          {
            id: "kept",
            message: "still up",
            created_time: "2026-10-27T12:00:00+0000",
            permalink_url: "https://www.facebook.com/p/kept",
            full_picture: "https://cdn.example/kept.jpg",
          },
        ],
      }),
    saveCover: async () => "https://blob.example/kept.jpg",
    saveCatalog: async () => {},
  });
  assert.equal(
    result.posts.some((post) => post.id === "gone"),
    false,
  );
  assert.equal(
    result.posts.some((post) => post.id === "ig"),
    true,
  );
});

test("an empty facebook list does not wipe stored posts", async () => {
  const stored = {
    id: "kept",
    platform: "facebook",
    handle: "Mystic May Tattoo",
    createTime: 100,
    caption: "stays",
    coverUrl: "https://blob.example/kept.jpg",
  };
  const result = await runFacebookSync({
    appId: "app",
    appSecret: "secret",
    pageHandle: "Mystic May Tattoo",
    tokenRecord: {
      accounts: { [FACEBOOK_PAGE_ID]: { accessToken: "page-token" } },
    },
    catalog: [stored],
    fetchImpl: async () => jsonResponse({ data: [] }),
    saveCover: async () => "unused",
    saveCatalog: async () => {},
  });
  assert.equal(result.posts.length, 1);
  assert.equal(result.posts[0].id, "kept");
});

test("a catalog without syncedPlatforms is tiktok only", () => {
  const catalog = {
    source: "catalog",
    posts: [
      {
        id: "1",
        handle: "@capriceink_",
        createTime: 1,
        caption: "real",
        coverUrl: "https://blob.example/1.jpg",
      },
    ],
  };
  assert.equal(postsToShow(catalog, "tiktok", []).length, 1);
  assert.equal(postsToShow(catalog, "instagram", instagramStandIns), instagramStandIns);
});

test("a synced instagram catalog replaces instagram samples", () => {
  const real = {
    id: "1789",
    platform: "instagram",
    handle: "@capriceink",
    createTime: 20,
    caption: "real",
    coverUrl: "https://blob.example/1789.jpg",
  };
  const catalog = {
    source: "catalog",
    syncedPlatforms: ["instagram"],
    posts: [real],
  };
  assert.deepEqual(postsToShow(catalog, "instagram", instagramStandIns), [real]);
  assert.equal(postsToShow(catalog, "tiktok", [{ id: "sample" }]).length, 1);
});

test("a stored permalink is the link the card uses", () => {
  const card = linkForPost(
    {
      platform: "instagram",
      id: "1789",
      pageUrl: "https://www.instagram.com/reel/xyz/",
    },
    "desktop",
  );
  assert.equal(card.href, "https://www.instagram.com/reel/xyz/");
  assert.equal(card.newTab, true);
});
