import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { shopCity } from "../src/data/brand.js";
import { htmlToMarkdown } from "../scripts/html-to-markdown.mjs";
import {
  absoluteUrl,
  headTags,
  llmsTxt,
  markdownPath,
  normalizePath,
  pageByPath,
  pages,
  robotsTxt,
  siteOrigin,
  sitemapXml,
  structuredData,
} from "../src/data/seo.js";

const BANNED = /\b(tarot|ornamental|micro-realism|microrealism|piercing|healer)\b/i;
const SCHEMA_KEYS = ["aggregateRating", "priceRange", "geo", "review", "reviewCount"];

function walkKeys(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) walkKeys(item, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      found.push(key);
      walkKeys(child, found);
    }
  }
  return found;
}

test("shop city stays the published display string", () => {
  assert.equal(shopCity, "Watertown, NY 13601");
});

test("each page has a unique title and description inside snippet limits", () => {
  assert.deepEqual(
    pages.map((page) => page.path),
    ["/", "/portfolio", "/artists", "/care", "/book", "/privacy", "/terms"],
  );
  const titles = new Set(pages.map((page) => page.title));
  const descriptions = new Set(pages.map((page) => page.description));
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
  for (const page of pages) {
    assert.ok(
      page.title.length <= 60,
      `${page.path} title is ${page.title.length} characters: ${page.title}`,
    );
    assert.ok(
      page.description.length >= 120 && page.description.length <= 160,
      `${page.path} description is ${page.description.length} characters: ${page.description}`,
    );
    assert.equal(BANNED.test(page.title), false, page.title);
    assert.equal(BANNED.test(page.description), false, page.description);
  }
  assert.equal(pages[0].description.includes("Meagan"), false);
  assert.equal(pages[0].description.includes("Brittany"), false);
  const artistsPage = pages.find((page) => page.id === "artists");
  assert.equal(artistsPage.description.includes("Meagan Caprice"), true);
  assert.equal(artistsPage.description.includes("Brittany Ostrander"), true);
  const portfolioPage = pages.find((page) => page.id === "portfolio");
  assert.equal(portfolioPage.description.includes("Meagan"), false);
  assert.equal(portfolioPage.description.includes("Brittany"), false);
});

test("paths normalize and unknown paths do not match a page", () => {
  assert.equal(normalizePath("/artists/"), "/artists");
  assert.equal(normalizePath("/artists?x=1"), "/artists");
  assert.equal(normalizePath("/artists#meagan"), "/artists");
  assert.equal(normalizePath("artists"), "/artists");
  assert.equal(normalizePath("https://example.com/care/"), "/care");
  assert.equal(pageByPath("/privacy/")?.id, "privacy");
  assert.equal(pageByPath("/missing"), null);
});

test("site origin prefers SITE_URL and ignores the preview host", () => {
  assert.equal(
    siteOrigin({
      SITE_URL: "https://example.com/",
      VITE_SITE_URL: "https://other.example/",
      VERCEL_PROJECT_PRODUCTION_URL: "prod.vercel.app",
      VERCEL_URL: "preview.vercel.app",
    }),
    "https://example.com",
  );
  assert.equal(
    siteOrigin({ VITE_SITE_URL: "https://shop.example/" }),
    "https://shop.example",
  );
  assert.equal(
    siteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: "mystic.vercel.app" }),
    "https://mystic.vercel.app",
  );
  assert.equal(siteOrigin({ VERCEL_URL: "preview.vercel.app" }), "");
  assert.equal(siteOrigin({}), "");
  assert.equal(absoluteUrl("https://example.com/", "/"), "https://example.com/");
  assert.equal(absoluteUrl("https://example.com", "/book"), "https://example.com/book");
  assert.equal(absoluteUrl("", "/book"), "");
});

