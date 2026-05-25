import React from 'react';
import { LayoutDashboard, MessageSquare, ShoppingBag, Settings, LogOut, Users, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (currentPath) => {
    return path === currentPath
      ? "flex items-center gap-3 bg-[#b45309] text-white px-4 py-3 rounded-xl font-medium transition-colors"
      : "flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors";
  };

  return (
    <div className="w-64 bg-[#0F172A] text-white min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      <div className="p-6 mb-4">
        <Link to="/" className="flex flex-col select-none text-white">
          <span className="text-2xl font-black tracking-wider leading-none">SHNOOR</span>
          <span className="text-[9px] font-black text-[#b45309] tracking-widest uppercase mt-1">International LLC</span>
        </Link>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 block">Client Portal</span>
      </div>
      
      <div className="flex-grow py-4">
        <nav className="space-y-2 px-4">
          <Link to="/user-dashboard" className={getLinkClass('/user-dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Overview
          </Link>
          <Link to="/user-marketplace" className={getLinkClass('/user-marketplace')}>
            <ShoppingBag className="w-5 h-5" />
            SaaS Marketplace
          </Link>
          <Link to="/user-cart" className={getLinkClass('/user-cart')}>
            <ShoppingCart className="w-5 h-5" />
            My Cart
          </Link>
          <Link to="/user-chat" className={getLinkClass('/user-chat')}>
            <MessageSquare className="w-5 h-5" />
            Support Chat
          </Link>
          <Link to="/user-contact" className={getLinkClass('/user-contact')}>
            <MessageSquare className="w-5 h-5" />
            Contact Support
          </Link>
          <Link to="/user-settings" className={getLinkClass('/user-settings') + " mt-8"}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold truncate max-w-[120px]">
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return user.company_name || user.email || 'Client User';
              })()}
            </p>
          </div>
        </div>
        <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-[#b45309] px-4 py-2 rounded-xl font-medium transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default UserSidebar;
