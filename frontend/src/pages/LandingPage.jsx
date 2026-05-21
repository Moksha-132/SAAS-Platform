import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Hero = () => (
  <div className="pt-24 pb-20 lg:pt-32 lg:pb-32 bg-white text-center">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          The Ultimate SaaS Hub for <span className="text-[#f97316]">modern teams.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed">
          Connect with top-tier software providers, manage subscriptions, and scale your business with ease. Managers represent the best software, and you reap the benefits.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-3.5 rounded-lg font-semibold text-lg transition-all shadow-md">
            Explore Marketplace
          </button>
        </div>
      </motion.div>
    </div>
  </div>
);

const FeatureCard = ({ title, desc }) => (
  <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Features = () => (
  <div className="py-24 bg-white text-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Powerful <span className="text-[#f97316]">Features.</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <FeatureCard 
          title="Admin Analytics" 
          desc="Complete oversight of your software's performance, total revenue, company growth, and global reach in one seamless dashboard."
        />
        <FeatureCard 
          title="Manager Portals" 
          desc="Represent top software, chat directly with clients, schedule meetings seamlessly, and earn commissions on closed deals."
        />
        <FeatureCard 
          title="Instant Discovery" 
          desc="Users can search, compare, and instantly subscribe to powerful tools with one-click checkouts and flexible billing plans."
        />
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
