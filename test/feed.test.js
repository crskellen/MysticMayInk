import assert from "node:assert/strict";
import test from "node:test";
import { artists } from "../src/data/artists.js";
import { linkForDevice, linkForPost, videoPageUrl } from "../src/feed/links.js";
import { newestFirst, postsForArtist, postsForArtists, postsForPlatform } from "../src/feed/order.js";
import { facebookStandIns, instagramStandIns, standInPosts } from "../src/feed/stand-in.js";
import { postedLabel } from "../src/feed/time.js";
import { runSync } from "../src/feed/sync.js";

test("home stand-ins follow the 9:00, 10:00, 12:00, 12:15 order", () => {
  const posts = postsForArtists(standInPosts, artists);
  const sampleDay = posts.filter((post) =>
    ["1002", "1003", "1004", "1005"].some((suffix) => post.id.endsWith(suffix)),
  );
  assert.deepEqual(
    sampleDay.map((post) => post.handle),
    ["@capriceink_", "@inksbybritt", "@inksbybritt", "@capriceink_"],
  );
  assert.deepEqual(
    posts.map((post) => post.id.slice(-4)),
    ["1001", "1002", "1003", "1004", "1005", "1006"],
  );
});

test("the rail starts at the newest post and scrolling goes back in time", () => {
  const posts = newestFirst(postsForArtists(standInPosts, artists));
  assert.deepEqual(
    posts.map((post) => post.id.slice(-4)),
    ["1006", "1005", "1004", "1003", "1002", "1001"],
  );
  assert.equal(postedLabel(posts[0].createTime), "Oct 29, 8:00 AM");
  assert.equal(postedLabel(posts[posts.length - 1].createTime), "Oct 27, 3:00 PM");
});

test("an artist page keeps only that artist, earliest first before the rail reverses it", () => {
  const meagan = artists.find((artist) => artist.id === "meagan");
  const posts = postsForArtist(standInPosts, meagan);
  assert.deepEqual(
    posts.map((post) => post.id.slice(-4)),
    ["1001", "1002", "1005"],
  );
  assert.deepEqual(
    newestFirst(posts).map((post) => post.id.slice(-4)),
    ["1005", "1002", "1001"],
  );
});

test("home instagram merges the shop and both artists, newest first", () => {
  const posts = newestFirst(
    postsForPlatform(
      [...standInPosts, ...instagramStandIns, ...facebookStandIns],
      artists,
      "instagram",
      { includeShop: true },
    ),
  );
  assert.deepEqual(
    posts.map((post) => post.id),
    [
      "MMIGmeg002",
      "MMIGshop002",
      "MMIGbrt002",
      "MMIGbrt001",
      "MMIGmeg001",
      "MMIGshop001",
    ],
  );
});

test("an artist instagram tab is only that artist's instagram", () => {
  const meagan = artists.find((artist) => artist.id === "meagan");
  const posts = postsForPlatform(
    [...standInPosts, ...instagramStandIns, ...facebookStandIns],
    [meagan],
    "instagram",
  );
  assert.deepEqual(
    posts.map((post) => post.id),
    ["MMIGmeg001", "MMIGmeg002"],
  );
});

test("facebook is the shop page and an artist filter has none", () => {
  const all = [...standInPosts, ...instagramStandIns, ...facebookStandIns];
  const home = postsForPlatform(all, artists, "facebook", { includeShop: true });
  assert.deepEqual(
    home.map((post) => post.id),
    ["900000000000001", "900000000000002"],
  );
  const meagan = artists.find((artist) => artist.id === "meagan");
  assert.equal(postsForPlatform(all, [meagan], "facebook").length, 0);
});

test("a handle used on two platforms stays on the selected one", () => {
  const britt = artists.find((artist) => artist.id === "britt");
  const all = [...standInPosts, ...instagramStandIns];
  const tiktok = postsForArtist(all, britt);
  const instagram = postsForPlatform(all, [britt], "instagram");
  assert.equal(tiktok.every((post) => post.platform === "tiktok"), true);
  assert.equal(instagram.every((post) => post.platform === "instagram"), true);
  assert.equal(tiktok.some((post) => post.id.startsWith("MMIG")), false);
});

