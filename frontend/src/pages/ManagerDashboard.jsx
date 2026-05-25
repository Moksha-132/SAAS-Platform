import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import { MessageSquare, Calendar, DollarSign, Package, Edit, Search, Building2 } from 'lucide-react';

const ManagerDashboard = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [dashboardStats, setDashboardStats] = useState({
    unreadQueries: 0,
    meetings: 0,
    earnings: 0,
    hostedSaas: 2
  });

  const loadDashboardData = async () => {
    const token = localStorage.getItem('syncsaas_token');

    if (token) {
      try {
        const statsRes = await fetch('http://localhost:5000/api/manager/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();

        const clientsRes = await fetch('http://localhost:5000/api/admin/companies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const clientsData = await clientsRes.json();

        if (statsRes.ok && clientsRes.ok) {
          setDashboardStats({
            unreadQueries: statsData.unreadQueries || 0,
            meetings: statsData.meetingsCount || 0,
            earnings: statsData.totalEarnings || 0,
            hostedSaas: 2
          });
          setClients(clientsData);
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const defaultAccounts = [
      { id: 101, firstName: 'John', lastName: 'User', email: 'user@company.com', role: 'user', companyName: 'Acme Corp', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 102, firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', role: 'user', companyName: 'Skynet Resell', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    const localAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
    const clientProfiles = localAccounts.filter(acc => acc.role === 'user');
    
    setClients(clientProfiles);
    setDashboardStats({
      unreadQueries: 1,
      meetings: 0,
      earnings: clientProfiles.length * 49,
      hostedSaas: 2
    });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const openEditModal = (client) => {
    setSelectedClient(client);
    setEditCompanyName(client.companyName || client.company_name || '');
    setEditEmail(client.email || '');
    setShowEditModal(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!editCompanyName || !editEmail) return;

    const token = localStorage.getItem('syncsaas_token');

    if (token && selectedClient.id) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${selectedClient.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            companyName: editCompanyName,
            email: editEmail
          })
        });

        if (response.ok) {
          alert('Client company updated successfully');
          setShowEditModal(false);
          loadDashboardData();
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.map(acc => {
      if (acc.id === selectedClient.id || acc.email.toLowerCase() === selectedClient.email.toLowerCase()) {
        return {
          ...acc,
          companyName: editCompanyName,
          company_name: editCompanyName,
          email: editEmail
        };
      }
      return acc;
    });

    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert('Client details updated (local storage)');
    setShowEditModal(false);
    loadDashboardData();
  };

  const filteredClients = clients.filter(c => {
    const matchName = (c.companyName || c.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmail = (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchName || matchEmail;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Manager Overview</h1>
            <p className="text-slate-500">Manage your clients, chats, and software portfolio.</p>
          </div>
          <button className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors">Apply for New Software</button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Unread Queries</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="text-blue-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{dashboardStats.unreadQueries}</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">Customer query inbox</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Upcoming Meetings</h3>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="text-purple-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{dashboardStats.meetings}</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">No meetings scheduled</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Commissions</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="text-green-600 w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">${dashboardStats.earnings}</p>
            <p className="text-sm text-green-600 mt-2 font-semibold">Total manager payout share</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-500">Hosted SaaS</h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Package className="text-[#f97316] w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{dashboardStats.hostedSaas}</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">Active hosted modules</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-950 text-xl tracking-tight">Client Companies</h3>
                <p className="text-slate-400 text-sm mt-1">Manage subscribed client company directory</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4">Company Name</th>
                    <th className="py-4">Email</th>
                    <th className="py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="font-bold text-slate-900">{client.companyName || client.company_name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-500 font-medium">{client.email}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => openEditModal(client)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-slate-400 text-sm font-medium">No client companies found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
            <h3 className="font-extrabold text-slate-950 text-xl tracking-tight mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">SyncCRM Subscription Activated</p>
                  <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Client chat query from Acme Corp</p>
                  <p className="text-xs text-slate-400 mt-0.5">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showEditModal && selectedClient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Edit Client Company Details</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Client Email</label>
                  <input 
                    type="email" 
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="w-1/2 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 bg-[#f97316] hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
