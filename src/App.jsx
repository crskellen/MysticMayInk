import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Artists from './pages/Artists';
import Preparation from './pages/Preparation';
import Booking from './pages/Booking';

export default function App() {
  // Simple state to track the active page view
  const [currentPage, setCurrentPage] = useState('home');

  // Render the appropriate page based on the current state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'artists':
        return <Artists />;
      case 'preparation':
        return <Preparation />;
      case 'booking':
        return <Booking />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-mystic-bg text-mystic-text font-sans flex flex-col selection:bg-mystic-gold selection:text-mystic-bg">
      {/* Persistent global layout tracking */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {/* Dynamic Main Workspace Container */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}