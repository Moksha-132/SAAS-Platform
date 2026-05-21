import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ name, category, price, rating }) => (
  <div className="border border-slate-100 rounded-2xl p-6 bg-white hover:shadow-lg transition-shadow text-left flex flex-col h-full">
    <div className="w-full h-40 bg-slate-50 rounded-xl mb-6 flex items-center justify-center">
      <span className="text-slate-300 font-bold text-xl">{name}</span>
    </div>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-slate-900">{name}</h3>
      <div className="flex items-center gap-1 text-[#f97316]">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    </div>
    <p className="text-sm text-slate-500 mb-6 flex-grow">{category}</p>
    <div className="flex items-center justify-between mt-auto">
      <div>
        <span className="text-xl font-black text-slate-900">${price}</span>
        <span className="text-xs text-slate-400">/mo</span>
      </div>
      <button className="bg-[#0F172A] hover:bg-slate-800 text-white p-2 rounded-lg transition-colors">
        <ShoppingCart className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const MarketplacePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Software <span className="text-[#f97316]">Marketplace</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Discover the perfect tools to accelerate your business growth.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for software, CRM, marketing tools..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent transition-all"
            />
          </div>
          <select className="px-6 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F172A]">
            <option>All Categories</option>
            <option>Marketing</option>
            <option>Sales & CRM</option>
            <option>Development Tools</option>
            <option>Productivity</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard name="DataFlow Pro" category="Analytics & Reporting" price="49" rating="4.9" />
          <ProductCard name="CRM Sync" category="Sales & CRM" price="99" rating="4.8" />
          <ProductCard name="MailBlast" category="Email Marketing" price="29" rating="4.7" />
          <ProductCard name="DevStack Hub" category="Development Tools" price="149" rating="5.0" />
          <ProductCard name="HR Manage" category="Human Resources" price="79" rating="4.6" />
          <ProductCard name="SecureVault" category="Security" price="199" rating="4.9" />
          <ProductCard name="DesignAI" category="Creative Tools" price="39" rating="4.5" />
          <ProductCard name="TaskMaster" category="Productivity" price="19" rating="4.8" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
