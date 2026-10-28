import React from 'react';

export default function Footer({ setCurrentPage }) {
  const currentYear = new Date().getFullYear();

  const handleFooterNav = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-mystic-card border-t border-mystic-bg text-mystic-text/80 font-sans tracking-wide">
      {/* Main Structural Layout Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Column 1: Brand & Manifesto Identity Statement */}
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold tracking-widest text-mystic-gold uppercase">
              Mystic May
            </h3>
            <span className="block font-sans text-xs tracking-[0.2em] text-mystic-sage uppercase mt-1">
              Tattoo Studio
            </span>
          </div>
          <p className="text-sm leading-relaxed text-mystic-text/60 max-w-sm">
            A sacred space for healers, custom mystical artistry, and intentional body ornamentation. Built on absolute creative freedom and mutual trust between artist and canvas.
          </p>
        </div>

        {/* Column 2: Studio Logistics, Location & Hours */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm tracking-widest text-mystic-text uppercase font-semibold border-b border-mystic-bg pb-2">
            The Studio
          </h4>
          <div className="space-y-3 text-sm">
            <a 
              href="https://google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-mystic-text/70 hover:text-mystic-gold transition-colors duration-300"
            >
              📍 <span className="underline decoration-mystic-sage/40">23239 NY 342</span>
              <span className="block pl-5 text-mystic-text/50">Watertown, NY 13601</span>
            </a>
            <div className="block text-mystic-text/70 pt-1">
              💬 <span className="font-semibold text-mystic-text">Text to Book:</span> 315-775-3727
            </div>
            <div className="pt-2 text-xs text-mystic-text/50 space-y-1">
              <p>Tuesday — Saturday: 12:00 PM — 5:00 PM</p>
              <p>Sunday — Monday: By Appointment Only</p>
            </div>
          </div>
        </div>

        {/* Column 3: Site Utilities & Internal Routing */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm tracking-widest text-mystic-text uppercase font-semibold border-b border-mystic-bg pb-2">
            Navigation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button 
              onClick={() => handleFooterNav('home')} 
              className="text-left hover:text-mystic-gold transition-colors duration-200 py-1"
            >
              Home
            </button>
            <button 
              onClick={() => handleFooterNav('artists')} 
              className="text-left hover:text-mystic-gold transition-colors duration-200 py-1"
            >
              Artists
            </button>
            <button 
              onClick={() => handleFooterNav('preparation')} 
              className="text-left hover:text-mystic-gold transition-colors duration-200 py-1"
            >
              Preparation
            </button>
            <button 
              onClick={() => handleFooterNav('booking')} 
              className="text-left hover:text-mystic-gold transition-colors duration-200 py-1"
            >
              Book Session
            </button>
          </div>
        </div>

      </div>

      {/* Baseline Bottom Copyright Segment */}
      <div className="bg-mystic-bg/40 py-6 border-t border-mystic-bg/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-mystic-muted">
          <p>© {currentYear} Mystic May Tattoo. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-mystic-gold transition-colors">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-mystic-gold transition-colors">Facebook</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-mystic-gold transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}