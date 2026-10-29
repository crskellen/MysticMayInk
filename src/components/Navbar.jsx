import { useState } from "react";
import RouteLink from "./RouteLink";
import { shopWordmark } from "../data/brand";
import { pages } from "../data/seo.js";

const navItems = pages.filter((page) => page.inNav);

export default function Navbar({ currentPath, navigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const go = (href) => {
    setIsOpen(false);
    navigate(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-mystic-bg/95 backdrop-blur-md border-b border-mystic-card shadow-gold-glow">
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <RouteLink
          href="/"
          onNavigate={go}
          className="flex min-h-[44px] items-center gap-2.5 text-left select-none group focus:outline-none sm:gap-3"
        >
          <img
            src="/logo.jpg"
            alt=""
            width="40"
            height="40"
            className="h-10 w-10 shrink-0 object-cover"
          />
          <span>
            <span className="block font-serif text-base font-semibold uppercase tracking-[0.18em] text-mystic-text transition-colors duration-300 group-hover:text-mystic-gold sm:text-lg sm:tracking-widest">
              {shopWordmark[0]}
            </span>
            <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-mystic-sage sm:tracking-[0.25em]">
              {shopWordmark[1]}
            </span>
          </span>
        </RouteLink>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const selected = currentPath === item.path;
            return (
              <RouteLink
                key={item.path}
                href={item.path}
                onNavigate={go}
                aria-current={selected ? "page" : undefined}
                className={`relative font-serif text-sm tracking-wider uppercase transition-all duration-300 py-1 focus:outline-none
                  ${
                    selected
                      ? "text-mystic-gold font-semibold"
                      : "text-mystic-text/80 hover:text-mystic-gold"
                  }`}
              >
                {item.label}
                {selected && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-mystic-gold shadow-gold-glow" />
                )}
              </RouteLink>
            );
          })}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-mystic-text hover:text-mystic-gold focus:outline-none p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
          aria-label="Toggle Navigation Menu"
          aria-expanded={isOpen}
          aria-controls="site-menu"
        >
          <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="site-menu"
        className={`md:hidden absolute top-full left-0 w-full bg-mystic-card border-b border-mystic-bg transition-all duration-300 ease-in-out origin-top transform
          ${isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none"}`}
      >
        <div className="px-6 py-4 flex flex-col space-y-4">
          {navItems.map((item) => {
            const selected = currentPath === item.path;
            return (
              <RouteLink
                key={item.path}
                href={item.path}
                onNavigate={go}
                aria-current={selected ? "page" : undefined}
                className={`w-full text-left py-3 px-4 font-serif text-base tracking-widest uppercase rounded transition-all min-h-[48px]
                  ${
                    selected
                      ? "bg-mystic-bg text-mystic-gold font-semibold border-l-2 border-mystic-gold"
                      : "text-mystic-text hover:bg-mystic-bg/50 hover:text-mystic-gold"
                  }`}
              >
                {item.label}
              </RouteLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
