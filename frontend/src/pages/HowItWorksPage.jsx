import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserPlus, Store, MessageSquare, Rocket } from 'lucide-react';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const StepCard = ({ number, icon: Icon, title, desc, bgColor, textColor, accentColor }) => (
  <div 
    className="relative p-8 border rounded-3xl shadow-sm hover:shadow-lg transition-all text-left overflow-hidden"
    style={{ backgroundColor: bgColor, borderColor: `${textColor}15` }}
  >
    <div className="flex justify-between items-start mb-6">
      <div 
        className="w-14 h-14 text-white rounded-2xl flex items-center justify-center transition-colors"
        style={{ backgroundColor: accentColor }}
      >
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-5xl font-black opacity-10" style={{ color: textColor }}>{number}</span>
    </div>
    <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }}>{title}</h3>
    <p className="leading-relaxed opacity-70" style={{ color: textColor }}>{desc}</p>
  </div>
);

const HowItWorksPage = () => {
  const settings = useWebsiteSettings();

  const title = settings?.howItWorksTitle || 'How SyncSaaS Works.';
  const subtitle = settings?.howItWorksSubtitle || 'A seamless ecosystem connecting software owners, dedicated managers, and businesses looking for the perfect tools.';
  
  const step1Title = settings?.step1Title || 'Create Your Account';
  const step1Desc = settings?.step1Desc || 'Sign up and select your role: Software Owner (Admin), Manager, or Client. We tailor the dashboard specifically to your needs.';
  const step2Title = settings?.step2Title || 'List or Represent';
  const step2Desc = settings?.step2Desc || 'Owners list their software on the platform. Managers can then apply to host those products on their own custom domains to start selling.';
  const step3Title = settings?.step3Title || 'Connect & Negotiate';
  const step3Desc = settings?.step3Desc || 'Clients browse the marketplace and chat directly with Managers. Schedule demos, ask questions, and negotiate terms all in one place.';
  const step4Title = settings?.step4Title || 'Subscribe & Grow';
  const step4Desc = settings?.step4Desc || 'Complete the secure payment process. Managers earn their commission, Owners see revenue growth, and Clients get instant access.';

  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const titleWords = title.split(' ');
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(' ');

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold mb-6" style={{ color: textColor }}>
            {titleMain}{' '}
            <span style={{ color: accentColor }}>{lastWord}</span>
          </h1>
          <p className="opacity-80 text-lg max-w-2xl mx-auto" style={{ color: textColor }}>
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            number="01"
            icon={UserPlus}
            title={step1Title}
            desc={step1Desc}
            bgColor={bgColor}
            textColor={textColor}
            accentColor={accentColor}
          />
          <StepCard 
            number="02"
            icon={Store}
            title={step2Title}
            desc={step2Desc}
            bgColor={bgColor}
            textColor={textColor}
            accentColor={accentColor}
          />
          <StepCard 
            number="03"
            icon={MessageSquare}
            title={step3Title}
            desc={step3Desc}
            bgColor={bgColor}
            textColor={textColor}
            accentColor={accentColor}
          />
          <StepCard 
            number="04"
            icon={Rocket}
            title={step4Title}
            desc={step4Desc}
            bgColor={bgColor}
            textColor={textColor}
            accentColor={accentColor}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
