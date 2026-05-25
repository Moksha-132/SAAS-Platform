import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, DollarSign, Package, Settings, LogOut, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ManagerSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('syncsaas_user');
    return userStr ? JSON.parse(userStr) : { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', companyName: 'Alex Corp' };
  });

  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [companyName, setCompanyName] = useState(currentUser.companyName || currentUser.company_name || '');

  const getLinkClass = (currentPath) => {
    return path === currentPath
      ? "flex items-center gap-3 bg-[#f97316] text-white px-4 py-3 rounded-xl font-medium transition-colors"
      : "flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors";
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      firstName,
      lastName,
      email,
      companyName,
      company_name: companyName
    };

    localStorage.setItem('syncsaas_user', JSON.stringify(updatedUser));

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updatedAccounts = accounts.map(acc => {
      if (acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return {
          ...acc,
          firstName,
          lastName,
          email,
          companyName,
          company_name: companyName
        };
      }
      return acc;
    });
    localStorage.setItem('syncsaas_accounts', JSON.stringify(updatedAccounts));

    setCurrentUser(updatedUser);
    setShowModal(false);
    window.location.reload();
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
          <button 
            onClick={() => setShowModal(true)}
            className="w-full flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors mt-8 text-left"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold truncate max-w-[140px]">{companyName || `${firstName} ${lastName}`}</p>
          </div>
        </div>
        <Link 
          to="/" 
          onClick={() => {
            localStorage.removeItem('syncsaas_user');
            localStorage.removeItem('syncsaas_token');
          }}
          className="flex items-center gap-3 text-slate-400 hover:text-[#f97316] px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Link>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-slate-900">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Manager Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Company / Reseller Name</label>
                <input 
                  type="text" 
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="w-1/2 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-[#f97316] hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSidebar;
