import React, { useState } from 'react';

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idea: '',
    creativeFreedom: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build a clean SMS template for mobile text dispatching
    const smsMessage = `Hey Meagan! My name is ${formData.name}. I want to book a session. Concept: ${formData.idea}. Open to total creative freedom: ${formData.creativeFreedom ? 'Yes' : 'No'}.`;
    window.location.href = `sms:+13157753727?body=${encodeURIComponent(smsMessage)}`;
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12 md:py-20 animate-fadeIn">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-3xl font-serif uppercase tracking-widest text-mystic-text">Request a Session</h2>
        <p className="text-xs font-sans tracking-wider text-mystic-sage uppercase">Watertown Shop Intake</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-mystic-card border border-mystic-bg p-6 md:p-8 rounded space-y-6 shadow-gold-glow">
        <div className="space-y-2">
          <label className="block text-xs font-serif tracking-widest uppercase text-mystic-gold">Your Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-mystic-bg border border-mystic-card rounded p-3 text-sm text-mystic-text focus:outline-none focus:border-mystic-gold min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-serif tracking-widest uppercase text-mystic-gold">Concept & Placement Idea</label>
          <textarea 
            rows="4"
            required
            value={formData.idea}
            onChange={(e) => setFormData({...formData, idea: e.target.value})}
            className="w-full bg-mystic-bg border border-mystic-card rounded p-3 text-sm text-mystic-text focus:outline-none focus:border-mystic-gold"
            placeholder="Describe the placement and design details..."
          />
        </div>

        <div className="flex items-center space-x-3 py-2 select-none cursor-pointer">
          <input 
            type="checkbox" 
            id="freedom"
            checked={formData.creativeFreedom}
            onChange={(e) => setFormData({...formData, creativeFreedom: e.target.checked})}
            className="w-5 h-5 accent-mystic-gold cursor-pointer rounded bg-mystic-bg border-mystic-card focus:ring-0"
          />
          <label htmlFor="freedom" className="text-xs font-sans tracking-wide text-mystic-text/80 cursor-pointer">
            I wish to give the artist complete creative freedom on this piece 🤝
          </label>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-mystic-gold text-mystic-bg font-serif text-sm tracking-widest uppercase font-semibold rounded hover:bg-mystic-text transition-all duration-300 transform active:scale-95 shadow-md min-h-[48px]"
        >
          Generate Text Booking Request
        </button>
      </form>
    </div>
  );
}