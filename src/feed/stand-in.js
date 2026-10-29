// Sample posts for layout review. Times are America/New_York (EDT).
// postsForArtists keeps these earliest-first. The page rail shows the
// reverse: newest first, then older as you scroll.
// Covers are photographs in src/assets/feed-samples/. The browser swaps
// those files in through sample-covers.js. These paths are only a record.
export const standInPosts = [
  {
    id: "7100000000000001001",
    handle: "@capriceink_",
    createTime: 1793127600,
    caption: "Black and grey peony, a couple of weeks healed.",
    coverUrl: "src/assets/feed-samples/meagan-peony.jpg",
    platform: "tiktok",
    standIn: true,
  },
  {
    id: "7100000000000001002",
    handle: "@capriceink_",
    createTime: 1793192400,
    caption: "Fern fronds, shaded in black and grey.",
    coverUrl: "src/assets/feed-samples/meagan-fern.jpg",
    platform: "tiktok",
    standIn: true,
  },
  {
    id: "7100000000000001003",
    handle: "@inksbybritt",
    createTime: 1793196000,
    caption: "Fine line olive branch, fresh lines.",
    coverUrl: "src/assets/feed-samples/britt-olive.jpg",
    platform: "tiktok",
    standIn: true,
  },
  {
    id: "7100000000000001004",
    handle: "@inksbybritt",
    createTime: 1793203200,
    caption: "Blackwork panel, second session.",
    coverUrl: "src/assets/feed-samples/britt-blackwork.jpg",
    platform: "tiktok",
    standIn: true,
  },
  {
    id: "7100000000000001005",
    handle: "@capriceink_",
    createTime: 1793204100,
    caption: "Floral cover-up, lining the last petals.",
    coverUrl: "src/assets/feed-samples/meagan-coverup.jpg",
    platform: "tiktok",
    standIn: true,
  },
  {
    id: "7100000000000001006",
    handle: "@inksbybritt",
    createTime: 1793275200,
    caption: "Fine line moth and moon.",
    coverUrl: "src/assets/feed-samples/britt-moth.jpg",
    platform: "tiktok",
    standIn: true,
  },
];

export const instagramStandIns = [
  {
    id: "MMIGshop001",
    platform: "instagram",
    handle: "@mysticmaytattoo",
    createTime: 1793113200,
    caption: "The room, before the day starts.",
    coverUrl: "src/assets/feed-samples/shop-studio.jpg",
    standIn: true,
  },
  {
    id: "MMIGmeg001",
    platform: "instagram",
    handle: "@capriceink",
    createTime: 1793210400,
    caption: "Wildflower stem, fine leaves.",
    coverUrl: "src/assets/feed-samples/meagan-wildflower.jpg",
    standIn: true,
  },
  {
    id: "MMIGbrt001",
    platform: "instagram",
    handle: "@inksbybritt",
    createTime: 1793219400,
    caption: "Fine line dagger and a few leaves.",
    coverUrl: "src/assets/feed-samples/britt-dagger.jpg",
    standIn: true,
  },
  {
    id: "MMIGbrt002",
    platform: "instagram",
    handle: "@inksbybritt",
    createTime: 1793286000,
    caption: "Blackwork band, fresh today.",
    coverUrl: "src/assets/feed-samples/britt-band.jpg",
    standIn: true,
  },
  {
    id: "MMIGshop002",
    platform: "instagram",
    handle: "@mysticmaytattoo",
    createTime: 1793293200,
    caption: "Ink caps set, lamp on.",
    coverUrl: "src/assets/feed-samples/shop-inks.jpg",
    standIn: true,
  },
  {
    id: "MMIGmeg002",
    platform: "instagram",
    handle: "@capriceink",
    createTime: 1793311200,
    caption: "Black and grey rose, settled in.",
    coverUrl: "src/assets/feed-samples/meagan-rose.jpg",
    standIn: true,
  },
];

export const facebookStandIns = [
  {
    id: "900000000000001",
    platform: "facebook",
    handle: "Mystic May Tattoo",
    createTime: 1793134800,
    caption: "Black and grey fox.",
    coverUrl: "src/assets/feed-samples/facebook-fox.jpg",
    standIn: true,
  },
  {
    id: "900000000000002",
    platform: "facebook",
    handle: "Mystic May Tattoo",
    createTime: 1793304000,
    caption: "Wrapped and on the way home.",
    coverUrl: "src/assets/feed-samples/facebook-wrap.jpg",
    standIn: true,
  },
];

export function standInCatalog() {
  return {
    source: "stand-in",
    posts: standInPosts,
  };
}
