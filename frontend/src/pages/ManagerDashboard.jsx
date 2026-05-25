import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../components/ManagerSidebar';
import NotificationBell from '../components/NotificationBell';
import { MessageSquare, Calendar, DollarSign, Package, ArrowRight, Video, Mail, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    analytics: { totalRevenue: 0, salesCount: 0 },
    upcomingMeetings: [],
    recentSales: []
  });
  const [softwareList, setSoftwareList] = useState([]);
  const [chatPartners, setChatPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [managerEmail, setManagerEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setManagerEmail(user.email);
    }

    const fetchAllManagerData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch dashboard aggregates, meetings and sales
        const dashboardRes = await fetch('http://localhost:5000/api/managers/dashboard', { headers });
        const dashboardJson = await dashboardRes.json();

        // 2. Fetch hosted software count
        const softwareRes = await fetch('http://localhost:5000/api/managers/software', { headers });
        const softwareJson = await softwareRes.json();

        // 3. Fetch active chat message partners to count unread queries
        const chatsRes = await fetch('http://localhost:5000/api/chats/partners', { headers });
        const chatsJson = await chatsRes.json();

        if (dashboardJson.success) {
          setDashboardData({
            analytics: dashboardJson.analytics || { totalRevenue: 0, salesCount: 0 },
            upcomingMeetings: dashboardJson.upcomingMeetings || [],
            recentSales: dashboardJson.recentSales || []
          });
        }

        if (softwareJson.success) {
          setSoftwareList(softwareJson.software || []);
        }

        if (chatsJson.success) {
          setChatPartners(chatsJson.partners || []);
        }
      } catch (err) {
        console.error('Error fetching manager dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllManagerData();
  }, [navigate]);

  // Compute stats dynamically from the backend database models
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
      <div className="flex-grow ml-64 p-8 lg:p-12 bg-slate-50 min-h-screen">
        {/* Main Content Wrapper Card */}
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
                to="/software" 
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
              {/* Card Grid with fully dynamic values */}
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
      
              {/* Main Visual Sections with completely dynamic lists */}
              <div className="grid lg:grid-cols-2 gap-8">
                
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
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
