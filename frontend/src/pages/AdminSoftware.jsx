import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminSoftware = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Software Catalog</h1>
            <p className="text-slate-500">Manage the software products you own on the platform.</p>
          </div>
          <button className="bg-[#0F172A] text-white px-4 py-2 rounded-lg font-bold shadow-md">Add New Software</button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-3 text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
             No software products added yet. Click "Add New Software" to begin.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSoftware;
