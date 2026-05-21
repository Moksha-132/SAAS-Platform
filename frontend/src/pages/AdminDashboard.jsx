import React from 'react';
import { BarChart3, Building2, TrendingUp, Users } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Platform Overview</h1>
            <p className="text-slate-500">Welcome back. Here's what's happening across SyncSaaS today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-colors">
              Filter by Date
            </button>
            <button className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors">
              Export Report
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Total Revenue</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                 <BarChart3 className="text-green-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">$0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">0% from last month</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Registered Companies</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                 <Building2 className="text-blue-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">+0 this week</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Active Managers</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                 <Users className="text-purple-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">0 pending approval</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Monthly Growth</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                 <TrendingUp className="text-[#f97316] w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">0%</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">No data yet</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-slate-400 font-medium">Not enough data to display Revenue Chart</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
             <h3 className="font-bold text-slate-900 text-lg mb-6">Recent Manager Applications</h3>
             <div className="space-y-4">
                <p className="text-sm text-slate-500 text-center py-8">No recent applications.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