test("instagram and facebook links stay on https", () => {
  const ig = linkForPost(instagramStandIns[0], "desktop");
  const igPhone = linkForPost(instagramStandIns[0], "android");
  const fb = linkForPost(facebookStandIns[0], "android");
  assert.equal(ig.newTab, true);
  assert.equal(ig.href, "https://www.instagram.com/p/MMIGshop001/");
  assert.equal(igPhone.href.includes("package=com.instagram.android"), true);
  assert.equal(igPhone.href.includes("instagram://"), false);
  assert.equal(fb.href.includes("package=com.facebook.katana"), true);
  assert.equal(fb.href.includes("fb://"), false);
});

test("a handle that is not an artist stays off the home feed", () => {
  const extra = {
    id: "7100000000000001999",
    handle: "@someoneelse",
    createTime: 1793190000,
    caption: "nope",
    coverUrl: "/nope.svg",
  };
  const posts = postsForArtists([extra, ...standInPosts], artists);
  assert.equal(
    posts.some((post) => post.handle === "@someoneelse"),
    false,
  );
});

test("the same video id is kept once", () => {
  const duplicate = { ...standInPosts[1], caption: "second copy" };
  const posts = postsForArtists([standInPosts[1], duplicate], artists);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].caption, standInPosts[1].caption);
});

test("equal timestamps sort by video id ascending", () => {
  const posts = postsForArtists(
    [
      {
        id: "20",
        handle: "@inksbybritt",
        createTime: 50,
        caption: "later id",
        coverUrl: "/a.svg",
      },
      {
        id: "3",
        handle: "@capriceink_",
        createTime: 50,
        caption: "earlier id",
        coverUrl: "/b.svg",
      },
    ],
    artists,
  );
  assert.deepEqual(
    posts.map((post) => post.id),
    ["3", "20"],
  );
});

test("desktop, iPhone, and Android links", () => {
  const desktop = linkForDevice("@capriceink_", "123", "desktop");
  const ios = linkForDevice("@Inksbybritt", "123", "ios");
  const android = linkForDevice("@capriceink_", "123", "android");

  assert.equal(desktop.newTab, true);
  assert.equal(desktop.href, "https://www.tiktok.com/@capriceink_/video/123");
  assert.equal(ios.newTab, false);
  assert.equal(ios.href, videoPageUrl("@inksbybritt", "123"));
  assert.equal(android.newTab, false);
  assert.match(android.href, /^intent:\/\/www\.tiktok\.com\//);
  assert.match(android.href, /package=com\.zhiliaoapp\.musically/);
  assert.match(android.href, /browser_fallback_url=/);
  assert.doesNotMatch(android.href, /snssdk1233/);
});

test("sync refuses when no artist token is stored and does not call TikTok", async () => {
  let calls = 0;
  const result = await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: null,
    fetchImpl: async () => {
      calls += 1;
      throw new Error("should not be called");
    },
    saveCover: async () => {
      throw new Error("should not save");
    },
    saveTokens: async () => {
      throw new Error("should not save");
    },
    saveCatalog: async () => {
      throw new Error("should not save");
    },
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "no-token");
  assert.equal(result.calledTikTok, false);
  assert.equal(calls, 0);
});

