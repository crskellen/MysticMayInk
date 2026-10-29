import peony from "../assets/feed-samples/meagan-peony.jpg";
import fern from "../assets/feed-samples/meagan-fern.jpg";
import olive from "../assets/feed-samples/britt-olive.jpg";
import blackwork from "../assets/feed-samples/britt-blackwork.jpg";
import coverup from "../assets/feed-samples/meagan-coverup.jpg";
import moth from "../assets/feed-samples/britt-moth.jpg";
import shopStudio from "../assets/feed-samples/shop-studio.jpg";
import shopInks from "../assets/feed-samples/shop-inks.jpg";
import wildflower from "../assets/feed-samples/meagan-wildflower.jpg";
import rose from "../assets/feed-samples/meagan-rose.jpg";
import dagger from "../assets/feed-samples/britt-dagger.jpg";
import band from "../assets/feed-samples/britt-band.jpg";
import fox from "../assets/feed-samples/facebook-fox.jpg";
import wrap from "../assets/feed-samples/facebook-wrap.jpg";

const coversById = {
  "7100000000000001001": peony,
  "7100000000000001002": fern,
  "7100000000000001003": olive,
  "7100000000000001004": blackwork,
  "7100000000000001005": coverup,
  "7100000000000001006": moth,
  MMIGshop001: shopStudio,
  MMIGshop002: shopInks,
  MMIGmeg001: wildflower,
  MMIGmeg002: rose,
  MMIGbrt001: dagger,
  MMIGbrt002: band,
  "900000000000001": fox,
  "900000000000002": wrap,
};

export function withSampleCovers(posts) {
  return (posts ?? []).map((post) => {
    const cover = coversById[post.id];
    if (!post.standIn || !cover) return post;
    return { ...post, coverUrl: cover };
  });
}
