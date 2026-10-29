import { useCallback, useRef, useState } from "react";
import PlatformMenu from "./PlatformMenu";
import RouteLink from "./RouteLink";
import {
  shopCity,
  shopMapsHref,
  shopName,
  shopPhoneDisplay,
  shopSmsHref,
  shopStreet,
  shopTelHref,
  shopWordmark,
} from "../data/brand";
import { pages } from "../data/seo.js";
import { footerPlatforms } from "../data/socials";

export default function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();
  const [openPlatform, setOpenPlatform] = useState(null);
  const closePlatform = useCallback(() => setOpenPlatform(null), []);
  const footerRef = useRef(null);
  const barRef = useRef(null);
  const anchorRef = useRef(null);

  return (
    <footer
      ref={footerRef}
      className="bg-mystic-card border-t border-mystic-bg text-mystic-text/80 font-sans tracking-wide"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold uppercase tracking-widest text-mystic-gold">
              {shopWordmark[0]}
            </h3>
            <span className="mt-1 block font-sans text-xs uppercase tracking-[0.2em] text-mystic-sage">
              {shopWordmark[1]}
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mystic-text/60">
            Tattoo studio in Watertown, New York.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm tracking-widest text-mystic-text uppercase font-semibold border-b border-mystic-bg pb-2">
            The Studio
          </h4>
          <address className="not-italic space-y-3 text-sm">
            <a
              href={shopMapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-mystic-text/70 transition-colors duration-300 hover:text-mystic-gold"
            >
              <span className="underline decoration-mystic-sage/40">{shopStreet}</span>
              <span className="mt-1 block text-mystic-text/50">{shopCity}</span>
            </a>
            <a
              href={shopSmsHref}
              className="block font-semibold text-mystic-text transition-colors duration-300 hover:text-mystic-gold"
            >
              Text to book
            </a>
            <a
              href={shopTelHref}
              className="block text-mystic-text/70 transition-colors duration-300 hover:text-mystic-gold"
            >
              {shopPhoneDisplay}
            </a>
          </address>
          <div className="space-y-1 text-xs text-mystic-text/50">
            <p>Tuesday — Saturday: 12:00 PM — 5:00 PM</p>
            <p>Sunday — Monday: By Appointment Only</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm tracking-widest text-mystic-text uppercase font-semibold border-b border-mystic-bg pb-2">
            Navigation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {pages.map((page) => (
              <RouteLink
                key={page.path}
                href={page.path}
                onNavigate={navigate}
                className="py-1 text-left hover:text-mystic-gold transition-colors duration-200"
              >
                {page.label}
              </RouteLink>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={barRef}
        className="bg-mystic-bg/40 py-6 border-t border-mystic-bg/60"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-mystic-muted">
          <p>© {currentYear} {shopName}. All Rights Reserved.</p>
          <div ref={anchorRef} className="relative z-[56] flex items-center gap-1">
            {footerPlatforms.map((group) => (
              <PlatformMenu
                key={group.platform}
                group={group}
                open={openPlatform === group.platform}
                onOpen={() => setOpenPlatform(group.platform)}
                onClose={closePlatform}
                anchorRef={anchorRef}
                barRef={barRef}
                footerRef={footerRef}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
