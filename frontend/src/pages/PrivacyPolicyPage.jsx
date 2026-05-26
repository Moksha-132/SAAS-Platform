import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const settings = useWebsiteSettings();
  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';
  const handleAccept = () => {
    localStorage.setItem('syncsaas_accepted_privacy', 'true');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      <div className="flex-grow pt-28 pb-20 px-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3.5 rounded-2xl" style={{ backgroundColor: `${accentColor}15` }}>
            <ShieldCheck className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="opacity-75 mt-1 text-sm font-medium">Last updated: May 25, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">1. Information We Collect</h2>
            <p>
              We collect personal identification information (Name, email address, phone number, company profile, etc.) that you directly provide when registering an account, subscribing to products, or interacting with managers and users on the Shnoor SAAS Platform.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">2. How We Use Your Information</h2>
            <p>
              We use your data to manage your account registration, facilitate secure access to software subscriptions, authenticate chat messages and live meetings, and keep you informed of crucial platform updates and theme selections.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">3. Data Security and Retention</h2>
            <p>
              Your personal information is secure and stored in highly encrypted databases. We do not sell or lease your identity or information to third-party companies. Data is preserved as long as your account remains active or pending review.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">4. Contact Support</h2>
            <p>
              For queries or to request deletion of account data, contact our security administration department via the Shnoor global help center or through the platform manager support channels.
            </p>
          </section>
        </div>

        <div className="pt-10 text-center flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-extrabold shadow-lg hover:shadow-xl transition-all text-base cursor-pointer transform hover:-translate-y-0.5"
            style={{ backgroundColor: accentColor }}
          >
            I Accept & Return to Login
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
