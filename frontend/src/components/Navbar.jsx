import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = useWebsiteSettings();

  const brand = settings?.brandName || 'SHNOOR';
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
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <Link to="/" onClick={handleHomeClick} className="flex flex-col select-none">
              <span className="text-2xl font-black tracking-wider leading-none" style={{ color: navText === '#64748B' ? '#0F172A' : navText }}>
                {brand}
              </span>
              {brand === 'SHNOOR' && (
                <span className="text-[9px] font-black text-[#b45309] tracking-widest uppercase mt-0.5">International LLC</span>
              )}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" onClick={handleHomeClick} className="font-medium transition-colors" style={{ color: navText }}>Home</Link>
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="font-medium transition-colors" style={{ color: navText }}>Features</a>
            <a href="#marketplace" onClick={(e) => handleNavClick(e, 'marketplace')} className="font-medium transition-colors" style={{ color: navText }}>Marketplace</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="font-medium transition-colors" style={{ color: navText }}>How It Works</a>
            <Link to="/contact" className="font-medium transition-colors" style={{ color: navText }}>Contact</Link>
            <Link to="/login" className="font-medium transition-colors" style={{ color: navText }}>Log In</Link>
            <Link to="/register" className="bg-[#b45309] hover:bg-amber-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md shadow-amber-100">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
