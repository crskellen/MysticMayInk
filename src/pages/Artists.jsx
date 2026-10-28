import React, { useState } from 'react';

export default function Artists() {
  // Track which artist's portfolio is currently active
  const [activeArtist, setActiveArtist] = useState('meagan');

  const artistsData = {
    meagan: {
      name: "Meagan Caprice",
      tagline: "@capriceink_",
      instagram: "https://instagram.com",
      tiktok: "https://tiktok.com_",
      bio: "Founder of Mystic May. Specializing in intricate ornamental linework, botanical ferns, custom tarot card allegories, and massive illustrative transformations.",
      tags: ["Ornamental", "Botanical", "Tarot Cards", "Cover-Ups"],
      gallery: [
        { id: 1, category: "Botanical", title: "Signature Fern Linework" },
        { id: 2, category: "Tarot Cards", title: "The Moon Custom Card" },
        { id: 3, category: "Cover-Ups", title: "9-Hour Octopus Transformation" },
        { id: 4, category: "Custom", title: "Porsche Realism Art Reveal" },
      ]
    },
    britt: {
      name: "Inksbybritt",
      tagline: "@inksbybritt",
      instagram: "https://instagram.com",
      tiktok: "https://tiktok.com",
      bio: "Resident Artist. Specializing in fine line precision, clean minimalist scripts, vibrant custom color designs, and dynamic contemporary micro-realism.",
      tags: ["Fine Line", "Micro-Realism", "Color Work", "Minimalism"],
      gallery: [
        { id: 1, category: "Fine Line", title: "Delicate Script Text" },
        { id: 2, category: "Micro-Realism", title: "Pet Portrait Detail" },
        { id: 3, category: "Color Work", title: "Neo-Traditional Floral" },
        { id: 4, category: "Minimalism", title: "Celestial Constellations" },
      ]
    }
  };

  const currentArtist = artistsData[activeArtist];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fadeIn">
      
      {/* 1. Artist Selector Tabs - Mobile First Split */}
      <div className="flex border-b border-mystic-card mb-12 max-w-md mx-auto">
        <button
          onClick={() => setActiveArtist('meagan')}
          className={`w-1/2 text-center py-4 font-serif text-sm tracking-widest uppercase transition-all duration-300 min-h-[48px]
            ${activeArtist === 'meagan' 
              ? 'text-mystic-gold border-b-2 border-mystic-gold font-semibold' 
              : 'text-mystic-text/50 hover:text-mystic-text'}`}
        >
          Meagan Caprice
        </button>
        <button
          onClick={() => setActiveArtist('britt')}
          className={`w-1/2 text-center py-4 font-serif text-sm tracking-widest uppercase transition-all duration-300 min-h-[48px]
            ${activeArtist === 'britt' 
              ? 'text-mystic-gold border-b-2 border-mystic-gold font-semibold' 
              : 'text-mystic-text/50 hover:text-mystic-text'}`}
        >
          Inksbybritt
        </button>
      </div>

      {/* 2. Dynamic Profile Spotlight Card */}
      <section className="bg-mystic-card rounded p-6 md:p-10 border border-mystic-bg shadow-gold-glow mb-16 transition-all duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-4">
                <h2 className="text-2xl md:text-3xl font-serif text-mystic-text uppercase tracking-wide">
                  {currentArtist.name}
                </h2>
                <span className="text-xs font-mono text-mystic-gold tracking-wider mt-1">
                  {currentArtist.tagline}
                </span>
              </div>
              
              {/* Individual Social Targets - Fully Functional Deep Links */}
              <div className="flex items-center gap-3 pt-2 text-xs font-serif uppercase tracking-widest text-mystic-text/60">
                <a 
                  href={currentArtist.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-mystic-gold transition-colors"
                >
                  [ Instagram ]
                </a>
                <a 
                  href={currentArtist.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-mystic-gold transition-colors"
                >
                  [ TikTok ]
                </a>
              </div>
            </div>
            
            <p className="text-sm font-sans font-light leading-relaxed text-mystic-text/70">
              {currentArtist.bio}
            </p>
            
            {/* Tag Cluster */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentArtist.tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="text-[10px] font-sans tracking-widest uppercase bg-mystic-bg text-mystic-sage px-3 py-1.5 rounded border border-mystic-card"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Immersive Modern Art Grid Layout */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-mystic-card pb-4">
          <h3 className="font-serif text-base tracking-widest uppercase text-mystic-text">
            Featured Canvas Gallery
          </h3>
          <span className="text-xs font-sans text-mystic-muted tracking-wide">
            {currentArtist.gallery.length} Pieces Displayed
          </span>
        </div>

        {/* Dynamic Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentArtist.gallery.map((item) => (
            <div 
              key={item.id} 
              className="group bg-mystic-card rounded overflow-hidden border border-mystic-bg hover:border-mystic-gold/30 transition-all duration-300 shadow-sm"
            >
              {/* High-Aspect Ratio Placeholder for Image Feeds */}
              <div className="aspect-[3/4] w-full bg-mystic-bg flex items-center justify-center relative overflow-hidden">
                <span className="text-xs font-serif text-mystic-muted group-hover:text-mystic-gold transition-colors duration-300">
                  [{item.category}]
                </span>
                
                {/* Floating Micro-Overlay Anchor */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-mystic-bg via-mystic-bg/80 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs font-serif text-mystic-text tracking-wide uppercase">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}