test("sync copies a new cover once and does not download it again", async () => {
  const coverHits = [];
  const catalogSaves = [];
  const fetchImpl = async (url) => {
    if (String(url).includes("video/list")) {
      return jsonResponse({
        data: {
          videos: [
            {
              id: "555",
              create_time: 100,
              cover_image_url: "https://cdn.example/cover.jpg",
              video_description: "A fern",
            },
          ],
          has_more: false,
        },
        error: { code: "ok" },
      });
    }
    if (String(url) === "https://cdn.example/cover.jpg") {
      coverHits.push(url);
      return new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "content-type": "image/jpeg" },
      });
    }
    throw new Error(`unexpected ${url}`);
  };

  const first = await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: {
      accounts: {
        capriceink_: {
          accessToken: "act",
          accessExpiresAt: Date.now() + 3_600_000,
          refreshToken: "rft",
        },
      },
    },
    catalog: [],
    fetchImpl,
    saveCover: async (id) => `https://blob.example/${id}.jpg`,
    saveTokens: async () => {},
    saveCatalog: async (posts) => {
      catalogSaves.push(posts);
    },
  });

  assert.equal(first.ok, true);
  assert.equal(coverHits.length, 1);
  assert.equal(first.posts[0].coverUrl, "https://blob.example/555.jpg");
  assert.equal(first.posts[0].caption, "A fern");
  assert.equal(
    first.posts.some((post) => post.coverUrl?.includes("cdn.example")),
    false,
  );

  const second = await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: {
      accounts: {
        capriceink_: {
          accessToken: "act",
          accessExpiresAt: Date.now() + 3_600_000,
          refreshToken: "rft",
        },
      },
    },
    catalog: first.posts,
    fetchImpl: async (url) => {
      if (String(url).includes("cdn.example")) {
        throw new Error("cover was downloaded again");
      }
      return jsonResponse({
        data: {
          videos: [
            {
              id: "555",
              create_time: 100,
              cover_image_url: "https://cdn.example/cover.jpg",
              video_description: "A fern, edited",
            },
          ],
          has_more: false,
        },
        error: { code: "ok" },
      });
    },
    saveCover: async () => {
      throw new Error("cover was saved again");
    },
    saveTokens: async () => {},
    saveCatalog: async () => {},
  });

  assert.equal(second.posts[0].caption, "A fern, edited");
  assert.equal(second.posts[0].coverUrl, "https://blob.example/555.jpg");
});

test("a failed page does not drop covers already stored", async () => {
  const result = await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: {
      accounts: {
        capriceink_: {
          accessToken: "act",
          accessExpiresAt: Date.now() + 3_600_000,
          refreshToken: "rft",
        },
      },
    },
    catalog: [
      {
        id: "555",
        handle: "@capriceink_",
        createTime: 100,
        caption: "kept",
        coverUrl: "https://blob.example/555.jpg",
      },
    ],
    fetchImpl: async () =>
      jsonResponse({
        data: { videos: [], has_more: true, cursor: 1 },
        error: { code: "ok" },
      }),
    saveCover: async () => "unused",
    saveTokens: async () => {},
    saveCatalog: async () => {
      throw new Error("catalog should stay");
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.posts.length, 1);
  assert.equal(result.posts[0].id, "555");
});

test("a video missing from a finished list is dropped", async () => {
  const result = await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: {
      accounts: {
        inksbybritt: {
          accessToken: "act",
          accessExpiresAt: Date.now() + 3_600_000,
          refreshToken: "rft",
        },
      },
    },
    catalog: [
      {
        id: "9",
        handle: "@inksbybritt",
        createTime: 10,
        caption: "gone on TikTok",
        coverUrl: "https://blob.example/9.jpg",
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

  assert.equal(result.ok, true);
  assert.equal(result.posts.length, 0);
});

test("a rotated refresh token is saved", async () => {
  let saved = null;
  await runSync({
    clientKey: "key",
    clientSecret: "secret",
    tokenRecord: {
      accounts: {
        capriceink_: {
          accessToken: "old",
          accessExpiresAt: 0,
          refreshToken: "old-refresh",
        },
      },
    },
    catalog: [],
    fetchImpl: async (url) => {
      if (String(url).includes("oauth/token")) {
        return jsonResponse({
          access_token: "new-access",
          refresh_token: "new-refresh",
          expires_in: 86400,
          refresh_expires_in: 31536000,
        });
      }
      return jsonResponse({
        data: { videos: [], has_more: false },
        error: { code: "ok" },
      });
    },
    saveCover: async () => "unused",
    saveTokens: async (record) => {
      saved = record;
    },
    saveCatalog: async () => {},
  });

  assert.equal(saved.accounts.capriceink_.refreshToken, "new-refresh");
  assert.equal(saved.accounts.capriceink_.accessToken, "new-access");
});

function jsonResponse(payload) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
