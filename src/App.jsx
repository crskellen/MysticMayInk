import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Care from "./pages/Care";
import Booking from "./pages/Booking";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { markdownPath, normalizePath, pageByPath, pages } from "./data/seo.js";

function upsertMeta(attr, key, content) {
  let node = document.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

export default function App({ initialPath = "/" }) {
  const [path, setPath] = useState(() => normalizePath(initialPath));

  const navigate = (href) => {
    const next = pageByPath(href)?.path ?? "/";
    setPath(next);
    if (window.location.pathname !== next) {
      window.history.pushState({ path: next }, "", next);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const current = normalizePath(window.location.pathname);
    if (!pageByPath(current)) {
      window.history.replaceState({ path: "/" }, "", "/");
      setPath("/");
    }
  }, []);

  useEffect(() => {
    const page = pageByPath(path) ?? pages[0];
    document.title = page.title;
    upsertMeta("name", "description", page.description);
    upsertMeta("property", "og:title", page.title);
    upsertMeta("property", "og:description", page.description);
    upsertMeta("name", "twitter:title", page.title);
    upsertMeta("name", "twitter:description", page.description);
    const markdown = document.querySelector('link[rel="alternate"][type="text/markdown"]');
    if (markdown) {
      const href = markdown.getAttribute("href") || "";
      const next = markdownPath(page.path);
      markdown.setAttribute(
        "href",
        /^https?:\/\//i.test(href) ? `${new URL(href).origin}${next}` : next,
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) return;
    try {
      const origin = new URL(canonical.getAttribute("href") || "").origin;
      const next = page.path === "/" ? `${origin}/` : `${origin}${page.path}`;
      canonical.setAttribute("href", next);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", next);
    } catch {
      // A build without a site origin does not emit an absolute canonical.
    }
  }, [path]);

  const pageId = pageByPath(path)?.id ?? "home";

  const renderPage = () => {
    switch (pageId) {
      case "artists":
        return <Artists />;
      case "care":
        return <Care navigate={navigate} />;
      case "booking":
        return <Booking />;
      case "privacy":
        return <Privacy />;
      case "terms":
        return <Terms />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-mystic-bg text-mystic-text font-sans flex flex-col selection:bg-mystic-gold selection:text-mystic-bg">
      <Navbar currentPath={pageByPath(path)?.path ?? "/"} navigate={navigate} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer navigate={navigate} />
    </div>
  );
}
