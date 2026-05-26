import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = useWebsiteSettings();

  const brand = settings?.brandName || 'SYNCSAAS';
  const navBg = settings?.navBgColor || '#FFFFFF';
  const navText = settings?.navTextColor || '#64748B';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleNavClick = (e, targetId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${targetId}`);
      }
    } else {
      e.preventDefault();
      navigate(`/#${targetId}`);
    }
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-slate-200/50 py-4 shadow-sm shadow-slate-100/40 transition-all"
      style={{ backgroundColor: finalBgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleHomeClick} aria-label="SyncSaaS homepage" className="flex flex-col select-none">
              <span className="text-2xl font-black tracking-wider leading-none" style={{ color: navText === '#64748B' ? '#0F172A' : navText }}>
                {brand}
              </span>
              {brand === 'SHNOOR' && (
                <span className="text-[9px] font-black text-[#b45309] tracking-widest uppercase mt-0.5">International LLC</span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl border border-slate-200/50 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Toggle mobile menu"
                style={{ color: navText }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" onClick={handleHomeClick} className="font-medium transition-colors hover:opacity-80" style={{ color: navText }}>Home</Link>
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="font-medium transition-colors hover:opacity-80" style={{ color: navText }}>Features</a>
            <a href="#marketplace" onClick={(e) => handleNavClick(e, 'marketplace')} className="font-medium transition-colors hover:opacity-80" style={{ color: navText }}>Marketplace</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="font-medium transition-colors hover:opacity-80" style={{ color: navText }}>How It Works</a>
            <Link to="/contact" className="font-medium transition-colors hover:opacity-80" style={{ color: navText }}>Contact</Link>
            <Link to="/login" className="font-medium transition-colors hover:opacity-80" style={{ color: navText }}>Log In</Link>
            <Link to="/register" className="bg-[#b45309] hover:bg-amber-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md shadow-amber-100">
              Register
            </Link>
          </div>

          {/* Mobile Drawer Menu */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[420px] opacity-100 mt-4 border-t border-slate-200/50 pt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}
          >
            <div className="flex flex-col space-y-4 pb-2 text-left">
              <Link to="/" onClick={(e) => { handleHomeClick(e); setIsMobileMenuOpen(false); }} className="font-semibold transition-colors px-2 py-1 hover:bg-slate-50 rounded-lg" style={{ color: navText }}>Home</Link>
              <a href="#features" onClick={(e) => { handleNavClick(e, 'features'); setIsMobileMenuOpen(false); }} className="font-semibold transition-colors px-2 py-1 hover:bg-slate-50 rounded-lg" style={{ color: navText }}>Features</a>
              <a href="#marketplace" onClick={(e) => { handleNavClick(e, 'marketplace'); setIsMobileMenuOpen(false); }} className="font-semibold transition-colors px-2 py-1 hover:bg-slate-50 rounded-lg" style={{ color: navText }}>Marketplace</a>
              <a href="#how-it-works" onClick={(e) => { handleNavClick(e, 'how-it-works'); setIsMobileMenuOpen(false); }} className="font-semibold transition-colors px-2 py-1 hover:bg-slate-50 rounded-lg" style={{ color: navText }}>How It Works</a>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold transition-colors px-2 py-1 hover:bg-slate-50 rounded-lg" style={{ color: navText }}>Contact</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold transition-colors px-2 py-1 hover:bg-slate-50 rounded-lg" style={{ color: navText }}>Log In</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#9a3412] hover:bg-[#7c2d12] text-white px-4 py-2.5 rounded-lg font-semibold text-center transition-all shadow-md block">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
