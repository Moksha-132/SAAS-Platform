import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import NotificationBell from '../components/NotificationBell';
import { CreditCard, ShoppingBag, Clock, ShieldCheck, ExternalLink, ArrowRight, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setUserEmail(user.email);
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/users/subscriptions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setSubscriptions(data.subscriptions || []);
        }
      } catch (err) {
        console.error('Error loading client dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Compute metrics from real backend database subscriptions
  const activeCount = subscriptions.length;
  
  const monthlySpend = subscriptions.reduce((sum, sub) => {
    const price = parseFloat(sub.amount_paid);
    if (sub.plan_type === 'monthly') {
      return sum + price;
    } else {
      // Yearly contributions computed monthly
      return sum + Math.round(price / 12);
    }
  }, 0);

  const getNextRenewalDate = () => {
    if (subscriptions.length === 0) return 'N/A';
    const dates = subscriptions
      .map(s => new Date(s.end_date))
      .filter(d => d > new Date());
    
    if (dates.length === 0) return 'Expired';
    const nextDate = new Date(Math.min(...dates));
    return nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <UserSidebar />
      
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8 bg-slate-50 min-h-screen">
        {/* Main Content Wrapper Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 lg:p-10 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 text-[#b45309] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Client Workspace
                </span>
                <span className="text-slate-400 text-xs font-semibold">{userEmail}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">My Dashboard</h1>
              <p className="text-slate-500 font-medium">Manage your active software licenses, billing cycles, and SaaS products.</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <NotificationBell />
              <Link 
                to="/user-marketplace" 
                className="bg-[#b45309] hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all shadow-amber-100 flex items-center gap-2 text-sm"
              >
                Browse Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b45309] mb-4"></div>
              <p className="text-slate-500 font-medium animate-pulse">Syncing client portal licenses...</p>
            </div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Active Subscriptions</h3>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <ShoppingBag className="text-[#b45309] w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{activeCount}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Premium software active</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Monthly Spend</h3>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <CreditCard className="text-[#b45309] w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">${monthlySpend}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Estimated billing cycle</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Next Billing</h3>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Clock className="text-[#b45309] w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{getNextRenewalDate()}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Closest license renewal</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Account Status</h3>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <ShieldCheck className="text-green-600 w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-green-600">Verified</p>
                  <p className="text-xs text-green-500 mt-2 font-semibold">Fully activated tenant</p>
                </div>
              </div>

              {/* Dynamic Subscription Table / Platform Links */}
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Your Active Software Licenses</h2>
                {subscriptions.length === 0 ? (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <ShoppingBag className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No Active Subscriptions Found</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto mb-6">
                      Get instant access to premium SaaS platforms by browsing our global software catalog.
                    </p>
                    <Link 
                      to="/marketplace" 
                      className="bg-[#0B132B] hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md inline-flex items-center gap-2"
                    >
                      Visit Software Marketplace
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider">
                          <th className="p-5">Software Product</th>
                          <th className="p-5">Plan</th>
                          <th className="p-5">Billing Frequency</th>
                          <th className="p-5">Price Paid</th>
                          <th className="p-5">Expiration Date</th>
                          <th className="p-5 text-right">Access Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {subscriptions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{sub.software_name}</span>
                                <span className="text-xs text-slate-400 line-clamp-1">{sub.software_description || 'No description provided'}</span>
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                Active License
                              </span>
                            </td>
                            <td className="p-5 uppercase text-xs font-bold tracking-wider text-slate-500">
                              {sub.plan_type}
                            </td>
                            <td className="p-5 font-bold text-slate-900">
                              ${parseFloat(sub.amount_paid).toFixed(2)}
                            </td>
                            <td className="p-5 text-xs text-slate-500 font-semibold">
                              {new Date(sub.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="p-5 text-right">
                              {sub.deployment_link ? (
                                <a 
                                  href={sub.deployment_link.startsWith('http') ? sub.deployment_link : `https://${sub.deployment_link}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[#b45309] hover:text-amber-800 font-bold text-sm bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl transition-all"
                                >
                                  Open SaaS <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <button 
                                  onClick={() => navigate('/user-chat')}
                                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 font-bold text-sm bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-all"
                                >
                                  Contact Support <HelpCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

