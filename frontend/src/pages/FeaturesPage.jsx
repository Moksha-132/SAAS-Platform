import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart3, Users, Zap, ShieldCheck, MessageSquare, Calendar } from 'lucide-react';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const FeatureDetailCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col">
    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 text-[#f97316]">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-500 leading-relaxed flex-grow">{desc}</p>
  </div>
);

const FeaturesPage = () => {
  const settings = useWebsiteSettings();

  const defaultFeatures = [
    { id: 'feat-1', title: "Advanced Analytics", desc: "Owners get real-time insights into total companies registered, monthly revenue growth, and platform engagement." },
    { id: 'feat-2', title: "Manager Workflows", desc: "Dedicated portals for managers with their own domains to host SaaS and interact directly with potential clients." },
    { id: 'feat-3', title: "Instant Subscriptions", desc: "Frictionless checkout experience allowing users to subscribe monthly or yearly with instant access." },
    { id: 'feat-4', title: "Real-time Chat", desc: "Built-in communication platform bridging the gap between users seeking software and managers providing it." },
    { id: 'feat-5', title: "In-Chat Scheduling", desc: "Seamlessly propose, negotiate, and lock in meeting times without ever leaving the chat interface." },
    { id: 'feat-6', title: "Secure Ecosystem", desc: "Robust OAuth and Firebase integration ensuring your data, chats, and payment information remain strictly confidential." }
  ];

  const features = settings?.features || defaultFeatures;
  const icons = [BarChart3, Users, Zap, MessageSquare, Calendar, ShieldCheck];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
          Everything you need to <span className="text-[#f97316]">scale.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-16">
          Whether you're selling software, managing clients, or looking for the next best tool for your business, SyncSaaS provides a comprehensive suite of features.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = icons[idx % icons.length] || Zap;
            return (
              <FeatureDetailCard 
                key={feat.id}
                icon={Icon}
                title={feat.title}
                desc={feat.desc}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
