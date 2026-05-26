import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import NotificationBell from '../components/NotificationBell';
import { MessageSquare, Calendar, DollarSign, Package, ArrowRight, Video, Mail, CheckCircle2, Edit, Search, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [managerEmail, setManagerEmail] = useState('');
  
  // Dashboard Aggregates & Lists
  const [dashboardData, setDashboardData] = useState({
    analytics: { totalRevenue: 0, salesCount: 0 },
    upcomingMeetings: [],
    recentSales: []
  });
  const [softwareList, setSoftwareList] = useState([]);
  const [chatPartners, setChatPartners] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const fetchAllManagerData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token') || localStorage.getItem('syncsaas_token');
    const userStr = localStorage.getItem('user') || localStorage.getItem('syncsaas_user');
    const user = userStr ? JSON.parse(userStr) : {};

    if (user.email) {
      setManagerEmail(user.email);
    }

    if (!token) {
      loadFallbackData();
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch dashboard aggregates
      const dashboardRes = await fetch('http://localhost:5000/api/managers/dashboard', { headers });
      const dashboardJson = await dashboardRes.json();

      // 2. Fetch hosted software
      const softwareRes = await fetch('http://localhost:5000/api/managers/software', { headers });
      const softwareJson = await softwareRes.json();

      // 3. Fetch chat partners
      const chatsRes = await fetch('http://localhost:5000/api/chats/partners', { headers });
      const chatsJson = await chatsRes.json();

      // 4. Fetch clients
      const clientsRes = await fetch('http://localhost:5000/api/admin/companies', { headers });
      const clientsData = await clientsRes.json();

      if (dashboardRes.ok && dashboardJson.success) {
        setDashboardData({
          analytics: dashboardJson.analytics || { totalRevenue: 0, salesCount: 0 },
          upcomingMeetings: dashboardJson.upcomingMeetings || [],
          recentSales: dashboardJson.recentSales || []
        });
      }

      if (softwareRes.ok && softwareJson.success) {
        setSoftwareList(softwareJson.software || []);
      }

      if (chatsRes.ok && chatsJson.success) {
        setChatPartners(chatsJson.partners || []);
      }

      if (clientsRes.ok) {
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } else {
        // Local storage clients fallback
        const localAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
        setClients(localAccounts.filter(acc => acc.role === 'user'));
      }
    } catch (err) {
      console.warn('Backend API connection failed, using LocalStorage simulation:', err.message);
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = () => {
    const defaultAccounts = [
      { id: 101, firstName: 'John', lastName: 'User', email: 'user@company.com', role: 'user', companyName: 'Acme Corp', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 102, firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', role: 'user', companyName: 'Skynet Resell', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    const localAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
    const clientProfiles = localAccounts.filter(acc => acc.role === 'user');
    
    setClients(clientProfiles);
    setDashboardData({
      analytics: { totalRevenue: clientProfiles.length * 49, salesCount: clientProfiles.length },
      upcomingMeetings: [],
      recentSales: []
    });
    setSoftwareList([
      { id: 1, name: 'SyncCRM', monthly_price: 29, yearly_price: 290 },
      { id: 2, name: 'SyncBilling', monthly_price: 49, yearly_price: 490 }
    ]);
    setChatPartners([
      { id: 101, email: 'user@company.com', company_name: 'Acme Corp', unread_count: 1 }
    ]);
  };

  useEffect(() => {
    fetchAllManagerData();
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

    const token = localStorage.getItem('token') || localStorage.getItem('syncsaas_token');

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
          fetchAllManagerData();
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
    fetchAllManagerData();
  };

  const filteredClients = clients.filter(c => {
    const matchName = (c.companyName || c.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmail = (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchName || matchEmail;
  });

  const totalHostedCount = softwareList.length;
  
  const totalUnreadQueries = chatPartners.reduce(
    (sum, partner) => sum + (parseInt(partner.unread_count, 10) || 0), 
    0
  );
  
  const upcomingMeetingsCount = dashboardData.upcomingMeetings.length;
  const commissionsRevenue = parseFloat(dashboardData.analytics.totalRevenue || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <ManagerSidebar />
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8 bg-slate-50 min-h-screen">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 lg:p-10 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 text-[#b45309] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Manager Portal
                </span>
                <span className="text-slate-400 text-xs font-semibold">{managerEmail}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Manager Overview</h1>
              <p className="text-slate-500 font-medium">Manage your assigned SaaS clients, track real-time revenue, and coordinate upcoming calendars.</p>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <NotificationBell />
              <Link 
                to="/manager-software" 
                className="bg-[#b45309] hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all shadow-amber-100 flex items-center gap-2 text-sm"
              >
                Host New SaaS Software <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b45309] mb-4"></div>
              <p className="text-slate-500 font-medium animate-pulse">Syncing manager portal aggregates...</p>
            </div>
          ) : (
            <>
              {/* Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Unread Queries</h3>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MessageSquare className="text-blue-600 w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{totalUnreadQueries}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Active messages unread</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Upcoming Meetings</h3>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Calendar className="text-purple-600 w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{upcomingMeetingsCount}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Scheduled client calls</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Total Sales</h3>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <DollarSign className="text-green-600 w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">${commissionsRevenue}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Generated SaaS revenue</p>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Hosted SaaS</h3>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Package className="text-[#b45309] w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{totalHostedCount}</p>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Active software products</p>
                </div>
              </div>
      
              {/* Main Visual Sections */}
              <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Active Chat Activity List */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col min-h-[350px] shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-900 text-lg">Active Chat Queues</h3>
                    <span className="text-xs font-semibold text-slate-400">Real-Time</span>
                  </div>
                  
                  {chatPartners.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-xl p-8 text-center">
                      <Mail className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400 font-semibold">All support message queues are synchronized.</p>
                    </div>
                  ) : (
                    <div className="flex-grow space-y-3 overflow-y-auto max-h-[250px] pr-1">
                      {chatPartners.map(partner => (
                        <div 
                          key={partner.id}
                          onClick={() => navigate('/manager-chat')}
                          className="bg-white hover:bg-slate-100/50 border border-slate-200/60 p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all shadow-sm"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{partner.email}</span>
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{partner.company_name || 'Client Account'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {parseInt(partner.unread_count, 10) > 0 && (
                              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full animate-bounce">
                                {partner.unread_count} New
                              </span>
                            )}
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Today's / Upcoming Meetings List */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col min-h-[350px] shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-900 text-lg">Upcoming Appointments</h3>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      Calendar Sync
                    </span>
                  </div>

                  {dashboardData.upcomingMeetings.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-xl p-8 text-center">
                      <CheckCircle2 className="w-10 h-10 text-green-400 mb-2" />
                      <p className="text-sm text-slate-400 font-semibold">No pending video conference appointments today.</p>
                    </div>
                  ) : (
                    <div className="flex-grow space-y-3 overflow-y-auto max-h-[250px] pr-1">
                      {dashboardData.upcomingMeetings.map(meeting => (
                        <div 
                          key={meeting.id}
                          className="bg-white border border-slate-200/60 p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm tracking-tight">{meeting.title}</span>
                            <span className="text-xs text-slate-400 font-semibold">
                              Client: {meeting.client_email} 
                              {meeting.software_name && ` | Product: ${meeting.software_name}`}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold mt-1">
                              Time: {new Date(meeting.scheduled_time).toLocaleString()}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => navigate('/manager-chat')}
                            className="bg-[#b45309] hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Video className="w-3.5 h-3.5" /> Join Room
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Client Companies Section */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Client Companies</h3>
                    <p className="text-slate-400 text-sm mt-0.5">Manage subscribed client company directory</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                        <th className="py-4 px-6">Company Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-slate-600" />
                                </div>
                                <span className="font-bold text-slate-900">{client.companyName || client.company_name || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-500 font-medium">{client.email}</td>
                            <td className="py-4 px-6 text-right">
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
            </>
          )}

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

              <form onSubmit={handleUpdateClient} className="p-6 space-y-4 text-slate-900">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Client Email</label>
                  <input 
                    type="email" 
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] bg-white"
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
                    className="w-1/2 bg-[#b45309] hover:bg-amber-800 text-white py-3 rounded-xl font-bold transition-colors shadow-md shadow-amber-100"
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

