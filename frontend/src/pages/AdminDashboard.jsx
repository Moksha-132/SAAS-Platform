import React from 'react';
import { BarChart3, Building2, TrendingUp, Users } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import NotificationBell from '../components/NotificationBell';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      
      <div className="flex-grow ml-64 p-8 lg:p-12 bg-slate-50 min-h-screen">
        {/* Main Content Wrapper Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 lg:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Platform Overview</h1>
              <p className="text-slate-500 font-medium">System status, company statistics, and active metrics for SHNOOR.</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors">
                Filter by Date
              </button>
              <button className="bg-[#b45309] hover:bg-amber-800 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all shadow-amber-100">
                Export Report
              </button>
            </div>
          </div>
          
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Total Revenue</h3>
                <div className="p-2 bg-green-50 rounded-lg">
                   <BarChart3 className="text-green-600 w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">$12,450</p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">12% growth this month</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Registered Companies</h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                   <Building2 className="text-blue-600 w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">18</p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">+3 new this week</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Active Managers</h3>
                <div className="p-2 bg-purple-50 rounded-lg">
                   <Users className="text-purple-600 w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">6</p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">0 pending approval</p>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Monthly Growth</h3>
                <div className="p-2 bg-amber-50 rounded-lg">
                   <TrendingUp className="text-[#b45309] w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">24.5%</p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">Exceeding projections</p>
            </div>
          </div>
  
          {/* Main Visual Sections */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm p-8 min-h-[400px] flex flex-col justify-between">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Revenue Analytics History</h3>
              <div className="flex-grow flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 bg-white">
                <p className="text-slate-400 font-medium">Direct billing sync is online. Accumulating statistical trends.</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col">
               <h3 className="font-bold text-slate-900 text-lg mb-6">Manager Verifications</h3>
               <div className="flex-grow border-2 border-dashed border-slate-200 rounded-xl p-8 bg-white flex items-center justify-center">
                  <p className="text-xs text-slate-400 text-center font-medium">All manager profiles currently verified and activated.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
