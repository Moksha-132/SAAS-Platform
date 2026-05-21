import React from 'react';
import ManagerSidebar from '../components/ManagerSidebar';

const ManagerSales = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Sales & Earnings</h1>
          <p className="text-slate-500">Track your closed deals and commission payouts.</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Client Name</th>
                <th className="px-6 py-4 font-bold">Software Sold</th>
                <th className="px-6 py-4 font-bold">Sale Value</th>
                <th className="px-6 py-4 font-bold">Your Commission</th>
                <th className="px-6 py-4 font-bold">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No sales generated yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerSales;
