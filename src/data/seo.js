import { artists } from "./artists.js";
import { careSections } from "./care.js";
import {
  shopCity,
  shopLocality,
  shopMapsHref,
  shopName,
  shopPhoneDisplay,
  shopPostalCode,
  shopRegion,
  shopStreet,
} from "./brand.js";
import { homeSocials, platformLabels } from "./socials.js";

// SITE_URL wins. Otherwise the Vercel production host. Never a preview host.
const TELEPHONE = "+13157753727";
const LOGO_PATH = "/logo.jpg";
const OPEN_DAYS = [
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const pages = [
  {
    path: "/",
    id: "home",
    inNav: true,
    label: "Home",
    crumb: "Home",
    title: "Mystic May Tattoo Studios | Watertown, NY",
    description:
      "Custom tattoos at 23239 NY 342, Watertown, NY. Botanical and floral, fine line, black and grey, blackwork, fantasy and anime, and cover-ups. Text 315-775-3727.",
  },
  {
    path: "/portfolio",
    id: "portfolio",
    inNav: true,
    label: "Portfolio",
    crumb: "Portfolio",
    title: "Tattoo Portfolio | Mystic May Tattoo Studios",
    description:
      "Finished tattoos from Mystic May Tattoo Studios in Watertown, NY. Filter by style, artist, keyword, and placement, or search the same words.",
  },
  {
    path: "/artists",
    id: "artists",
    inNav: true,
    label: "Artists",
    crumb: "Artists",
    title: "Meagan Caprice and Brittany Ostrander | Mystic May",
    description:
      "Meagan Caprice: botanical, floral, black and grey, and cover-ups. Brittany Ostrander: fine line, blackwork, botanicals, fantasy, and anime. Watertown, NY.",
  },
  {
    path: "/care",
    id: "care",
    inNav: true,
    label: "Care",
    crumb: "Care Guide",
    title: "Tattoo Care Guide | Mystic May Tattoo Studios",
    description:
      "How to prepare for a tattoo, what to expect in the studio, and how a fresh tattoo heals. Your artist's written aftercare comes first. Mystic May, Watertown, NY.",
  },
  {
    path: "/book",
    id: "booking",
    inNav: true,
    label: "Book Session",
    crumb: "Request a Session",
    title: "Request a Tattoo Session in Watertown | Mystic May",
    description:
      "Text 315-775-3727 to request a tattoo session at 23239 NY 342, Watertown, NY. A text is not a confirmed appointment until the studio agrees to a time.",
  },
  {
    path: "/privacy",
    id: "privacy",
    inNav: false,
    label: "Privacy Policy",
    crumb: "Privacy Policy",
    title: "Privacy Policy | Mystic May Tattoo Studios",
    description:
      "Booking texts are not stored on this website. Tokens for TikTok, Instagram, and Facebook stay on the server. Mystic May Tattoo Studios, Watertown, NY.",
  },
  {
    path: "/terms",
    id: "terms",
    inNav: false,
    label: "Terms of Service",
    crumb: "Terms of Service",
    title: "Terms of Service | Mystic May Tattoo Studios",
    description:
      "A text to Mystic May Tattoo Studios is a request, not an appointment, until the studio agrees to a time. The studio is at 23239 NY 342, Watertown, NY.",
  },
];

export function normalizePath(input) {
  if (input == null || input === "") return "/";
  let value = String(input).trim();
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      value = new URL(value).pathname;
    } catch {
      return "/";
    }
  }
  const hash = value.indexOf("#");
  if (hash >= 0) value = value.slice(0, hash);
  const query = value.indexOf("?");
  if (query >= 0) value = value.slice(0, query);
  if (!value.startsWith("/")) value = `/${value}`;
  if (value.length > 1 && value.endsWith("/")) value = value.slice(0, -1);
  return value || "/";
}

