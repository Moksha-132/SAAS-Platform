import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import { DollarSign, ShieldAlert, BadgePercent, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerSales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ revenue: 0, count: 0 });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/managers/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setSales(data.recentSales || []);
          setTotals({
            revenue: parseFloat(data.analytics?.totalRevenue || 0),
            count: parseInt(data.analytics?.salesCount || 0, 10)
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Sales & Earnings</h1>
              <p className="text-slate-500 font-medium">Track your closed client deals, software purchases, and commission payouts.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</p>
                  <p className="text-lg font-black text-slate-900">${totals.revenue.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-[#b45309]">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commission Earned</p>
                  <p className="text-lg font-black text-slate-900">${(totals.revenue * 0.1).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#b45309] border-t-transparent mb-4"></div>
              <p className="text-slate-500 font-medium animate-pulse">Syncing transaction ledger...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Sales Transactions Found</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                Once clients subscribe to your managed products, transactions will render here in real time.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-4.5">Client Account</th>
                      <th className="px-6 py-4.5">Software Subscribed</th>
                      <th className="px-6 py-4.5">Plan Type</th>
                      <th className="px-6 py-4.5">Billing Cycle</th>
                      <th className="px-6 py-4.5">Transaction Date</th>
                      <th className="px-6 py-4.5">Sale Value</th>
                      <th className="px-6 py-4.5 text-right">Commission (10%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{sale.client_email}</td>
                        <td className="px-6 py-4">{sale.software_name}</td>
                        <td className="px-6 py-4 uppercase text-xs font-bold text-slate-500">{sale.plan_type}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                            Active Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                          {new Date(sale.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">${parseFloat(sale.amount_paid).toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-green-600 font-bold flex items-center justify-end gap-1.5">
                          ${(parseFloat(sale.amount_paid) * 0.1).toFixed(2)}
                          <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManagerSales;

