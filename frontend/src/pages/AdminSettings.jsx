import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Save, RefreshCw, Palette, Layout, HelpCircle, Phone, Lock } from 'lucide-react';
import ThemeSettings from '../components/settings/ThemeSettings';
import HomeSettings from '../components/settings/HomeSettings';
import HowItWorksSettings from '../components/settings/HowItWorksSettings';
import ContactSettings from '../components/settings/ContactSettings';
import AuthSettings from '../components/settings/AuthSettings';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('theme');

  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#0F172A');
  const [accentColor, setAccentColor] = useState('#f97316');

  const [navBgColor, setNavBgColor] = useState('#FFFFFF');
  const [navTextColor, setNavTextColor] = useState('#64748B');
  const [brandName, setBrandName] = useState('SYNCSAAS');

  const [heroTitle, setHeroTitle] = useState('The Ultimate SaaS Hub for modern teams.');
  const [heroSubtitle, setHeroSubtitle] = useState('Connect with top-tier software providers, manage subscriptions, and scale your business with ease. Managers represent the best software, and you reap the benefits.');
  const [aboutTitle, setAboutTitle] = useState('About SyncSaaS.');
  const [aboutDescription1, setAboutDescription1] = useState('SyncSaaS was built with a single mission in mind: to democratize software distribution and sales. We noticed a disconnect between amazing developers building great SaaS applications, and independent software managers or agencies seeking powerful tools to represent and sell to local businesses.');
  const [aboutDescription2, setAboutDescription2] = useState('By creating a unified hub, we allow software creators to manage their catalog globally, empower independent managers to market and support these products under their custom white-label subdomains, and give clients the confidence to negotiate with humans rather than ticket bots. We believe the future of software sales is personal, connected, and highly local.');
  const [footerText, setFooterText] = useState('© 2026 SyncSaaS. All rights reserved.');
  const [footerDescription, setFooterDescription] = useState('Transform your SaaS distribution with a unified platform that connects software owners, dedicated resellers, and client businesses in one consistent experience.');

  const [howItWorksTitle, setHowItWorksTitle] = useState('How SyncSaaS Works.');
  const [howItWorksSubtitle, setHowItWorksSubtitle] = useState('A seamless ecosystem connecting software owners, dedicated managers, and businesses looking for the perfect tools.');
  const [step1Title, setStep1Title] = useState('Create Your Account');
  const [step1Desc, setStep1Desc] = useState('Sign up and select your role: Software Owner (Admin), Manager, or Client. We tailor the dashboard specifically to your needs.');
  const [step2Title, setStep2Title] = useState('List or Represent');
  const [step2Desc, setStep2Desc] = useState('Owners list their software on the platform. Managers can then apply to host those products on their own custom domains to start selling.');
  const [step3Title, setStep3Title] = useState('Connect & Negotiate');
  const [step3Desc, setStep3Desc] = useState('Clients browse the marketplace and chat directly with Managers. Schedule demos, ask questions, and negotiate terms all in one place.');
  const [step4Title, setStep4Title] = useState('Subscribe & Grow');
  const [step4Desc, setStep4Desc] = useState('Complete the secure payment process. Managers earn their commission, Owners see revenue growth, and Clients get instant access.');

  const [contactTitle, setContactTitle] = useState('Get in Touch');
  const [contactSubtitle, setContactSubtitle] = useState("Have questions about our platform? We're here to help.");
  const [contactEmail, setContactEmail] = useState('info@shnoor.com');
  const [contactPhone1, setContactPhone1] = useState('+91-9429694298');
  const [contactPhone2, setContactPhone2] = useState('+91-9041914601');
  const [contactAddress, setContactAddress] = useState('10009 Mount Tabor Road, City, Odessa Missouri, United States');

  const [loginTitle, setLoginTitle] = useState('Welcome Back');
  const [loginSubtitle, setLoginSubtitle] = useState('Log in to manage your software and subscriptions.');
  const [registerTitle, setRegisterTitle] = useState('Create your Account');
  const [registerSubtitle, setRegisterSubtitle] = useState('Join as a manager or registered client company.');

  useEffect(() => {
    const stored = localStorage.getItem('syncsaas_website_settings');
    if (stored) {
      const p = JSON.parse(stored);
      if (p.bgColor) setBgColor(p.bgColor);
      if (p.textColor) setTextColor(p.textColor);
      if (p.accentColor) setAccentColor(p.accentColor);

      if (p.navBgColor) setNavBgColor(p.navBgColor);
      if (p.navTextColor) setNavTextColor(p.navTextColor);
      if (p.brandName) setBrandName(p.brandName);
      
      if (p.heroTitle) setHeroTitle(p.heroTitle);
      if (p.heroSubtitle) setHeroSubtitle(p.heroSubtitle);
      if (p.aboutTitle) setAboutTitle(p.aboutTitle);
      if (p.aboutDescription1) setAboutDescription1(p.aboutDescription1);
      if (p.aboutDescription2) setAboutDescription2(p.aboutDescription2);
      if (p.footerText) setFooterText(p.footerText);
      if (p.footerDescription) setFooterDescription(p.footerDescription);

      if (p.howItWorksTitle) setHowItWorksTitle(p.howItWorksTitle);
      if (p.howItWorksSubtitle) setHowItWorksSubtitle(p.howItWorksSubtitle);
      if (p.step1Title) setStep1Title(p.step1Title);
      if (p.step1Desc) setStep1Desc(p.step1Desc);
      if (p.step2Title) setStep2Title(p.step2Title);
      if (p.step2Desc) setStep2Desc(p.step2Desc);
      if (p.step3Title) setStep3Title(p.step3Title);
      if (p.step3Desc) setStep3Desc(p.step3Desc);
      if (p.step4Title) setStep4Title(p.step4Title);
      if (p.step4Desc) setStep4Desc(p.step4Desc);

      if (p.contactTitle) setContactTitle(p.contactTitle);
      if (p.contactSubtitle) setContactSubtitle(p.contactSubtitle);
      if (p.contactEmail) setContactEmail(p.contactEmail);
      if (p.contactPhone1) setContactPhone1(p.contactPhone1);
      if (p.contactPhone2) setContactPhone2(p.contactPhone2);
      if (p.contactAddress) setContactAddress(p.contactAddress);

      if (p.loginTitle) setLoginTitle(p.loginTitle);
      if (p.loginSubtitle) setLoginSubtitle(p.loginSubtitle);
      if (p.registerTitle) setRegisterTitle(p.registerTitle);
      if (p.registerSubtitle) setRegisterSubtitle(p.registerSubtitle);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const settings = {
      bgColor,
      textColor,
      accentColor,
      navBgColor,
      navTextColor,
      brandName,
      heroTitle,
      heroSubtitle,
      aboutTitle,
      aboutDescription1,
      aboutDescription2,
      footerText,
      footerDescription,
      howItWorksTitle,
      howItWorksSubtitle,
      step1Title,
      step1Desc,
      step2Title,
      step2Desc,
      step3Title,
      step3Desc,
      step4Title,
      step4Desc,
      contactTitle,
      contactSubtitle,
      contactEmail,
      contactPhone1,
      contactPhone2,
      contactAddress,
      loginTitle,
      loginSubtitle,
      registerTitle,
      registerSubtitle
    };

    localStorage.setItem('syncsaas_website_settings', JSON.stringify(settings));
    alert('All settings saved and applied successfully across pages!');
  };

  const handleReset = () => {
    if (window.confirm('Reset all layout and page settings back to defaults?')) {
      localStorage.removeItem('syncsaas_website_settings');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Website Customization</h1>
            <p className="text-slate-500">Edit titles, headings, and color themes dynamically across features, contact, and auth screens.</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={handleReset}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Reset Defaults
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8 bg-white border border-slate-200 p-1.5 rounded-2xl max-w-max">
          <button 
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'theme' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Palette className="w-4 h-4" />
            Themes & Colors
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'home' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Layout className="w-4 h-4" />
            Homepage & About
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('howitworks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'howitworks' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <HelpCircle className="w-4 h-4" />
            How It Works
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'contact' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Phone className="w-4 h-4" />
            Contact Page
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('auth')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'auth' ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Lock className="w-4 h-4" />
            Auth Pages
          </button>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm max-w-4xl">
          {activeTab === 'theme' && (
            <ThemeSettings 
              bgColor={bgColor} setBgColor={setBgColor}
              textColor={textColor} setTextColor={setTextColor}
              accentColor={accentColor} setAccentColor={setAccentColor}
              navBgColor={navBgColor} setNavBgColor={setNavBgColor}
              navTextColor={navTextColor} setNavTextColor={setNavTextColor}
              brandName={brandName} setBrandName={setBrandName}
            />
          )}

          {activeTab === 'home' && (
            <HomeSettings 
              heroTitle={heroTitle} setHeroTitle={setHeroTitle}
              heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
              aboutTitle={aboutTitle} setAboutTitle={setAboutTitle}
              aboutDescription1={aboutDescription1} setAboutDescription1={setAboutDescription1}
              aboutDescription2={aboutDescription2} setAboutDescription2={setAboutDescription2}
              footerText={footerText} setFooterText={setFooterText}
              footerDescription={footerDescription} setFooterDescription={setFooterDescription}
            />
          )}

          {activeTab === 'howitworks' && (
            <HowItWorksSettings 
              howItWorksTitle={howItWorksTitle} setHowItWorksTitle={setHowItWorksTitle}
              howItWorksSubtitle={howItWorksSubtitle} setHowItWorksSubtitle={setHowItWorksSubtitle}
              step1Title={step1Title} setStep1Title={setStep1Title}
              step1Desc={step1Desc} setStep1Desc={setStep1Desc}
              step2Title={step2Title} setStep2Title={setStep2Title}
              step2Desc={step2Desc} setStep2Desc={setStep2Desc}
              step3Title={step3Title} setStep3Title={setStep3Title}
              step3Desc={step3Desc} setStep3Desc={setStep3Desc}
              step4Title={step4Title} setStep4Title={setStep4Title}
              step4Desc={step4Desc} setStep4Desc={setStep4Desc}
            />
          )}

          {activeTab === 'contact' && (
            <ContactSettings 
              contactTitle={contactTitle} setContactTitle={setContactTitle}
              contactSubtitle={contactSubtitle} setContactSubtitle={setContactSubtitle}
              contactEmail={contactEmail} setContactEmail={setContactEmail}
              contactPhone1={contactPhone1} setContactPhone1={setContactPhone1}
              contactPhone2={contactPhone2} setContactPhone2={setContactPhone2}
              contactAddress={contactAddress} setContactAddress={setContactAddress}
            />
          )}

          {activeTab === 'auth' && (
            <AuthSettings 
              loginTitle={loginTitle} setLoginTitle={setLoginTitle}
              loginSubtitle={loginSubtitle} setLoginSubtitle={setLoginSubtitle}
              registerTitle={registerTitle} setRegisterTitle={setRegisterTitle}
              registerSubtitle={registerSubtitle} setRegisterSubtitle={setRegisterSubtitle}
            />
          )}

          <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6 justify-end">
            <button 
              type="submit"
              className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
            >
              Save Customizations
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminSettings;