export function pageByPath(pathname) {
  const path = normalizePath(pathname);
  return pages.find((page) => page.path === path) ?? null;
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

export function siteOrigin(env = {}) {
  const source = env && typeof env === "object" ? env : {};
  const explicit = firstString(source.SITE_URL, source.VITE_SITE_URL);
  if (explicit) return stripTrailingSlash(explicit);
  const production = firstString(source.VERCEL_PROJECT_PRODUCTION_URL);
  if (!production) return "";
  const host = stripTrailingSlash(production);
  if (/^https?:\/\//i.test(host)) return host;
  return `https://${host}`;
}

export function absoluteUrl(origin, pagePath) {
  if (!origin) return "";
  const base = stripTrailingSlash(origin);
  if (pagePath === "/") return `${base}/`;
  return `${base}${pagePath}`;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function studioId(origin) {
  return origin ? `${stripTrailingSlash(origin)}/#studio` : "#studio";
}

function websiteId(origin) {
  return origin ? `${stripTrailingSlash(origin)}/#website` : "#website";
}

function personId(origin, artistId) {
  const page = absoluteUrl(origin, "/artists") || "/artists";
  return `${page}#${artistId}`;
}

function jobTitle(artist) {
  const sentence = artist.bio.split(".")[0]?.trim();
  return sentence || "Tattoo artist";
}

export function markdownPath(pagePath) {
  return pagePath === "/" ? "/index.md" : `${pagePath}/index.md`;
}

function logoImage(origin) {
  const url = origin ? `${stripTrailingSlash(origin)}${LOGO_PATH}` : LOGO_PATH;
  return {
    "@type": "ImageObject",
    url,
    caption: `${shopName} logo`,
  };
}

function careGuideNote() {
  const titles = careSections.map((section) => section.title);
  const listed =
    titles.length > 1
      ? `${titles.slice(0, -1).join(", ")}, and ${titles.at(-1)}`
      : titles[0] ?? "";
  return `The care guide covers ${listed}. Your artist's written aftercare comes first. This is general information for clients, not personal medical advice.`;
}

export function structuredData(page, origin) {
  const pageUrl = absoluteUrl(origin, page.path) || page.path;
  const image = logoImage(origin);
  const studio = {
    "@type": "TattooParlor",
    "@id": studioId(origin),
    name: shopName,
    alternateName: "Mystic May Tattoo",
    description:
      "Tattoo studio in Watertown, New York. Tuesday through Saturday, 12:00 PM to 5:00 PM. Sunday and Monday by appointment. Text 315-775-3727.",
    telephone: TELEPHONE,
    image,
    logo: image,
    hasMap: shopMapsHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: shopStreet,
      addressLocality: shopLocality,
      addressRegion: shopRegion,
      postalCode: shopPostalCode,
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: OPEN_DAYS,
        opens: "12:00",
        closes: "17:00",
      },
    ],
    sameAs: homeSocials.map((account) => account.href),
  };
  if (origin) studio.url = stripTrailingSlash(origin);

  const webPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": websiteId(origin) },
    about: { "@id": studioId(origin) },
    inLanguage: "en-US",
    url: pageUrl,
    primaryImageOfPage: image,
  };
  if (page.id === "artists") {
    webPage.mainEntity = artists.map((artist) => ({
      "@id": personId(origin, artist.id),
    }));
  } else {
    webPage.mainEntity = { "@id": studioId(origin) };
  }

  const website = {
    "@type": "WebSite",
    "@id": websiteId(origin),
    name: shopName,
    publisher: { "@id": studioId(origin) },
  };
  if (origin) website.url = stripTrailingSlash(origin);

  const crumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl(origin, "/") || "/",
    },
  ];
  if (page.path !== "/") {
    crumbs.push({
      "@type": "ListItem",
      position: 2,
      name: page.crumb,
      item: pageUrl,
    });
  }

  const graph = [
    studio,
    website,
    webPage,
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs,
    },
  ];

  if (page.id === "artists") {
    for (const artist of artists) {
      graph.push({
        "@type": "Person",
        "@id": personId(origin, artist.id),
        name: artist.name,
        jobTitle: jobTitle(artist),
        knowsAbout: artist.tags,
        sameAs: artist.socials.map((account) => account.href),
        worksFor: { "@id": studioId(origin) },
        url: pageUrl,
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function metaName(name, content) {
  return `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}" />`;
}

function metaProperty(property, content) {
  return `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}" />`;
}

export function headTags(page, origin) {
  const pageUrl = absoluteUrl(origin, page.path);
  const image = origin ? `${stripTrailingSlash(origin)}${LOGO_PATH}` : LOGO_PATH;
  const markdownHref = absoluteUrl(origin, markdownPath(page.path)) || markdownPath(page.path);
  const tags = [
    metaName("description", page.description),
    metaProperty("og:type", "website"),
    metaProperty("og:site_name", shopName),
    metaProperty("og:title", page.title),
    metaProperty("og:description", page.description),
    metaProperty("og:image", image),
    metaProperty("og:image:alt", `${shopName} logo`),
    metaProperty("og:locale", "en_US"),
    metaName("twitter:card", "summary"),
    metaName("twitter:title", page.title),
    metaName("twitter:description", page.description),
    metaName("twitter:image", image),
    `<link rel="alternate" type="text/markdown" href="${escapeHtml(markdownHref)}" />`,
  ];
  if (pageUrl) {
    tags.splice(1, 0, `<link rel="canonical" href="${escapeHtml(pageUrl)}" />`);
    tags.push(metaProperty("og:url", pageUrl));
  }
  const json = JSON.stringify(structuredData(page, origin)).replaceAll("<", "\\u003c");
  tags.push(`<script type="application/ld+json">${json}</script>`);
  return tags.join("\n    ");
}

export function robotsTxt(origin) {
  const lines = ["User-agent: *", "Allow: /", "Disallow: /api/", ""];
  if (origin) lines.push(`Sitemap: ${stripTrailingSlash(origin)}/sitemap.xml`, "");
  return lines.join("\n");
}

export function sitemapXml(origin) {
  if (!origin) return "";
  const urls = pages
    .map((page) => `  <url>\n    <loc>${escapeHtml(absoluteUrl(origin, page.path))}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function llmsTxt(origin) {
  const hrefFor = (pagePath) => absoluteUrl(origin, pagePath) || pagePath;
  const artistPage = hrefFor(markdownPath("/artists"));
  const artistBlocks = artists
    .map((artist) => {
      const socials = artist.socials
        .map((account) => `  - ${platformLabels[account.platform]}: ${account.href}`)
        .join("\n");
      return `- [${artist.name}](${artistPage}): ${artist.bio}\n${socials}`;
    })
    .join("\n");
  const pageBlocks = pages
    .map((page) => `- [${page.crumb}](${hrefFor(markdownPath(page.path))}): ${page.description}`)
    .join("\n");
  const socials = homeSocials
    .map((account) => `- ${platformLabels[account.platform]}: ${account.href}`)
    .join("\n");

  return `# ${shopName}

> ${shopName} (also called Mystic May Tattoo) is a tattoo studio at ${shopStreet}, ${shopCity}. Open Tuesday through Saturday, 12:00 PM to 5:00 PM. Sunday and Monday by appointment. Text ${shopPhoneDisplay} to request a session. A text is not stored on this website and is not a confirmed appointment until the studio agrees to a time.

The studio tattoos botanical and floral work, fine line, black and grey, blackwork, fantasy and anime, and cover-ups.

The shop TikTok account and Meagan Caprice's TikTok account are one profile.

${careGuideNote()}

## Artists

${artistBlocks}

## Pages

${pageBlocks}

## Social

${socials}
`;
}
