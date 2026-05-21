import React from 'react';
import { LayoutDashboard, MessageSquare, DollarSign, Package, Settings, LogOut, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ManagerSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (currentPath) => {
    return path === currentPath
      ? "flex items-center gap-3 bg-[#f97316] text-white px-4 py-3 rounded-xl font-medium transition-colors"
      : "flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors";
  };

  return (
    <div className="w-64 bg-[#0F172A] text-white min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      <div className="p-6 mb-4">
        <Link to="/" className="text-2xl font-black tracking-wider text-white flex items-center gap-2">
          SYNCSAAS
        </Link>
        <span className="text-xs text-[#f97316] font-bold uppercase tracking-widest mt-1 block">Manager Portal</span>
      </div>
      
      <div className="flex-grow py-4">
        <nav className="space-y-2 px-4">
          <Link to="/manager-dashboard" className={getLinkClass('/manager-dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Overview
          </Link>
          <Link to="/manager-software" className={getLinkClass('/manager-software')}>
            <Package className="w-5 h-5" />
            Hosted Software
          </Link>
          <Link to="/manager-chat" className={getLinkClass('/manager-chat')}>
            <MessageSquare className="w-5 h-5" />
            Client Chat
          </Link>
          <Link to="/manager-sales" className={getLinkClass('/manager-sales')}>
            <DollarSign className="w-5 h-5" />
            Sales & Earnings
          </Link>
          <Link to="#" className="flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors mt-8">
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
            <p className="text-sm font-bold">Alex Manager</p>
          </div>
        </div>
        <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-[#f97316] px-4 py-2 rounded-xl font-medium transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </Link>
      </div>
    </div>
  );
};

export default ManagerSidebar;
