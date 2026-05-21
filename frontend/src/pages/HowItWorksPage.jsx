import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserPlus, Store, MessageSquare, Rocket } from 'lucide-react';

const StepCard = ({ number, icon: Icon, title, desc }) => (
  <div className="relative p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all text-left group overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10 group-hover:bg-[#f97316]/10 transition-colors" />
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">{number}</span>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
            How SyncSaaS <span className="text-[#f97316]">Works.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            A seamless ecosystem connecting software owners, dedicated managers, and businesses looking for the perfect tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            number="01"
            icon={UserPlus}
            title="Create Your Account"
            desc="Sign up and select your role: Software Owner (Admin), Manager, or Client. We tailor the dashboard specifically to your needs."
          />
          <StepCard 
            number="02"
            icon={Store}
            title="List or Represent"
            desc="Owners list their software on the platform. Managers can then apply to host those products on their own custom domains to start selling."
          />
          <StepCard 
            number="03"
            icon={MessageSquare}
            title="Connect & Negotiate"
            desc="Clients browse the marketplace and chat directly with Managers. Schedule demos, ask questions, and negotiate terms all in one place."
          />
          <StepCard 
            number="04"
            icon={Rocket}
            title="Subscribe & Grow"
            desc="Complete the secure payment process. Managers earn their commission, Owners see revenue growth, and Clients get instant access."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
