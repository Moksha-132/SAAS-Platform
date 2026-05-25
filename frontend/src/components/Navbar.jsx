import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const stored = localStorage.getItem('syncsaas_website_settings');
  const settings = stored ? JSON.parse(stored) : null;

  const brand = settings?.brandName || 'SYNCSAAS';
  const navBg = settings?.navBgColor || '#FFFFFF';
  const navText = settings?.navTextColor || '#64748B';

  const getRgba = (hex, alpha) => {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const finalBgColor = getRgba(navBg, 0.85);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-slate-200/50 py-4 shadow-sm shadow-slate-100/40 transition-all"
      style={{ backgroundColor: finalBgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <Link to="/" className="text-2xl font-black tracking-wider" style={{ color: navText === '#64748B' ? '#0F172A' : navText }}>
              {brand}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium transition-colors" style={{ color: navText }}>Home</Link>
            <a href="/#features" className="font-medium transition-colors" style={{ color: navText }}>Features</a>
            <a href="/#how-it-works" className="font-medium transition-colors" style={{ color: navText }}>How It Works</a>
            <Link to="/contact" className="font-medium transition-colors" style={{ color: navText }}>Contact</Link>
            <Link to="/login" className="font-medium transition-colors" style={{ color: navText }}>Log In</Link>
            <Link to="/register" className="bg-[#0F172A] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
