import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { htmlToMarkdown } from "./html-to-markdown.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, ".ssr");

const {
  pages,
  siteOrigin,
  absoluteUrl,
  escapeHtml,
  headTags,
  markdownPath,
  robotsTxt,
  sitemapXml,
  llmsTxt,
} = await import(pathToFileURL(path.join(root, "src/data/seo.js")).href);

function findEntry(dir) {
  if (!fs.existsSync(dir)) return null;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = findEntry(full);
      if (nested) return nested;
    } else if (/^entry-server\.(js|mjs)$/.test(entry.name)) {
      return full;
    }
  }
  return null;
}

function inject(template, page, appHtml, origin) {
  const title = `<title>${escapeHtml(page.title)}</title>`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, title);
  const meta = headTags(page, origin);
  if (html.includes("<!--page-meta-->")) {
    html = html.replace("<!--page-meta-->", meta);
  } else {
    html = html.replace("</head>", `    ${meta}\n  </head>`);
  }
  const next = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${appHtml}</div>`,
  );
  if (next === html) {
    throw new Error(`Could not find an empty #root in the built index.html for ${page.path}`);
  }
  return next;
}

function localAsset(src) {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  return src.split("?")[0].split("#")[0];
}

const origin = siteOrigin(process.env);
if (!origin) {
  console.warn(
    "SEO: no SITE_URL, VITE_SITE_URL, or VERCEL_PROJECT_PRODUCTION_URL. Canonical, Open Graph URL, and sitemap locations were omitted.",
  );
} else {
  console.log(`SEO origin: ${origin}`);
}

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const entry = findEntry(ssrDir);
if (!entry) {
  throw new Error(`No entry-server bundle in ${ssrDir}`);
}

let failed = null;
try {
  const { render } = await import(pathToFileURL(entry).href);
  const referenced = new Set();

  for (const page of pages) {
    const appHtml = render(page.path);
    const h1Count = appHtml.match(/<h1[\s>]/g)?.length ?? 0;
    if (h1Count !== 1) {
      throw new Error(`${page.path} rendered ${h1Count} h1 elements`);
    }
    if (!appHtml.includes("<main")) {
      throw new Error(`${page.path} rendered without <main>`);
    }
    const html = inject(template, page, appHtml, origin);
    const markdown = htmlToMarkdown(appHtml);
    if (/<[a-z!/]/i.test(markdown)) {
      throw new Error(`${page.path} markdown still contains HTML`);
    }
    if (page.path === "/" && /Meagan Caprice|Brittany Ostrander|commissions by direct message/.test(html)) {
      throw new Error("Home HTML includes an artist name");
    }
    if (page.path === "/" && /Meagan Caprice|Brittany Ostrander|Sample/.test(markdown)) {
      throw new Error("Home markdown includes an artist name or a sample post");
    }
    if (page.path === "/artists") {
      for (const name of ["Meagan Caprice", "Brittany Ostrander"]) {
        if (!html.includes(name)) throw new Error(`Artists HTML is missing ${name}`);
      }
      for (const sentence of ["Botanical ferns and florals", "commissions by direct message"]) {
        if (!html.includes(sentence) || !markdown.includes(sentence)) {
          throw new Error(`Artists page is missing ${sentence}`);
        }
      }
      const panels = appHtml.match(/role="tabpanel"/g)?.length ?? 0;
      if (panels !== 2) throw new Error(`/artists rendered ${panels} tab panels`);
    }
    if (page.path === "/care") {
      for (const sentence of [
        "You must be 18",
        "Eat a real meal",
        "Ink goes into a fresh cap",
        "Leave the covering on",
        "While it heals",
        "Once it has healed",
        "not personal medical advice",
      ]) {
        if (!html.includes(sentence) || !markdown.includes(sentence)) {
          throw new Error(`Care page is missing ${sentence}`);
        }
      }
      const panels = appHtml.match(/role="tabpanel"/g)?.length ?? 0;
      if (panels !== 6) throw new Error(`/care rendered ${panels} tab panels`);
    }
    const mdHref = absoluteUrl(origin, markdownPath(page.path)) || markdownPath(page.path);
    if (!html.includes(`type="text/markdown" href="${escapeHtml(mdHref)}"`)) {
      throw new Error(`${page.path} is missing its markdown alternate`);
    }
    if (!html.includes('rel="describedby" href="/llms.txt"')) {
      throw new Error(`${page.path} is missing the llms.txt link`);
    }
    const canonicals = html.match(/rel="canonical"/g)?.length ?? 0;
    if (canonicals !== (origin ? 1 : 0)) {
      throw new Error(`${page.path} has ${canonicals} canonical links`);
    }
    if (!html.includes(`<title>${escapeHtml(page.title)}</title>`)) {
      throw new Error(`${page.path} title was not written`);
    }
    if (!html.includes('name="description"')) {
      throw new Error(`${page.path} is missing a meta description`);
    }
    const file =
      page.path === "/"
        ? path.join(dist, "index.html")
        : path.join(dist, page.path.slice(1), "index.html");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    const markdownFile = path.join(dist, markdownPath(page.path).replace(/^\//, ""));
    fs.mkdirSync(path.dirname(markdownFile), { recursive: true });
    fs.writeFileSync(markdownFile, markdown);
    for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      const asset = localAsset(match[1]);
      if (asset) referenced.add(asset);
    }
    console.log(`prerendered ${page.path}`);
  }

  const missing = [];
  for (const asset of referenced) {
    const dest = path.join(dist, asset);
    if (fs.existsSync(dest)) continue;
    const fromSsr = path.join(ssrDir, asset);
    if (fs.existsSync(fromSsr)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(fromSsr, dest);
      console.warn(`Copied SSR asset into dist: ${asset}`);
      continue;
    }
    missing.push(asset);
  }
  if (missing.length > 0) {
    throw new Error(`Prerendered HTML references missing files: ${missing.join(", ")}`);
  }

  fs.writeFileSync(path.join(dist, "robots.txt"), robotsTxt(origin));
  fs.writeFileSync(path.join(dist, "llms.txt"), llmsTxt(origin));
  const sitemap = sitemapXml(origin);
  const sitemapPath = path.join(dist, "sitemap.xml");
  if (sitemap) fs.writeFileSync(sitemapPath, sitemap);
  else if (fs.existsSync(sitemapPath)) fs.rmSync(sitemapPath);
} catch (error) {
  failed = error;
} finally {
  fs.rmSync(ssrDir, { recursive: true, force: true });
}

if (failed) throw failed;
