import React, { useState } from 'react';

export default function Navbar({ currentPage, setCurrentPage }) {
  // Toggle state to drive the mobile tap menu drawer
  const [isOpen, setIsOpen] = useState(false);

  // Unified page registry for scannable iteration
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'artists', label: 'Artists' },
    { id: 'preparation', label: 'Preparation' },
    { id: 'booking', label: 'Book Session' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false); // Snap mobile drawer shut on selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-mystic-bg/95 backdrop-blur-md border-b border-mystic-card shadow-gold-glow">
      <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Core Brand Target - Primary Mobile Touch Anchor */}
        <button 
          onClick={() => handleNavClick('home')}
          className="text-left select-none group focus:outline-none"
        >
          <span className="font-serif text-lg font-semibold tracking-widest text-mystic-text group-hover:text-mystic-gold transition-colors duration-300">
            MYSTIC MAY
          </span>
          <span className="block font-sans text-[10px] tracking-[0.25em] text-mystic-sage uppercase">
            Tattoo Studio
          </span>
        </button>

        {/* Desktop Navigation Link Cluster (Hidden on Mobile by default) */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-serif text-sm tracking-wider uppercase transition-all duration-300 relative py-1 focus:outline-none
                ${currentPage === item.id 
                  ? 'text-mystic-gold font-semibold' 
                  : 'text-mystic-text/80 hover:text-mystic-gold'}`}
            >
              {item.label}
              {/* Active underlining anchor indicator */}
              {currentPage === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-mystic-gold shadow-gold-glow animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Action Button (Hidden on Desktop) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-mystic-text hover:text-mystic-gold focus:outline-none p-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
          aria-label="Toggle Navigation Menu"
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

      {/* Mobile Menu Drawer Overlay (Toggled from base state) */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-mystic-card border-b border-mystic-bg transition-all duration-300 ease-in-out origin-top transform
          ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}
      >
        <div className="px-6 py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left py-3 px-4 font-serif text-base tracking-widest uppercase rounded transition-all min-h-[48px]
                ${currentPage === item.id 
                  ? 'bg-mystic-bg text-mystic-gold font-semibold border-l-2 border-mystic-gold' 
                  : 'text-mystic-text hover:bg-mystic-bg/50 hover:text-mystic-gold'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}