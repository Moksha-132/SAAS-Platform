import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const ContactPage = () => {
  const settings = useWebsiteSettings();

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
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="john@example.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Message</label>
                <textarea 
                  rows="4" 
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white resize-none" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="How can we help you?"
                />
              </div>
              <button 
                type="button" 
                className="w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Send Message
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
