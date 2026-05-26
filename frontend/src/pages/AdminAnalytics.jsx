import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart3, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

const AdminAnalytics = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [revenueStats, setRevenueStats] = useState({ total: 148, managerFees: 99, subscriptionFees: 49 });

  useEffect(() => {
    const token = localStorage.getItem('syncsaas_token');
    if (token) {
      fetch('http://localhost:5000/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.totalRevenue) {
          const total = data.totalRevenue;
          const managers = (data.activeManagersCount || 0) * 99;
          const subs = total - managers;
          setRevenueStats({ total, managerFees: managers, subscriptionFees: Math.max(0, subs) });
        }
      })
      .catch(err => console.warn(err.message));
    } else {
      const defaultAccounts = [
        { role: 'manager', status: 'active', paid: true },
        { role: 'user', status: 'active', paid: false }
      ];
      const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
      const paidMgrs = accounts.filter(acc => acc.role === 'manager' && (acc.paid === true || acc.payment_completed === true)).length;
      const managerFees = paidMgrs * 99;
      const subscriptionFees = accounts.filter(acc => acc.role === 'user').reduce((sum, acc) => sum + (Number(acc.monthlySpend || acc.monthly_spend) || 0), 0);
      setRevenueStats({ total: managerFees + subscriptionFees, managerFees, subscriptionFees });
    }
  }, []);

  const barData = [
    { label: 'Jan', val: 0 },
    { label: 'Feb', val: 0 },
    { label: 'Mar', val: 0 },
    { label: 'Apr', val: 0 },
    { label: 'May', val: revenueStats.total }
  ];

  const growthData = [
    { label: 'Jan', rate: 0 },
    { label: 'Feb', rate: 0 },
    { label: 'Mar', rate: 0 },
    { label: 'Apr', rate: 0 },
    { label: 'May', rate: 12 }
  ];

  const maxVal = Math.max(...barData.map(d => d.val), 100);
  const maxRate = Math.max(...growthData.map(d => d.rate), 20);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Revenue Analytics</h1>
            <p className="text-slate-500">Deep dive into your company's financial growth.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 border border-slate-200 rounded-2xl shadow-sm">
            <DollarSign className="text-green-500 w-5 h-5" />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Run-rate</p>
              <p className="text-xl font-black text-slate-900">${revenueStats.total}/mo</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <BarChart3 className="text-[#f97316] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Revenue Breakdown</h3>
                  <p className="text-xs text-slate-400 font-medium">Monthly revenue totals</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Platform Active
              </span>
            </div>

            <div className="h-64 relative flex items-end justify-between px-6 pt-8 border-b border-l border-slate-200">
              <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 border-dashed -z-10" />
              <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 border-dashed -z-10" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 border-dashed -z-10" />

              {barData.map((bar, index) => {
                const heightPct = (bar.val / maxVal) * 100;
                return (
                  <div 
                    key={index}
                    className="flex flex-col items-center group cursor-pointer relative"
                    style={{ width: '15%' }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === index && (
                      <div className="absolute -top-12 bg-[#0F172A] text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg z-20 whitespace-nowrap">
                        ${bar.val}
                      </div>
                    )}
                    <div 
                      className="w-full bg-[#f97316] hover:bg-orange-600 rounded-t-lg transition-all duration-500 shadow-sm group-hover:shadow-md"
                      style={{ height: `${Math.max(2, heightPct)}%` }}
                    />
                    <span className="text-xs text-slate-400 font-bold mt-3 absolute -bottom-6">{bar.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#f97316] rounded-full inline-block" />
                <span>Platform Reseller & Subscription Inflow</span>
              </div>
              <span>Max: ${maxVal}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-xl">
                  <TrendingUp className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Monthly Growth</h3>
                  <p className="text-xs text-slate-400 font-medium">User profile growth speed</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                May launch
              </span>
            </div>

            <div className="h-64 relative border-b border-l border-slate-200">
              <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 border-dashed -z-10" />
              <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 border-dashed -z-10" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 border-dashed -z-10" />

              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 50,195 Q 150,195 250,195 T 450,80"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                <path
                  d="M 50,195 Q 150,195 250,195 T 450,80 L 450,200 L 50,200 Z"
                  fill="url(#growthGradient)"
                />
              </svg>

              {[
                { x: '10%', y: '97.5%', label: 'Jan', rate: '0%' },
                { x: '30%', y: '97.5%', label: 'Feb', rate: '0%' },
                { x: '50%', y: '97.5%', label: 'Mar', rate: '0%' },
                { x: '70%', y: '97.5%', label: 'Apr', rate: '0%' },
                { x: '90%', y: '40%', label: 'May', rate: '12%' }
              ].map((pt, index) => (
                <div
                  key={index}
                  className="absolute cursor-pointer group"
                  style={{ left: pt.x, top: pt.y, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div className="w-4 h-4 bg-white border-4 border-green-500 rounded-full hover:scale-125 transition-transform" />
                  {hoveredPoint === index && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-bold px-2 py-1 rounded shadow-md z-30 whitespace-nowrap">
                      {pt.label}: {pt.rate} Growth
                    </div>
                  )}
                  <span className="text-xs text-slate-400 font-bold absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">{pt.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
                <span>Monthly User Growth (Compounded)</span>
              </div>
              <span>Max: {maxRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

