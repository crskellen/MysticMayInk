import { artistSocials } from "./socials.js";

// Home merges every entry in this list. Adding an artist here is what
// puts their TikTok on Home. @capriceink_ is Meagan's account and the
// shop account; it is listed once.
export const artists = [
  {
    id: "meagan",
    name: "Meagan Caprice",
    tiktokHandle: "@capriceink_",
    bio: "Owner. Botanical ferns and florals, black and grey, and cover-ups.",
    tags: ["Botanical", "Floral", "Black & Grey", "Cover-Ups"],
    socials: artistSocials.meagan,
  },
  {
    id: "britt",
    name: "Brittany Ostrander",
    tiktokHandle: "@inksbybritt",
    bio: "Tattoo artist. Fine line, blackwork, and black and grey, along with botanicals, bookish and fantasy pieces, and anime. Art and tattoo design commissions by direct message.",
    tags: ["Fine Line", "Blackwork", "Black & Grey", "Botanical"],
    socials: artistSocials.britt,
  },
];

export function artistById(id) {
  return artists.find((artist) => artist.id === id) ?? artists[0];
}
