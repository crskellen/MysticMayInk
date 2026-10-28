import React from 'react';

export default function Home({ setCurrentPage }) {
  
  // High-performance content optimized for instant mobile loading
  const creativePillars = [
    {
      title: "Ornamental & Botanical",
      desc: "Delicate, custom flowing linework, geometric styling, and deep signature fern layers.",
      icon: "🌿"
    },
    {
      title: "The Tarot Vault",
      desc: "Custom spiritual, celestial, and deeply symbolic cards tailored meticulously to your story.",
      icon: "🔮"
    },
    {
      title: "Timeless Transformations",
      desc: "Expertly executed cover-ups and floral add-ons that entirely reclaim your canvas.",
      icon: "✨"
    }
  ];

  const handleActionClick = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fadeIn">
      
      {/* 1. Cutting-Edge Minimal Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-mystic-bg via-mystic-bg to-mystic-card px-6 py-20 overflow-hidden border-b border-mystic-card">
        {/* Subtle background ambient atmospheric rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-mystic-sage/5 blur-[120px] top-12 left-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center z-10 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-sans tracking-[0.4em] uppercase text-mystic-gold block animate-pulse">
              Now Operating in Watertown, NY
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-mystic-text uppercase font-serif leading-tight">
              Where Art Meets <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystic-text via-mystic-gold to-mystic-sage">
                Mystical Intent
              </span>
            </h1>
          </div>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto text-mystic-text/70 font-sans font-light leading-relaxed">
            A specialized private studio dedicated to custom illustrative ornamentation, custom energy, and absolute creative freedom. 
          </p>

          {/* Authenticated Studio Social Direct-Links Hub */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-serif uppercase tracking-widest pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-mystic-text/60 hover:text-mystic-gold transition-colors duration-200 border border-mystic-card/30 px-3 py-1.5 bg-mystic-card rounded"
            >
              Studio Instagram
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-mystic-text/60 hover:text-mystic-gold transition-colors duration-200 border border-mystic-card/30 px-3 py-1.5 bg-mystic-card rounded"
            >
              Studio TikTok
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-mystic-text/60 hover:text-mystic-gold transition-colors duration-200 border border-mystic-card/30 px-3 py-1.5 bg-mystic-card rounded"
            >
              Studio Facebook
            </a>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleActionClick('booking')}
              className="w-full sm:w-auto px-8 py-4 bg-mystic-gold text-mystic-bg font-serif text-sm tracking-widest uppercase font-semibold rounded hover:bg-mystic-text hover:text-mystic-bg transition-all duration-300 transform active:scale-95 shadow-gold-glow"
            >
              Request a Session
            </button>
            <button
              onClick={() => handleActionClick('preparation')}
              className="w-full sm:w-auto px-8 py-4 border border-mystic-sage text-mystic-text font-serif text-sm tracking-widest uppercase rounded hover:bg-mystic-card transition-all duration-300"
            >
              The Preparation Guide
            </button>
          </div>
        </div>
      </section>

      {/* 2. Focused Intentional Art Pillars Block */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-mystic-text">
            Specialized Disciplines
          </h2>
          <span className="block h-[1px] w-12 bg-mystic-gold mx-auto mt-4 shadow-gold-glow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {creativePillars.map((pillar, index) => (
            <div 
              key={index}
              className="bg-mystic-card p-8 rounded border border-mystic-bg hover:border-mystic-gold/30 shadow-sm hover:shadow-gold-glow transition-all duration-500 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="text-3xl block group-hover:scale-110 transition-transform duration-300 ease-out">{pillar.icon}</span>
                <h3 className="text-lg font-serif tracking-wide text-mystic-text group-hover:text-mystic-gold transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="text-sm text-mystic-text/60 leading-relaxed font-sans font-light">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Immersive Statement / Philosophy Banner */}
      <section className="bg-mystic-card border-t border-b border-mystic-bg py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-xl md:text-2xl font-serif tracking-widest text-mystic-gold uppercase">
            The Philosophy of Creative Freedom
          </h2>
          <p className="text-base md:text-lg text-mystic-text/80 font-sans italic font-light max-w-3xl mx-auto leading-loose">
            "Your skin is a living canvas. The most incredible, transformative artwork manifests seamlessly when you give your artist complete creative trust."
          </p>
          <div className="pt-2">
            <button 
              onClick={() => handleActionClick('artists')}
              className="text-xs tracking-[0.3em] font-serif uppercase text-mystic-sage hover:text-mystic-gold transition-colors duration-300 border-b border-mystic-sage/30 pb-1"
            >
              Explore the Portfolios →
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}