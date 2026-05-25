import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminSoftware = () => {
  const [softwareList, setSoftwareList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [yearlyPrice, setYearlyPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSoftware = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/software');
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setSoftwareList(data);
        return;
      }
    } catch (err) {
      console.warn(err.message);
    }

    const defaultSoftware = [
      { id: 1, name: 'SyncCRM', description: 'Advanced customer relationship manager with AI forecasting', monthly_price: 49.00, yearly_price: 490.00 },
      { id: 2, name: 'SyncBilling', description: 'Automated recurring billing and subscription invoicing tools', monthly_price: 89.00, yearly_price: 890.00 }
    ];
    const local = JSON.parse(localStorage.getItem('syncsaas_software')) || defaultSoftware;
    setSoftwareList(local);
  };

  useEffect(() => {
    loadSoftware();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !monthlyPrice || !yearlyPrice) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('syncsaas_token');

    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/software', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            description,
            monthlyPrice: parseFloat(monthlyPrice),
            yearlyPrice: parseFloat(yearlyPrice)
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Software added to catalog successfully');
          setShowModal(false);
          setName('');
          setDescription('');
          setMonthlyPrice('');
          setYearlyPrice('');
          setIsSubmitting(false);
          loadSoftware();
          return;
        } else {
          alert(data.error || 'Failed to add software');
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const defaultSoftware = [
      { id: 1, name: 'SyncCRM', description: 'Advanced customer relationship manager with AI forecasting', monthly_price: 49.00, yearly_price: 490.00 },
      { id: 2, name: 'SyncBilling', description: 'Automated recurring billing and subscription invoicing tools', monthly_price: 89.00, yearly_price: 890.00 }
    ];
    const local = JSON.parse(localStorage.getItem('syncsaas_software')) || defaultSoftware;
    
    const newProduct = {
      id: Date.now(),
      name,
      description,
      monthly_price: parseFloat(monthlyPrice),
      yearly_price: parseFloat(yearlyPrice)
    };

    local.push(newProduct);
    localStorage.setItem('syncsaas_software', JSON.stringify(local));

    alert('Software added successfully (offline mode)');
    setShowModal(false);
    setName('');
    setDescription('');
    setMonthlyPrice('');
    setYearlyPrice('');
    setIsSubmitting(false);
    loadSoftware();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-8 lg:p-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Software Catalog</h1>
            <p className="text-slate-500">Manage the software products you own on the platform.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors"
          >
            Add New Software
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {softwareList.length > 0 ? (
            softwareList.map((sw, index) => (
              <div key={index} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg mb-2">{sw.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 min-h-[40px]">{sw.description || 'No description provided.'}</p>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pricing</p>
                    <p className="text-lg font-black text-slate-900">
                      ${parseFloat(sw.monthly_price).toFixed(2)}<span className="text-xs text-slate-400 font-medium">/mo</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Yearly Plan</p>
                    <p className="text-slate-700 font-bold">
                      ${parseFloat(sw.yearly_price).toFixed(2)}<span className="text-xs text-slate-400 font-medium">/yr</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
              No software products added yet. Click "Add New Software" to begin.
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Add New Software Product</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    placeholder="SyncCRM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    placeholder="Advanced customer relationship manager..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Monthly Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={monthlyPrice}
                      onChange={(e) => setMonthlyPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                      placeholder="49.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Yearly Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={yearlyPrice}
                      onChange={(e) => setYearlyPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                      placeholder="490.00"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="w-1/2 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-1/2 bg-[#f97316] hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Software'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSoftware;