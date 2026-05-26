import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Search, ShoppingCart, ExternalLink, FileText, Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ software, onViewDetails, onAddToCart }) => (
  <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full shadow-sm">
    <div className="w-full h-32 bg-white rounded-xl mb-4 flex items-center justify-center border border-slate-200">
      <span className="text-slate-300 font-bold text-lg">{software.name}</span>
    </div>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-slate-900">{software.name}</h3>
    </div>
    <p className="text-sm text-slate-500 mb-4 flex-grow line-clamp-2">{software.description}</p>
    
    <div className="space-y-2 mb-4 border-t border-slate-200/60 pt-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500 font-medium">Monthly Plan:</span>
        <span className="font-bold text-slate-900">${software.monthly_price}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500 font-medium">Yearly Plan:</span>
        <span className="font-bold text-[#b45309]">${software.yearly_price}</span>
      </div>
    </div>

    <div className="flex flex-col gap-2 mt-auto">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onAddToCart(software)}
          className="flex-1 bg-[#0B132B] hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
        {software.deployment_link && (
          <a 
            href={software.deployment_link.startsWith('http') ? software.deployment_link : `https://${software.deployment_link}`}
            target="_blank" rel="noreferrer"
            className="bg-white border border-slate-200 hover:border-[#b45309] hover:text-[#b45309] text-slate-500 p-2.5 rounded-xl transition-colors shadow-sm"
            title="View Deployment"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      <button 
        onClick={() => onViewDetails(software)}
        className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
      >
        <Info className="w-4 h-4" /> View Details
      </button>
    </div>
  </div>
);

const UserMarketplace = () => {
  const navigate = useNavigate();
  const [softwareList, setSoftwareList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState(null);

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
    
    const timerId = setTimeout(() => {
      fetchSoftware();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const handleAddToCart = (software) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find(item => item.id === software.id);
    if (!exists) {
      cart.push({
        id: software.id,
        name: software.name,
        description: software.description,
        monthly_price: software.monthly_price,
        yearly_price: software.yearly_price,
        planType: 'monthly'
      });
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    navigate('/user-cart');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <UserSidebar />
      
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8 bg-slate-50 min-h-screen relative">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-8 lg:p-10 max-w-7xl mx-auto min-h-[80vh]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Software Marketplace</h1>
              <p className="text-slate-500 font-medium">Discover and subscribe to premium SaaS tools.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-transparent transition-all bg-slate-50"
              />
            </div>
          </div>
          
          {softwareList.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-700 mb-2">No software found</h3>
              <p className="text-slate-500">There are currently no products hosted in the marketplace matching your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {softwareList.map(software => (
                <ProductCard 
                  key={software.id} 
                  software={software} 
                  onViewDetails={setSelectedSoftware}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedSoftware && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedSoftware(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-3xl font-black text-slate-900 mb-2 pr-12">{selectedSoftware.name}</h2>
            
            <div className="flex gap-4 mb-6 border-b border-slate-100 pb-6">
              <div className="bg-amber-50 text-[#b45309] px-4 py-2 rounded-lg font-bold text-sm">
                Monthly: ${selectedSoftware.monthly_price}
              </div>
              <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm">
                Yearly: ${selectedSoftware.yearly_price}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#b45309]" /> Project Description
              </h3>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {selectedSoftware.description}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {selectedSoftware.document_url ? (
                <a 
                  href={selectedSoftware.document_url.startsWith('http') ? selectedSoftware.document_url : `https://${selectedSoftware.document_url}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-sm border border-slate-200"
                >
                  <FileText className="w-5 h-5" /> View Project Document
                </a>
              ) : (
                <button 
                  disabled
                  className="flex-1 bg-slate-50 text-slate-400 py-3.5 rounded-xl font-bold border border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <FileText className="w-5 h-5" /> No Document Provided
                </button>
              )}
              
              <button 
                onClick={() => handleAddToCart(selectedSoftware)}
                className="flex-1 bg-[#0B132B] hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMarketplace;

