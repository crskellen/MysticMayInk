export const platformLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};

const shopInstagram = {
  platform: "instagram",
  name: "Mystic May Tattoo Studios",
  handle: "@mysticmaytattoo",
  href: "https://www.instagram.com/mysticmaytattoo/",
};

const shopFacebook = {
  platform: "facebook",
  name: "Mystic May Tattoo",
  handle: "Mystic May Tattoo",
  href: "https://www.facebook.com/p/Mystic-May-Tattoo-100092596201830/",
};

// Meagan's TikTok is also the shop video feed. One profile, two roles.
const shopTiktok = {
  platform: "tiktok",
  name: "Mystic May Tattoo",
  handle: "@capriceink_",
  href: "https://www.tiktok.com/@capriceink_",
  detail: "Shop feed · Meagan Caprice",
};

const meaganInstagram = {
  platform: "instagram",
  name: "Meagan Caprice",
  handle: "@capriceink",
  href: "https://www.instagram.com/capriceink/",
};

const meaganTiktok = {
  platform: "tiktok",
  name: "Meagan Caprice",
  handle: "@capriceink_",
  href: "https://www.tiktok.com/@capriceink_",
};

const brittInstagram = {
  platform: "instagram",
  name: "Brittany Ostrander",
  handle: "@inksbybritt",
  href: "https://www.instagram.com/inksbybritt/",
};

const brittTiktok = {
  platform: "tiktok",
  name: "Brittany Ostrander",
  handle: "@inksbybritt",
  href: "https://www.tiktok.com/@inksbybritt",
};

export const homeSocials = [shopInstagram, shopTiktok, shopFacebook];

export const artistSocials = {
  meagan: [meaganInstagram, meaganTiktok],
  britt: [brittInstagram, brittTiktok],
};

export const footerPlatforms = [
  {
    platform: "instagram",
    accounts: [shopInstagram, meaganInstagram, brittInstagram],
  },
  {
    platform: "facebook",
    accounts: [shopFacebook],
  },
  {
    platform: "tiktok",
    accounts: [shopTiktok, brittTiktok],
  },
];
