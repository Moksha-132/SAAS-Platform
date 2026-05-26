import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, DollarSign, Package, Settings, LogOut, Users, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AIAssistantWidget from './AIAssistantWidget';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const ManagerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isDarkColor = (hex) => {
    if (!hex) return true;
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return true;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq < 128;
  };

  const settings = useWebsiteSettings();
  const brandName = settings?.brandName || 'SHNOOR';
  const navBgColor = settings?.navBgColor || '#0F172A';
  const defaultTextColor = isDarkColor(navBgColor) ? '#ffffff' : '#0F172A';
  const navTextColor = settings?.navTextColor || defaultTextColor;
  const accentColor = settings?.accentColor || '#b45309';

  const [currentUser] = useState(() => {
    const userStr = localStorage.getItem('syncsaas_user') || localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', companyName: 'Alex Corp' };
  });

  const getLinkClass = (currentPath) => {
    return path === currentPath
      ? "flex items-center gap-3 text-white px-4 py-3 rounded-xl font-medium transition-colors"
      : "flex items-center gap-3 opacity-80 hover:opacity-100 px-4 py-3 rounded-xl font-medium transition-colors";
  };

  const getLinkStyle = (currentPath) => {
    return path === currentPath
      ? { backgroundColor: accentColor }
      : { color: navTextColor };
  };

  const handleLogout = () => {
    localStorage.removeItem('syncsaas_user');
    localStorage.removeItem('syncsaas_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl shadow-lg border transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        aria-label="Toggle navigation menu"
        style={{
          backgroundColor: navBgColor,
          color: navTextColor,
          borderColor: isDarkColor(navBgColor) ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.15)'
        }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar main panel */}
      <div 
        className={`w-64 min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-45 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: navBgColor, color: navTextColor }}
      >
      <div className="p-6 mb-4">
        <Link to="/" className="flex flex-col select-none">
          <span className="text-2xl font-black tracking-wider leading-none" style={{ color: navTextColor }}>
            {brandName}
          </span>
          {brandName === 'SHNOOR' && (
            <span className="text-[9px] font-black tracking-widest uppercase mt-1" style={{ color: accentColor }}>
              International LLC
            </span>
          )}
        </Link>
        <span className="text-xs opacity-75 font-bold uppercase tracking-widest mt-2 block">Manager Portal</span>
      </div>
      
      <div className="flex-grow py-4">
        <nav className="space-y-2 px-4">
          <Link to="/manager-dashboard" className={getLinkClass('/manager-dashboard')} style={getLinkStyle('/manager-dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Overview
          </Link>
          <Link to="/manager-software" className={getLinkClass('/manager-software')} style={getLinkStyle('/manager-software')}>
            <Package className="w-5 h-5" />
            Hosted Software
          </Link>
          <Link to="/manager-chat" className={getLinkClass('/manager-chat')} style={getLinkStyle('/manager-chat')}>
            <MessageSquare className="w-5 h-5" />
            Client Chat
          </Link>
          <Link to="/manager-sales" className={getLinkClass('/manager-sales')} style={getLinkStyle('/manager-sales')}>
            <DollarSign className="w-5 h-5" />
            Sales & Earnings
          </Link>
          <Link to="/manager-settings" className={getLinkClass('/manager-settings') + " mt-8"} style={getLinkStyle('/manager-settings')}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold truncate max-w-[140px]">{currentUser.companyName || currentUser.company_name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 opacity-80 hover:opacity-100 px-4 py-2 rounded-xl font-medium transition-colors text-left"
          style={{ color: navTextColor }}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      <AIAssistantWidget role="manager" />
    </div>
  </>
);
};

export default ManagerSidebar;
