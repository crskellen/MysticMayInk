import SocialIcon from "./SocialIcon";
import { platformLabels } from "../data/socials";

const variants = {
  pill: "group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-mystic-gold/35 bg-mystic-card px-4 py-2 text-mystic-text shadow-gold-glow transition-colors duration-200 hover:border-mystic-gold hover:text-mystic-gold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-mystic-gold",
  compact:
    "group inline-flex min-h-[40px] items-center gap-2 rounded-full border border-mystic-gold/25 bg-mystic-bg px-3 py-1.5 text-mystic-text transition-colors duration-200 hover:border-mystic-gold hover:text-mystic-gold focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-mystic-gold",
};

export default function SocialHandleLink({ account, compact = false }) {
  const label = platformLabels[account.platform];
  const variant = compact ? "compact" : "pill";

  return (
    <a
      href={account.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}, ${account.handle}`}
      title={`${label} · ${account.handle}`}
      className={variants[variant]}
    >
      <SocialIcon
        platform={account.platform}
        className={
          compact
            ? "h-3.5 w-3.5 shrink-0 text-mystic-gold"
            : "h-4 w-4 shrink-0 text-mystic-gold"
        }
      />
      <span
        className={
          compact
            ? "font-sans text-xs tracking-wide"
            : "font-sans text-sm tracking-wide"
        }
      >
        {account.handle}
      </span>
    </a>
  );
}
