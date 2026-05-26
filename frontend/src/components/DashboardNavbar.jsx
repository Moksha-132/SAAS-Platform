import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

const DashboardNavbar = ({ role }) => {
  return (
    <nav className="w-full bg-white border-b border-slate-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <Link to="/" className="flex flex-col select-none">
              <span className="text-2xl font-black text-slate-900 tracking-wider leading-none">SYNCSAAS</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to={`/${role}-dashboard`} className="text-slate-900 font-bold transition-colors">Overview</Link>
            <Link to="#" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">Messages</Link>
            <Link to="#" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">Settings</Link>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-900 leading-tight capitalize">{role}</p>
                <Link to="/" className="text-xs text-slate-500 hover:text-[#f97316] flex items-center gap-1 mt-0.5">
                  <LogOut className="w-3 h-3" /> Log Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