test("structured data describes the studio and names artists only on the artists page", () => {
  const origin = "https://example.com";
  for (const page of pages) {
    const data = structuredData(page, origin);
    const json = JSON.stringify(data);
    assert.equal(BANNED.test(json), false, page.path);
    for (const key of SCHEMA_KEYS) {
      assert.equal(walkKeys(data).includes(key), false, `${page.path} ${key}`);
    }
    const studio = data["@graph"].find((node) => node["@type"] === "TattooParlor");
    assert.equal(studio.name, "Mystic May Tattoo Studios");
    assert.equal(studio.alternateName, "Mystic May Tattoo");
    assert.equal(studio.telephone, "+13157753727");
    assert.equal(studio.address.streetAddress, "23239 NY 342");
    assert.equal(studio.address.addressLocality, "Watertown");
    assert.equal(studio.address.addressRegion, "NY");
    assert.equal(studio.address.postalCode, "13601");
    assert.equal(studio.address.addressCountry, "US");
    assert.deepEqual(studio.openingHoursSpecification[0].dayOfWeek, [
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);
    assert.equal(studio.openingHoursSpecification[0].opens, "12:00");
    assert.equal(studio.openingHoursSpecification[0].closes, "17:00");
    assert.equal(studio.image["@type"], "ImageObject");
    assert.equal(studio.image.url, `${origin}/logo.jpg`);
    assert.equal(studio.image.caption, "Mystic May Tattoo Studios logo");
    assert.equal(studio.logo.url, studio.image.url);
    const webPage = data["@graph"].find((node) => node["@type"] === "WebPage");
    assert.equal(webPage.inLanguage, "en-US");
    assert.equal(webPage.primaryImageOfPage["@type"], "ImageObject");
    assert.equal(webPage.primaryImageOfPage.url, `${origin}/logo.jpg`);
    assert.equal(studio.sameAs.includes("https://www.instagram.com/mysticmaytattoo/"), true);
    assert.equal(studio.sameAs.includes("https://www.tiktok.com/@capriceink_"), true);
    assert.equal(
      studio.sameAs.includes("https://www.facebook.com/p/Mystic-May-Tattoo-100092596201830/"),
      true,
    );
    const types = data["@graph"].map((node) => node["@type"]);
    assert.equal(types.includes("WebSite"), true);
    assert.equal(types.includes("WebPage"), true);
    assert.equal(types.includes("BreadcrumbList"), true);
    const people = data["@graph"].filter((node) => node["@type"] === "Person");
    if (page.id === "artists") {
      assert.deepEqual(
        people.map((person) => person.name),
        ["Meagan Caprice", "Brittany Ostrander"],
      );
      assert.deepEqual(
        people.map((person) => person.jobTitle),
        ["Owner", "Tattoo artist"],
      );
      assert.equal(json.includes("Meagan Caprice"), true);
    } else {
      assert.equal(people.length, 0);
      assert.equal(json.includes("Meagan Caprice"), false);
      assert.equal(json.includes("Brittany Ostrander"), false);
    }
    const tags = headTags(page, origin);
    assert.equal((tags.match(/rel="canonical"/g) ?? []).length, 1);
    assert.match(tags, new RegExp(`href="${origin}${page.path === "/" ? "/" : page.path}"`));
    const inner = tags.match(/<script type="application\/ld\+json">([\s\S]*)<\/script>/)[1];
    assert.equal(inner.includes("<"), false);
    JSON.parse(inner);
    const bare = headTags(page, "");
    assert.equal(bare.includes('rel="canonical"'), false);
    assert.equal(bare.includes("og:url"), false);
    assert.equal(tags.includes(`type="text/markdown" href="${origin}${markdownPath(page.path)}"`), true);
    assert.equal(bare.includes(`type="text/markdown" href="${markdownPath(page.path)}"`), true);
  }
});

test("robots allows crawlers, blocks the API, and the sitemap is absolute", () => {
  const plain = robotsTxt("");
  assert.deepEqual(
    plain.split("\n").filter((line) => line.startsWith("User-agent:")),
    ["User-agent: *"],
  );
  assert.match(plain, /Allow: \/\nDisallow: \/api\//);
  assert.equal(plain.includes("Sitemap:"), false);
  assert.equal(plain.includes("GPTBot"), false);
  const withOrigin = robotsTxt("https://example.com");
  assert.match(withOrigin, /Sitemap: https:\/\/example.com\/sitemap.xml/);
  assert.equal(sitemapXml(""), "");
  const sitemap = sitemapXml("https://example.com");
  for (const page of pages) {
    const loc = page.path === "/" ? "https://example.com/" : `https://example.com${page.path}`;
    assert.equal(sitemap.includes(`<loc>${loc}</loc>`), true);
  }
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.equal(sitemap.includes("<loc>http://"), false);
});

test("llms.txt names both artists and the booking rule", () => {
  const text = llmsTxt("https://example.com");
  assert.equal(BANNED.test(text), false);
  assert.match(text, /Meagan Caprice/);
  assert.match(text, /Brittany Ostrander/);
  assert.match(text, /23239 NY 342/);
  assert.match(text, /315-775-3727/);
  assert.match(text, /not a confirmed appointment/);
  assert.match(text, /https:\/\/example.com\/artists\/index.md/);
  assert.match(text, /Before you book/);
  assert.match(text, /Once it has healed/);
  assert.match(text, /not personal medical advice/);
  assert.match(llmsTxt(""), /\]\(\/artists\/index.md\)/);
  assert.match(llmsTxt(""), /\]\(\/index.md\)/);
  assert.match(llmsTxt(""), /\]\(\/care\/index.md\)/);
  assert.equal(fs.readFileSync("public/robots.txt", "utf8"), robotsTxt(""));
  assert.equal(fs.readFileSync("public/llms.txt", "utf8"), llmsTxt(""));
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(html, /<html lang="en-US">/);
  assert.match(html, /<link rel="describedby" href="\/llms.txt" \/>/);
});

test("markdown keeps hidden tab text and drops the sample feed", () => {
  const html = `
    <main>
      <h1>Artists</h1>
      <section id="meagan"><p>Botanical ferns and florals</p></section>
      <section id="britt" hidden=""><p>commissions by direct message</p></section>
      <section data-markdown-skip=""><p>Sample caption</p><button>TikTok</button></section>
    </main>
  `;
  const markdown = htmlToMarkdown(html);
  assert.match(markdown, /# Artists/);
  assert.match(markdown, /Botanical ferns and florals/);
  assert.match(markdown, /commissions by direct message/);
  assert.equal(markdown.includes("Sample"), false);
  assert.equal(markdown.includes("TikTok"), false);
  assert.equal(/<[a-z]/i.test(markdown), false);
});
