import React, { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const UserContact = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState('success'); // 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      setStatusType('error');
      setStatusMessage('Please enter your message details.');
      return;
    }
    setLoading(true);
    setStatusMessage(null);

    const submissionData = {
      name: user.company_name || 'Client User',
      email: user.email || 'client@company.com',
      subject: subject,
      message: message
    };

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      const data = await response.json();
      if (data.success) {
        setStatusType('success');
        setStatusMessage(data.message);
        setSubject('');
        setMessage('');
      } else {
        setStatusType('error');
        setStatusMessage(data.message || 'Failed to submit contact request.');
      }
    } catch (err) {
      setStatusType('error');
      setStatusMessage('Connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <UserSidebar />
      
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8 bg-slate-50 min-h-screen">
        {/* Main Content Wrapper Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 lg:p-10 max-w-7xl mx-auto min-h-[80vh]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Contact Support</h1>
              <p className="text-slate-500 font-medium">Get in touch with our team for assistance with your subscriptions.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Direct Channels</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Email Us</p>
                      <p className="text-lg font-bold text-slate-900">support@shnoor.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Call Us</p>
                      <p className="text-lg font-bold text-slate-900"> 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-[#b45309]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Headquarters</p>
                      <p className="text-lg font-bold text-slate-900">10009 Mount Tabor Road, Odessa Missouri, United States.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Send a Message</h3>
                
                {statusMessage && (
                  <div 
                    className={`p-4 rounded-xl text-sm font-bold border transition-all ${
                      statusType === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]" 
                    placeholder="e.g. Billing Issue" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">Message</label>
                  <textarea 
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] resize-none" 
                    placeholder="Describe how we can help you..." 
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#b45309] hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContact;

