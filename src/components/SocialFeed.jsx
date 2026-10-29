import { useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import { platformLabels } from "../data/socials.js";
import { newestFirst, postsForArtistFeed, postsForNewsfeed, postsForPlatform } from "../feed/order.js";

const emptyCopy = {
  tiktok: "No TikTok posts yet.",
  instagram: "No Instagram posts yet.",
  facebook: "No Facebook posts yet.",
};

function railStep(el) {
  const card = el.querySelector("[data-feed-card]");
  const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
  return (card?.offsetWidth ?? el.clientWidth) + gap;
}

export default function SocialFeed({
  posts,
  artists,
  platforms,
  includeShop = false,
  combined = false,
  personal = false,
}) {
  const [platform, setPlatform] = useState(platforms?.[0]);
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const selected = platforms?.includes(platform) ? platform : platforms?.[0];
  const news = combined || personal;
  const visible = newestFirst(
    personal
      ? postsForArtistFeed(posts, artists?.[0])
      : combined
        ? postsForNewsfeed(posts, artists)
        : postsForPlatform(posts, artists, selected, { includeShop }),
  );
  const postKey = `${personal ? artists?.[0]?.id : news ? "all" : selected}:${visible.map((post) => post.id).join(",")}`;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const measure = () => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      setCanPrev(el.scrollLeft > 8);
      setCanNext(max > 8 && el.scrollLeft < max - 8);
    };

    el.scrollLeft = 0;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [postKey]);

  function scrollByCard(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * railStep(el),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    }
  }

  const cardWidth = news
    ? "w-[85%] lg:w-[calc((100%-2rem)/3)] xl:w-[calc((100%-3rem)/4)]"
    : "w-[85%] sm:w-[calc(50%-0.5rem)]";

  return (
    <section className="space-y-5" data-markdown-skip="">
      {news ? (
        <header>
          <h2 className="font-serif text-xl uppercase tracking-widest text-mystic-text md:text-2xl">
            News feed
          </h2>
          <span className="mt-4 block h-px w-12 bg-mystic-gold shadow-gold-glow" />
        </header>
      ) : null}
      {news ? null : (
        <div role="tablist" aria-label="Posts" className="flex border-b border-mystic-card">
          {platforms.map((id) => {
            const active = id === selected;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPlatform(id)}
                className={`-mb-px min-h-11 border-b-2 px-3 font-serif text-sm uppercase tracking-[0.16em] transition-colors sm:px-4 sm:text-base sm:tracking-widest ${
                  active
                    ? "border-mystic-gold text-mystic-gold"
                    : "border-transparent text-mystic-muted hover:text-mystic-gold"
                }`}
              >
                {platformLabels[id]}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="font-sans text-sm font-light text-mystic-text/60">
          {news ? "No posts yet." : emptyCopy[selected]}
        </p>
      ) : (
        <div className={`relative w-full ${news ? "" : "mx-auto max-w-[40rem]"}`}>
          <div
            ref={scrollerRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-label={news ? "Posts" : `${platformLabels[selected]} posts`}
            className={`feed-rail no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-mystic-gold ${news ? "items-center" : "items-start"}`}
          >
            {visible.map((post) => (
              <div
                key={post.id}
                data-feed-card
                data-nosnippet={post.standIn ? "true" : undefined}
                className={`${cardWidth} shrink-0 snap-start`}
              >
                <PostCard post={post} citeSource={news} />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Newer posts"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className="absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg/80 text-mystic-gold backdrop-blur-sm transition-colors hover:border-mystic-gold disabled:cursor-default disabled:opacity-30"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            aria-label="Older posts"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className="absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-mystic-gold/40 bg-mystic-bg/80 text-mystic-gold backdrop-blur-sm transition-colors hover:border-mystic-gold disabled:cursor-default disabled:opacity-30"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}
    </section>
  );
}

function Chevron({ direction }) {
  const points = direction === "left" ? "14 6 8 12 14 18" : "10 6 16 12 10 18";
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
