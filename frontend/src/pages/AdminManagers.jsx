import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminManagers = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Managers</h1>
          <p className="text-slate-500">Approve and monitor managers representing your software.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Manager Name</th>
                <th className="px-6 py-4 font-bold">Domain</th>
                <th className="px-6 py-4 font-bold">Sales Generated</th>
                <th className="px-6 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No managers available.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagers;
