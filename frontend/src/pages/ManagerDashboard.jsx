import React from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import { MessageSquare, Calendar, DollarSign, Package } from 'lucide-react';

const ManagerDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Manager Overview</h1>
            <p className="text-slate-500">Manage your clients, chats, and software portfolio.</p>
          </div>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors">Apply for New Software</button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Unread Queries</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="text-blue-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">No queries yet</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Upcoming Meetings</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="text-purple-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">No meetings scheduled</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Commissions</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="text-green-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">$0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">$0 this week</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Hosted SaaS</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Package className="text-[#f97316] w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">No active domains</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Recent Chat Activity</h3>
            <div className="space-y-4">
               <p className="text-sm text-slate-500 text-center py-8">No chat activity yet.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <h3 className="font-bold text-slate-900 text-lg mb-6">Today's Meetings</h3>
            <div className="space-y-4">
               <p className="text-sm text-slate-500 text-center py-8">No meetings scheduled for today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
