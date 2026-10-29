import SocialIcon from "./SocialIcon";
import { platformLabels } from "../data/socials.js";
import { deviceFromUserAgent, linkForPost } from "../feed/links.js";
import { postedLabel } from "../feed/time.js";

const frameClass = {
  tiktok: "aspect-[9/16]",
  instagram: "aspect-[2/3]",
  facebook: "aspect-[2/3]",
};

function deviceNow() {
  if (typeof navigator === "undefined") return "desktop";
  return deviceFromUserAgent(navigator.userAgent);
}

function linkProps(post) {
  const link = linkForPost(post, deviceNow());
  return {
    href: link.href,
    target: link.newTab ? "_blank" : undefined,
    rel: link.newTab ? "noopener noreferrer" : undefined,
  };
}

function PostStill({ post, platform, handleOnStill, compact = false }) {
  const frame = compact
    ? "h-52 sm:h-60"
    : frameClass[platform];
  return (
    <div className={`relative overflow-hidden bg-mystic-card ${frame}`}>
      <img
        src={post.coverUrl}
        alt=""
        className="h-full w-full object-cover"
      />
      {post.standIn && (
        <span className="absolute left-2 top-2 bg-mystic-bg/90 px-2 py-1 font-sans text-[10px] uppercase tracking-[0.16em] text-mystic-gold">
          Sample
        </span>
      )}
      {handleOnStill && (
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-mystic-bg/80 text-mystic-gold">
          <SocialIcon platform={platform} className="h-3.5 w-3.5" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mystic-bg via-mystic-bg/85 to-transparent p-3 pt-10">
        <span className="flex items-baseline justify-between gap-2">
          {handleOnStill ? (
            <span className="truncate font-sans text-[11px] tracking-wide text-mystic-gold">
              {post.handle}
            </span>
          ) : (
            <span />
          )}
          <span className="shrink-0 font-sans text-[10px] text-mystic-muted">
            {postedLabel(post.createTime)}
          </span>
        </span>
        <span className="mt-1 block truncate font-sans text-xs text-mystic-text/80">
          {post.caption}
        </span>
      </div>
    </div>
  );
}

export default function PostCard({ post, citeSource = false }) {
  const platform = post.platform ?? "tiktok";
  const name = platformLabels[platform] ?? "TikTok";
  const props = linkProps(post);
  const caption = post.caption ? `${post.caption} ` : "";

  if (citeSource) {
    return (
      <div className="overflow-hidden rounded border border-mystic-bg bg-mystic-card shadow-sm transition-all duration-300 hover:border-mystic-gold/30">
        <a
          {...props}
          aria-label={`${caption}Opens in ${name}.`}
          className="block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-mystic-gold"
        >
          <PostStill post={post} platform={platform} handleOnStill={false} compact />
        </a>
        <a
          {...props}
          aria-label={`${name}, ${post.handle}. Opens this post.`}
          className="flex min-h-11 items-center gap-2.5 border-t border-mystic-bg px-3 text-mystic-gold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-2px] focus-visible:outline-mystic-gold"
        >
          <SocialIcon platform={platform} className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate font-sans text-[11px] tracking-wide">
            {post.handle}
          </span>
        </a>
      </div>
    );
  }

  return (
    <a
      {...props}
      aria-label={`${name}, ${post.handle}. ${caption}Opens in ${name}.`}
      className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-mystic-gold"
    >
      <div className="overflow-hidden rounded border border-mystic-bg shadow-sm transition-all duration-300 group-hover:border-mystic-gold/30">
        <PostStill post={post} platform={platform} handleOnStill />
      </div>
    </a>
  );
}
