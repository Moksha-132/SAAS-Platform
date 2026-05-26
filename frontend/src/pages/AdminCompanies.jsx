import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Edit2, Building2, Search } from 'lucide-react';

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('company123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editCompanyName, setEditCompanyName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editApproved, setEditApproved] = useState(true);
  const [editMonthlySpend, setEditMonthlySpend] = useState(49);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCompanies = async () => {
    const token = localStorage.getItem('syncsaas_token');

    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/companies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          setCompanies(data);
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const defaultAccounts = [
      { id: 101, firstName: 'John', lastName: 'User', email: 'user@company.com', password: 'user123', role: 'user', status: 'active', paid: false, companyName: 'Acme Corp', monthlySpend: 49 },
      { id: 102, firstName: 'Sarah', lastName: 'Connor', email: 'sarah@skynet.com', password: 'user123', role: 'user', status: 'active', paid: false, companyName: 'Skynet Resell', monthlySpend: 99 }
    ];

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
    const clientUsers = accounts.filter(acc => acc.role === 'user');
    setCompanies(clientUsers.map(acc => ({
      id: acc.id || acc.email,
      company_name: acc.companyName || acc.company_name || `${acc.firstName} ${acc.lastName} Corp`,
      email: acc.email,
      is_approved: acc.is_approved !== undefined ? acc.is_approved : (acc.status === 'active' || acc.status === undefined),
      monthly_spend: acc.monthlySpend || acc.monthly_spend || 49,
      created_at: acc.created_at || new Date().toISOString()
    })));
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: 'user',
          companyName
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Company added successfully');
        setShowAddModal(false);
        setCompanyName('');
        setEmail('');
        setPassword('company123');
        setIsSubmitting(false);
        loadCompanies();
        return;
      } else {
        alert(data.message || 'Failed to add company');
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn(err.message);
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];

    if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
      alert('A company or user with this email is already registered');
      setIsSubmitting(false);
      return;
    }

    accounts.push({
      id: Date.now(),
      firstName: companyName,
      lastName: 'Corp',
      email,
      password,
      role: 'user',
      status: 'active',
      is_approved: true,
      paid: false,
      companyName,
      monthlySpend: 49
    });

    localStorage.setItem('syncsaas_accounts', JSON.stringify(accounts));
    alert('Company added successfully (offline mode)');
    setShowAddModal(false);
    setCompanyName('');
    setEmail('');
    setPassword('company123');
    setIsSubmitting(false);
    loadCompanies();
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setEditCompanyName(company.company_name || company.companyName || '');
    setEditEmail(company.email || '');
    setEditApproved(company.is_approved !== false);
    setEditMonthlySpend(company.monthly_spend || 49);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCompanyName || !editEmail) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('syncsaas_token');
    const isUUID = selectedCompany.id && typeof selectedCompany.id === 'string' && selectedCompany.id.includes('-');

    if (token && selectedCompany.id && isUUID) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${selectedCompany.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            companyName: editCompanyName,
            email: editEmail,
            isApproved: editApproved,
            monthlySpend: Number(editMonthlySpend)
          })
        });

        if (response.ok) {
          alert('Company updated successfully');
          setShowEditModal(false);
          setIsSubmitting(false);
          loadCompanies();
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.map(acc => {
      const match = selectedCompany.id ? (acc.id === selectedCompany.id || acc.email.toLowerCase() === selectedCompany.email.toLowerCase()) : (acc.email.toLowerCase() === selectedCompany.email.toLowerCase());
      if (match) {
        return {
          ...acc,
          companyName: editCompanyName,
          company_name: editCompanyName,
          firstName: editCompanyName,
          email: editEmail,
          status: editApproved ? 'active' : 'inactive',
          is_approved: editApproved,
          monthlySpend: Number(editMonthlySpend),
          monthly_spend: Number(editMonthlySpend)
        };
      }
      return acc;
    });

    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert('Company details updated (offline mode)');
    setShowEditModal(false);
    setIsSubmitting(false);
    loadCompanies();
  };

  const filteredCompanies = companies.filter(c => {
    const matchName = (c.company_name || c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchEmail = (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchName || matchEmail;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Registered Companies</h1>
            <p className="text-slate-500">View and manage all companies using your software.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] text-sm bg-white"
              />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors"
            >
              + Add Company
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Email Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Monthly Spend</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-600" />
                      </div>
                      <span>{company.company_name || 'Generic Company'}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{company.email}</td>
                    <td className="px-6 py-4">
                      {company.is_approved ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">${company.monthly_spend || 49}/mo</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleEditClick(company)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Add New Company</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="contact@acme.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    placeholder="company123"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-1/2 bg-[#f97316] hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && selectedCompany && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Edit Company Details</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Company Status</label>
                  <select
                    value={editApproved ? 'true' : 'false'}
                    onChange={(e) => setEditApproved(e.target.value === 'true')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] bg-white font-medium"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Monthly Spend ($)</label>
                  <input 
                    type="number" 
                    required
                    value={editMonthlySpend}
                    onChange={(e) => setEditMonthlySpend(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                    min="0"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="w-1/2 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-1/2 bg-[#f97316] hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-bold transition-colors shadow-md"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default AdminCompanies;

