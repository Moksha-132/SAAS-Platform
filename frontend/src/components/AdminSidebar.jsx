import React from 'react';
import { BarChart3, Building2, Users, LayoutDashboard, Settings, LogOut, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
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
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 block">Admin Portal</span>
      </div>
      
      <div className="flex-grow py-4">
        <nav className="space-y-2 px-4">
          <Link to="/admin-dashboard" className={getLinkClass('/admin-dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard Overview
          </Link>
          <Link to="/admin-companies" className={getLinkClass('/admin-companies')}>
            <Building2 className="w-5 h-5" />
            Companies
          </Link>
          <Link to="/admin-managers" className={getLinkClass('/admin-managers')}>
            <Users className="w-5 h-5" />
            Managers
          </Link>
          <Link to="/admin-software" className={getLinkClass('/admin-software')}>
            <Package className="w-5 h-5" />
            Software Catalog
          </Link>
          <Link to="/admin-analytics" className={getLinkClass('/admin-analytics')}>
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">Software Owner</p>
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

export default AdminSidebar;
