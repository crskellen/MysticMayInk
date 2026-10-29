function stripElement(html, tag) {
  const pattern = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
  let previous = "";
  let next = html;
  while (next !== previous) {
    previous = next;
    next = previous.replace(pattern, "");
  }
  return next;
}

function stripMarked(html, attr) {
  const pattern = new RegExp(
    `<([a-z0-9]+)\\b(?=[^>]*\\b${attr}\\b)[^>]*>[\\s\\S]*?<\\/\\1>`,
    "gi",
  );
  let previous = "";
  let next = html;
  while (next !== previous) {
    previous = next;
    next = previous.replace(pattern, "");
  }
  return next;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

function decode(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&amp;/g, "&");
}

export function htmlToMarkdown(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? html;
  let source = stripElement(main, "script");
  source = stripElement(source, "style");
  source = stripElement(source, "svg");
  source = stripElement(source, "button");
  source = stripMarked(source, "data-markdown-skip");
  source = source.replace(/<br\s*\/?>/gi, "\n");
  source = source.replace(
    /<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, label) => {
      const text = decode(stripTags(label)).replace(/\s+/g, " ").trim();
      return text ? `[${text}](${decode(href)})` : "";
    },
  );
  source = source.replace(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, body) => {
    const text = decode(stripTags(body)).replace(/\s+/g, " ").trim();
    return text ? `\n\n${"#".repeat(Number(level))} ${text}\n\n` : "";
  });
  source = source.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, body) => {
    const text = decode(stripTags(body)).replace(/\s+/g, " ").trim();
    return text ? `\n- ${text}` : "";
  });
  source = source.replace(/<\/(p|div|section|article|header|footer|ul|ol)>/gi, "\n\n");
  source = decode(stripTags(source));
  source = source
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `${source}\n`;
}
