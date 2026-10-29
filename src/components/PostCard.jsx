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

export default function PostCard({ post }) {
  const platform = post.platform ?? "tiktok";
  const name = platformLabels[platform] ?? "TikTok";
  const link = linkForPost(post, deviceNow());
  const label = `${name}, ${post.handle}. ${post.caption} Opens in ${name}.`;

  return (
    <a
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-mystic-gold"
    >
      <div
        className={`relative overflow-hidden rounded border border-mystic-bg bg-mystic-card shadow-sm transition-all duration-300 group-hover:border-mystic-gold/30 ${frameClass[platform]}`}
      >
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
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-mystic-bg/80 text-mystic-gold">
          <SocialIcon platform={platform} className="h-3.5 w-3.5" />
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mystic-bg via-mystic-bg/85 to-transparent p-3 pt-10">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate font-sans text-[11px] tracking-wide text-mystic-gold">
              {post.handle}
            </span>
            <span className="shrink-0 font-sans text-[10px] text-mystic-muted">
              {postedLabel(post.createTime)}
            </span>
          </span>
          <span className="mt-1 block truncate font-sans text-xs text-mystic-text/80">
            {post.caption}
          </span>
        </div>
      </div>
    </a>
  );
}
