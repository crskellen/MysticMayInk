import { useEffect, useId, useRef, useState } from "react";
import SocialIcon from "./SocialIcon";
import { platformLabels } from "../data/socials";

const MENU_WIDTH = 288;

function menuPosition(button, anchor, bar, footer) {
  const gutter = 12;
  const narrow = window.innerWidth < 768;

  if (narrow) {
    const width = window.innerWidth - gutter * 2;
    const top = Math.max(88, (window.innerHeight - 210) / 2);
    return { left: gutter, top, width };
  }

  const width = Math.min(MENU_WIDTH, window.innerWidth - gutter * 2);
  const anchorRect = (anchor || button).getBoundingClientRect();
  let left = anchorRect.right - width;
  left = Math.max(gutter, Math.min(left, window.innerWidth - width - gutter));

  const barTop = bar?.getBoundingClientRect().top ?? button.getBoundingClientRect().top;
  const footerTop = footer?.getBoundingClientRect().top ?? barTop;
  // Sit above the whole footer when it is on screen. Otherwise sit above
  // the copyright bar so the menu stays in view without cutting that line.
  const edge = footerTop >= 240 ? footerTop : barTop;
  const bottom = window.innerHeight - edge + gutter;
  return { left, bottom, width };
}

export default function PlatformMenu({
  group,
  open,
  onOpen,
  onClose,
  anchorRef,
  barRef,
  footerRef,
}) {
  const buttonRef = useRef(null);
  const firstItemRef = useRef(null);
  const focusedOnOpen = useRef(false);
  const [box, setBox] = useState(null);
  const label = platformLabels[group.platform];
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      focusedOnOpen.current = false;
      setBox(null);
      return undefined;
    }

    const place = () => {
      if (!buttonRef.current) return;
      const next = menuPosition(
        buttonRef.current,
        anchorRef?.current,
        barRef?.current,
        footerRef?.current,
      );
      setBox((current) => {
        if (
          current &&
          current.left === next.left &&
          current.top === next.top &&
          current.bottom === next.bottom &&
          current.width === next.width
        ) {
          return current;
        }
        return next;
      });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef, barRef, footerRef]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      onClose();
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && box && !focusedOnOpen.current) {
      focusedOnOpen.current = true;
      firstItemRef.current?.focus({ preventScroll: true });
    }
  }, [open, box]);

  const onMenuKeyDown = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = event.currentTarget.querySelectorAll('[role="menuitem"]');
    if (!items.length) return;
    const index = [...items].indexOf(document.activeElement);
    const nextIndex =
      event.key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    items[nextIndex].focus();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${label} accounts`}
        onClick={() => (open ? onClose() : onOpen())}
        className={`relative z-[57] flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-mystic-gold ${
          open
            ? "border-mystic-gold bg-mystic-bg text-mystic-gold"
            : "border-transparent text-mystic-text/80 hover:border-mystic-gold/40 hover:text-mystic-gold"
        }`}
      >
        <SocialIcon platform={group.platform} className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/75"
          onPointerDown={onClose}
          aria-hidden="true"
        />
      )}

      {open && box && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          style={{
            left: box.left,
            width: box.width,
            top: box.top,
            bottom: box.bottom,
          }}
          className="social-menu fixed z-[60] max-h-[70vh] overflow-y-auto rounded-md border border-mystic-gold/40 bg-mystic-card shadow-[0_18px_50px_rgba(0,0,0,0.65)]"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <SocialIcon
              platform={group.platform}
              className="h-4 w-4 text-mystic-gold"
            />
            <p className="font-serif text-[11px] uppercase tracking-[0.22em] text-mystic-gold">
              {label}
            </p>
          </div>
          <ul className="divide-y divide-white/5">
            {group.accounts.map((account, index) => {
              const itemLabel = account.handle.startsWith("@")
                ? `${label}, ${account.name}, ${account.handle}`
                : `${label}, ${account.name}`;
              return (
                <li key={`${account.platform}-${account.name}`}>
                  <a
                    ref={index === 0 ? firstItemRef : undefined}
                    role="menuitem"
                    href={account.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={itemLabel}
                    onClick={onClose}
                    className="block px-4 py-3 transition-colors duration-150 hover:bg-mystic-bg focus-visible:bg-mystic-bg focus-visible:outline-none"
                  >
                    <span className="block font-serif text-sm tracking-wide text-mystic-text">
                      {account.name}
                    </span>
                    {account.handle.startsWith("@") && (
                      <span className="mt-0.5 block font-sans text-xs text-mystic-muted">
                        {account.handle}
                      </span>
                    )}
                    {account.detail && (
                      <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.16em] text-mystic-muted">
                        {account.detail}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
