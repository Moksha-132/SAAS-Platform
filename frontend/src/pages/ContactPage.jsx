import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const ContactPage = () => {
  const settings = useWebsiteSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState('success'); // 'success' | 'error'

  const contactTitle = settings?.contactTitle || 'Get in Touch';
  const contactSubtitle = settings?.contactSubtitle || "Have questions about our platform? We're here to help.";
  const contactEmail = settings?.contactEmail || 'info@shnoor.com';
  const contactPhone1 = settings?.contactPhone1 || '+91-9429694298';
  const contactPhone2 = settings?.contactPhone2 || '+91-9041914601';
  const contactAddress = settings?.contactAddress || '10009 Mount Tabor Road, City, Odessa Missouri, United States';

  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const titleWords = contactTitle.split(' ');
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(' ');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) {
      setStatusType('error');
      setStatusMessage('Please enter your email and message.');
      return;
    }
    setLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await response.json();
      if (data.success) {
        setStatusType('success');
        setStatusMessage(data.message);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatusType('error');
        setStatusMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatusType('error');
      setStatusMessage('Unable to reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6" style={{ color: textColor }}>
            {titleMain}{' '}
            <span style={{ color: accentColor }}>{lastWord}</span>
          </h1>
          <p className="opacity-80 text-lg max-w-2xl mx-auto" style={{ color: textColor }}>
            {contactSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: textColor }}>Contact Information</h2>
            
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Mail className="w-6 h-6" style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1" style={{ color: textColor }}>Email Us</h3>
                <a href={`mailto:${contactEmail}`} className="opacity-70 hover:underline" style={{ color: textColor }}>{contactEmail}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Phone className="w-6 h-6" style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1" style={{ color: textColor }}>Call Us</h3>
                <p className="opacity-70" style={{ color: textColor }}>{contactPhone1}</p>
                {contactPhone2 && <p className="opacity-70" style={{ color: textColor }}>{contactPhone2}</p>}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <MapPin className="w-6 h-6" style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1" style={{ color: textColor }}>Visit Us</h3>
                <p className="opacity-70 leading-relaxed whitespace-pre-line" style={{ color: textColor }}>
                  {contactAddress}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="p-8 rounded-3xl border"
            style={{ backgroundColor: `${textColor}05`, borderColor: `${textColor}15` }}
          >
            {statusMessage && (
              <div 
                className={`mb-6 p-4 rounded-xl text-sm font-bold border transition-all ${
                  statusType === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {statusMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="john@example.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Subject (Optional)</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="e.g. Partnership Request" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Message</label>
                <textarea 
                  rows="4" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white resize-none" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="How can we help you?"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: accentColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
