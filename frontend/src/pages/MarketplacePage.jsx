import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, ShoppingCart, ExternalLink } from 'lucide-react';

const ProductCard = ({ software }) => (
  <div className="border border-slate-100 rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full shadow-sm">
    <div className="w-full h-40 bg-slate-50 rounded-xl mb-6 flex items-center justify-center border border-slate-100">
      <span className="text-slate-300 font-bold text-xl">{software.name}</span>
    </div>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-slate-900">{software.name}</h3>
    </div>
    <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-3">{software.description}</p>
    
    <div className="space-y-2 mb-6 border-t border-slate-50 pt-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500 font-medium">Monthly Plan:</span>
        <span className="font-bold text-slate-900">${software.monthly_price}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500 font-medium">Yearly Plan:</span>
        <span className="font-bold text-[#b45309]">${software.yearly_price}</span>
      </div>
    </div>

    <div className="flex items-center gap-2 mt-auto">
      <button className="flex-1 bg-[#0B132B] hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2">
        <ShoppingCart className="w-5 h-5" /> Buy Plan
      </button>
      {software.deployment_link && (
        <a 
          href={software.deployment_link.startsWith('http') ? software.deployment_link : `https://${software.deployment_link}`}
          target="_blank" rel="noreferrer"
          className="bg-white border-2 border-slate-200 hover:border-[#b45309] hover:text-[#b45309] text-slate-500 p-3 rounded-xl transition-colors"
          title="View Deployment"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      )}
    </div>
  </div>
);

const MarketplacePage = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const url = searchQuery 
          ? `http://localhost:5000/api/users/software?search=${encodeURIComponent(searchQuery)}`
          : 'http://localhost:5000/api/users/software';
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setSoftwareList(data.software);
        }
      } catch (err) {
        console.error("Failed to fetch software marketplace:", err);
      }
    };
    
    // Add small debounce for search query
    const timerId = setTimeout(() => {
      fetchSoftware();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#0B132B] mb-6">Software <span className="text-[#b45309]">Marketplace</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Discover the perfect tools to accelerate your business growth.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for software tools..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>

        {softwareList.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No software found</h3>
            <p className="text-slate-500">There are currently no products hosted in the marketplace matching your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwareList.map(software => (
              <ProductCard key={software.id} software={software} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MarketplacePage;
