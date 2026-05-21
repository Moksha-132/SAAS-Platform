import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import Footer from '../components/Footer';
import { CreditCard, ShoppingBag, Clock, ShieldCheck } from 'lucide-react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardNavbar role="user" />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Dashboard</h1>
            <p className="text-slate-500">Manage your subscriptions and billing details.</p>
          </div>
          <button className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-bold shadow-md">Browse Marketplace</button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Active Subscriptions</h3>
              <ShoppingBag className="text-[#0F172A] w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">4</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Monthly Spend</h3>
              <CreditCard className="text-[#0F172A] w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">$296</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Next Billing</h3>
              <Clock className="text-[#0F172A] w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900">Oct 12</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Account Status</h3>
              <ShieldCheck className="text-[#0F172A] w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-green-500">Verified</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center text-slate-500">
          Your active software list, invoices, and cart items will be displayed here.
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
