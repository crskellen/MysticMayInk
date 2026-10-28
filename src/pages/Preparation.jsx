import React from 'react';

export default function Preparation() {
  const rules = [
    { title: "Always Eat Before", detail: "Eat a solid, full meal 1–2 hours before your session. Keeping your blood sugar stabilized prevents lightheadedness and helps handle seating durations cleanly." },
    { title: "Hydrate Constantly", detail: "Drink clean amounts of water for 48 hours leading up to your date. Hydrated skin holds custom ink lines smoothly and recovers much faster." },
    { title: "Dress Accessibly", detail: "Wear loose, clean clothing that easily exposes the placement zone without putting pressure on the raw canvas after completion." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fadeIn">
      <div className="text-center space-y-3 mb-16">
        <h2 className="text-3xl font-serif uppercase tracking-widest text-mystic-text">Canvas Preparation Manual</h2>
        <p className="text-xs font-sans tracking-[0.25em] text-mystic-gold uppercase animate-pulse">Critical Session Guidelines</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-mystic-card border border-mystic-bg p-6 rounded shadow-sm hover:shadow-gold-glow hover:border-mystic-gold/20 transition-all duration-300">
            <h3 className="font-serif text-lg tracking-wide text-mystic-gold mb-3">
              0{idx + 1}. {rule.title}
            </h3>
            <p className="text-xs font-sans font-light leading-relaxed text-mystic-text/70">
              {rule.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}