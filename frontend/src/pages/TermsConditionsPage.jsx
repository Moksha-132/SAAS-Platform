import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsConditionsPage = () => {
  const navigate = useNavigate();
  const settings = useWebsiteSettings();
  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const handleAccept = () => {
    localStorage.setItem('syncsaas_accepted_terms_page', 'true');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      <div className="flex-grow pt-28 pb-20 px-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3.5 rounded-2xl" style={{ backgroundColor: `${accentColor}15` }}>
            <FileText className="w-8 h-8" style={{ color: accentColor }} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
            <p className="opacity-75 mt-1 text-sm font-medium">Last updated: May 25, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">1. Account Terms</h2>
            <p>
              By accessing the Shnoor SAAS Platform and signing up, you agree to comply with and be bound by these Terms and Conditions. Registration as a software client or software manager constitutes acceptance of manual review and verification procedures.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">2. User Behavior & Responsibilities</h2>
            <p>
              Users are responsible for safeguarding password credentials and active browser local storage settings. Any misuse of live support chat, instant call functions, meetings scheduling, or file uploads will result in revocation of access by system administrators.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">3. Software Ownership and Licenses</h2>
            <p>
              The manager and client software deployed, linked, or purchased in the marketplace are the intellectual properties of their respective owners. Reselling, extracting source code, or unauthorized deployment of platforms is strictly prohibited.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">4. Limitation of Liability</h2>
            <p>
              Shnoor SAAS Platform and its affiliates shall not be liable for direct, indirect, incidental, or special damages arising from database offline simulation states or browser configuration choices.
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

export default TermsConditionsPage;
