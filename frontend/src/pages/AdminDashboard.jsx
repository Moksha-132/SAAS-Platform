import React, { useState, useEffect } from 'react';
import { BarChart3, Building2, TrendingUp, Users, Download, Calendar } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    companies: 0,
    activeManagers: 0,
    pendingManagers: 0,
    growth: '0%',
    pendingList: []
  });

  const [dateFilter, setDateFilter] = useState('All Time');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rawAccounts, setRawAccounts] = useState([]);

  const loadBackendData = async () => {
    const token = localStorage.getItem('syncsaas_token');
    
    if (!token) {
      loadFallbackData();
      return;
    }

    try {
      const analyticsRes = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyticsData = await analyticsRes.json();

      const pendingRes = await fetch('http://localhost:5000/api/admin/managers/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pendingData = await pendingRes.json();

      const managersRes = await fetch('http://localhost:5000/api/admin/managers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const managersData = await managersRes.json();

      const companiesRes = await fetch('http://localhost:5000/api/admin/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const companiesData = await companiesRes.json();

      if (analyticsRes.ok && pendingRes.ok && managersRes.ok && companiesRes.ok) {
        setRawAccounts([
          ...managersData.map(m => ({ ...m, role: 'manager', created_at: m.created_at || new Date().toISOString() })),
          ...companiesData.map(c => ({ ...c, role: 'user', created_at: c.created_at || new Date().toISOString() }))
        ]);

        const totalRevenue = analyticsData.totalRevenue || 0;
        const companies = analyticsData.companiesCount || 0;
        const growthRate = companies > 0 ? `${Math.min(100, companies * 12)}%` : '0%';

        setStats({
          revenue: totalRevenue,
          companies: companies,
          activeManagers: analyticsData.activeManagersCount || 0,
          pendingManagers: analyticsData.pendingManagersCount || 0,
          growth: growthRate,
          pendingList: Array.isArray(pendingData) ? pendingData : []
        });
      } else {
        loadFallbackData();
      }
    } catch (err) {
      loadFallbackData();
    }
  };

  const loadFallbackData = () => {
    const defaultAccounts = [
      { firstName: 'Super', lastName: 'Admin', email: 'admin@syncsaas.com', role: 'admin', status: 'active', paid: false, created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
      { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', role: 'manager', status: 'active', paid: true, companyName: 'Alex Corp', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      { firstName: 'John', lastName: 'User', email: 'user@company.com', role: 'user', status: 'active', paid: false, companyName: 'John Doe Corp', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
    setRawAccounts(accounts);
    calculateMetrics(accounts, 'All Time');
  };

  const calculateMetrics = (accounts, filter) => {
    const now = new Date();
    let filtered = accounts;

    if (filter === 'Last 7 Days') {
      filtered = accounts.filter(acc => (now - new Date(acc.created_at || now)) <= 7 * 24 * 60 * 60 * 1000);
    } else if (filter === 'Last 30 Days') {
      filtered = accounts.filter(acc => (now - new Date(acc.created_at || now)) <= 30 * 24 * 60 * 60 * 1000);
    }

    const companiesCount = filtered.filter(acc => acc.role === 'user').length;
    const activeMgrs = filtered.filter(acc => acc.role === 'manager' && (acc.status === 'active' || acc.is_approved === true)).length;
    const pendingMgrs = filtered.filter(acc => acc.role === 'manager' && (acc.status === 'pending' || acc.is_approved === false)).length;
    
    const paidMgrs = filtered.filter(acc => acc.role === 'manager' && (acc.paid === true || acc.payment_completed === true)).length;
    const companyRevenue = filtered.filter(acc => acc.role === 'user').reduce((sum, acc) => sum + (Number(acc.monthlySpend || acc.monthly_spend) || 0), 0);
    const calculatedRevenue = (paidMgrs * 99) + companyRevenue;
    const growthRate = companiesCount > 0 ? `${Math.min(100, companiesCount * 12)}%` : '0%';
    const pendingList = filtered.filter(acc => acc.role === 'manager' && (acc.status === 'pending' || acc.is_approved === false));

    setStats({
      revenue: calculatedRevenue,
      companies: companiesCount,
      activeManagers: activeMgrs,
      pendingManagers: pendingMgrs,
      growth: growthRate,
      pendingList
    });
  };

  useEffect(() => {
    loadBackendData();
  }, []);

  const handleFilterChange = (filter) => {
    setDateFilter(filter);
    setShowFilterDropdown(false);
    calculateMetrics(rawAccounts, filter);
  };

  const handleExportReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'SyncSaaS Platform Executive Report\n';
    csvContent += `Generated On,${new Date().toLocaleString()}\n`;
    csvContent += `Reporting Range,${dateFilter}\n\n`;
    csvContent += 'Metric,Value\n';
    csvContent += `Total Platform Revenue,$${stats.revenue}\n`;
    csvContent += `Registered Client Companies,${stats.companies}\n`;
    csvContent += `Active Sales Managers,${stats.activeManagers}\n`;
    csvContent += `Pending Manager Applications,${stats.pendingManagers}\n`;
    csvContent += `Estimated Growth Rate,${stats.growth}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `syncsaas_report_${dateFilter.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApprove = async (id, email) => {
    const token = localStorage.getItem('syncsaas_token');

    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${id}/approve`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ id })
        });
        
        if (response.ok) {
          alert(`Manager approved successfully! Email sent to ${email}`);
          loadBackendData();
          return;
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.map(acc => {
      if (acc.email.toLowerCase() === email.toLowerCase()) {
        return { ...acc, status: 'active' };
      }
      return acc;
    });
    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert(`Manager ${email} approved locally.`);
    loadFallbackData();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Platform Overview</h1>
            <p className="text-slate-500">Welcome back. Here's what's happening across SyncSaaS today.</p>
          </div>
          <div className="flex items-center gap-4 relative">
            <div>
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4 text-[#f97316]" />
                Show: {dateFilter}
              </button>
              {showFilterDropdown && (
                <div className="absolute right-36 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button onClick={() => handleFilterChange('All Time')} className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 text-slate-700">All Time</button>
                  <button onClick={() => handleFilterChange('Last 30 Days')} className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 text-slate-700">Last 30 Days</button>
                  <button onClick={() => handleFilterChange('Last 7 Days')} className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 text-slate-700">Last 7 Days</button>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleExportReport}
              className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Total Revenue</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                 <BarChart3 className="text-green-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">${stats.revenue}</p>
            <p className="text-sm text-green-500 mt-2 font-medium">Includes manager & client fees</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Registered Companies</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                 <Building2 className="text-blue-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.companies}</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">Active client profiles</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Active Managers</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                 <Users className="text-purple-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.activeManagers}</p>
            <p className="text-sm text-orange-500 mt-2 font-medium">{stats.pendingManagers} pending approval</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Monthly Growth</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                 <TrendingUp className="text-[#f97316] w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.growth}</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">User acquisition speed</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
           <h3 className="font-extrabold text-slate-950 text-xl tracking-tight mb-6">Recent Applications</h3>
           <div className="space-y-4">
              {stats.pendingList.length > 0 ? (
                stats.pendingList.map((mgr, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{mgr.company_name || `${mgr.firstName || 'New'} Manager`}</p>
                      <p className="text-xs text-slate-500">{mgr.email}</p>
                    </div>
                    <button 
                      onClick={() => handleApprove(mgr.id, mgr.email)}
                      className="text-xs bg-[#f97316] hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-bold transition-colors shadow-sm"
                    >
                      Approve
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-400 font-semibold">No pending applications.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
