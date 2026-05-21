import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart3, TrendingUp } from 'lucide-react';

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Revenue Analytics</h1>
          <p className="text-slate-500">Deep dive into your company's financial growth.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <BarChart3 className="text-[#f97316] w-6 h-6" />
                 <h3 className="text-xl font-bold text-slate-900">Revenue Breakdown</h3>
              </div>
              <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                 <p className="text-slate-400 font-medium">Chart visualization here</p>
              </div>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <TrendingUp className="text-green-500 w-6 h-6" />
                 <h3 className="text-xl font-bold text-slate-900">Monthly Growth</h3>
              </div>
              <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                 <p className="text-slate-400 font-medium">Line graph visualization here</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
