import React from 'react';
import ManagerSidebar from '../components/ManagerSidebar';

const ManagerSoftware = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Hosted Software</h1>
            <p className="text-slate-500">Manage the SaaS products you represent and sell.</p>
          </div>
          <button className="bg-[#0F172A] text-white px-4 py-2 rounded-lg font-bold shadow-md">Find New Software</button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-3 text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
             No software hosted yet. Click "Find New Software" to begin selling.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSoftware;
