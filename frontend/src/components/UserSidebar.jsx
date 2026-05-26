import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, ShoppingCart, Package, Settings, LogOut, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const UserSidebar = () => {
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
    return userStr ? JSON.parse(userStr) : { firstName: 'John', lastName: 'User', email: 'user@company.com', companyName: 'John Doe Corp' };
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

  return (
    <div 
      className="w-64 min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50"
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
        <span className="text-xs opacity-75 font-bold uppercase tracking-widest mt-2 block">Client Portal</span>
      </div>
      
      <div className="flex-grow py-4">
        <nav className="space-y-2 px-4">
          <Link to="/user-dashboard" className={getLinkClass('/user-dashboard')} style={getLinkStyle('/user-dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Overview
          </Link>
          <Link to="/user-marketplace" className={getLinkClass('/user-marketplace')} style={getLinkStyle('/user-marketplace')}>
            <ShoppingCart className="w-5 h-5" />
            Marketplace
          </Link>
          <Link to="/user-cart" className={getLinkClass('/user-cart')} style={getLinkStyle('/user-cart')}>
            <Package className="w-5 h-5" />
            My Cart
          </Link>
          <Link to="/user-chat" className={getLinkClass('/user-chat')} style={getLinkStyle('/user-chat')}>
            <MessageSquare className="w-5 h-5" />
            Support Chat
          </Link>
          <Link to="/user-settings" className={getLinkClass('/user-settings')} style={getLinkStyle('/user-settings')}>
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
    </div>
  );
};

export default UserSidebar;
