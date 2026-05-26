import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import { User, Mail, Lock, ShieldCheck, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerSettings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setName(user.companyName || user.name || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(data.message);
        localStorage.setItem('user', JSON.stringify(data.user));
        setPassword('');
      } else {
        setErrorMsg(data.message || 'Failed to update settings.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while saving profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <Link to="/manager-dashboard" className="text-slate-500 hover:text-slate-900 transition-colors p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
              <p className="text-slate-500 font-medium">Manage your security credentials and personal details.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                <User className="w-6 h-6 text-[#b45309]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Profile Configuration</h2>
                <p className="text-sm text-slate-500">Update your account credentials to keep them secure.</p>
              </div>
            </div>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" /> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Display / Company Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-slate-900 font-medium bg-slate-50 focus:bg-white transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-slate-900 font-medium bg-slate-50 focus:bg-white transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">New Password (Optional)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-slate-900 font-medium bg-slate-50 focus:bg-white transition-colors"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#b45309] hover:bg-amber-800 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-amber-100 flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Save className="w-5 h-5" /> Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;

