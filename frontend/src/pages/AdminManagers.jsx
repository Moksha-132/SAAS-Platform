import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminManagers = () => {
  const [managers, setManagers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  
  const [managerName, setManagerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('manager123');
  
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editApproved, setEditApproved] = useState(false);
  const [editPaymentCompleted, setEditPaymentCompleted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadManagers = async () => {
    const token = localStorage.getItem('syncsaas_token');

    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/admin/managers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          setManagers(data);
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const defaultAccounts = [
      { firstName: 'Super', lastName: 'Admin', email: 'admin@syncsaas.com', password: 'admin123', role: 'admin', status: 'active', paid: false },
      { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', password: 'manager123', role: 'manager', status: 'active', paid: true, domain: 'alex.syncsaas.com' },
      { firstName: 'John', lastName: 'User', email: 'user@company.com', password: 'user123', role: 'user', status: 'active', paid: false }
    ];

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
    const mgrs = accounts.filter(acc => acc.role === 'manager');
    setManagers(mgrs.map(acc => ({
      id: acc.id || acc.email,
      company_name: acc.companyName || acc.company_name || `${acc.firstName} ${acc.lastName}`,
      email: acc.email,
      is_approved: acc.status === 'active' || acc.is_approved === true,
      payment_completed: acc.paid || acc.payment_completed === true,
      domain: acc.domain || `${acc.firstName.toLowerCase()}.syncsaas.com`
    })));
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const handleApprove = async (id, email) => {
    const token = localStorage.getItem('syncsaas_token');

    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${id}/approve`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ id })
        });
        
        if (response.ok) {
          alert(`Manager approved successfully! Email sent to ${email}`);
          loadManagers();
          return;
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.map(acc => {
      if (acc.email.toLowerCase() === email.toLowerCase()) {
        return { ...acc, status: 'active', is_approved: true };
      }
      return acc;
    });
    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert(`Manager ${email} approved locally.`);
    loadManagers();
  };

  const handleReject = async (id, email) => {
    const token = localStorage.getItem('syncsaas_token');
    const isUUID = id && typeof id === 'string' && id.includes('-');

    if (token && id && isUUID) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          alert(`Manager request rejected and account deleted.`);
          loadManagers();
          return;
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.filter(acc => acc.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert(`Manager request rejected and removed locally.`);
    loadManagers();
  };

  const handleRevoke = async (id, email) => {
    const token = localStorage.getItem('syncsaas_token');
    const isUUID = id && typeof id === 'string' && id.includes('-');

    if (token && id && isUUID) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ isApproved: false })
        });

        if (response.ok) {
          alert(`Access revoked for ${email}.`);
          loadManagers();
          return;
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.map(acc => {
      if (acc.email.toLowerCase() === email.toLowerCase()) {
        return { ...acc, status: 'pending', is_approved: false };
      }
      return acc;
    });
    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert(`Access revoked for ${email}.`);
    loadManagers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!managerName || !email || !password) {
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
          role: 'manager',
          companyName: managerName
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Manager registered successfully. Check pending list for approval.');
        setShowModal(false);
        setManagerName('');
        setEmail('');
        setPassword('manager123');
        setIsSubmitting(false);
        loadManagers();
        return;
      } else {
        alert(data.message || 'Failed to add manager');
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.warn(err.message);
    }

    const defaultAccounts = [
      { firstName: 'Super', lastName: 'Admin', email: 'admin@syncsaas.com', password: 'admin123', role: 'admin', status: 'active', paid: false },
      { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', password: 'manager123', role: 'manager', status: 'active', paid: true, domain: 'alex.syncsaas.com' },
      { firstName: 'John', lastName: 'User', email: 'user@company.com', password: 'user123', role: 'user', status: 'active', paid: false }
    ];

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;

    if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
      alert('A user with this email is already registered');
      setIsSubmitting(false);
      return;
    }

    accounts.push({
      firstName: managerName,
      lastName: '',
      email,
      password,
      role: 'manager',
      status: 'pending',
      paid: false,
      companyName: managerName,
      company_name: managerName,
      domain: `${managerName.toLowerCase().replace(/\s+/g, '')}.syncsaas.com`
    });

    localStorage.setItem('syncsaas_accounts', JSON.stringify(accounts));
    alert('Manager added successfully (offline mode)');
    setShowModal(false);
    setManagerName('');
    setEmail('');
    setPassword('manager123');
    setIsSubmitting(false);
    loadManagers();
  };

  const handleEditClick = (mgr) => {
    setSelectedManager(mgr);
    setEditName(mgr.company_name);
    setEditEmail(mgr.email);
    setEditApproved(mgr.is_approved);
    setEditPaymentCompleted(mgr.payment_completed);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName || !editEmail) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('syncsaas_token');
    const isUUID = selectedManager.id && typeof selectedManager.id === 'string' && selectedManager.id.includes('-');

    if (token && selectedManager.id && isUUID) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/managers/${selectedManager.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            companyName: editName,
            email: editEmail,
            isApproved: editApproved,
            paymentCompleted: editPaymentCompleted
          })
        });

        if (response.ok) {
          alert('Manager updated successfully');
          setShowEditModal(false);
          setIsSubmitting(false);
          loadManagers();
          return;
        }
      } catch (err) {
        console.warn(err.message);
      }
    }

    const accounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = accounts.map(acc => {
      const match = selectedManager.id ? (acc.id === selectedManager.id || acc.email.toLowerCase() === selectedManager.email.toLowerCase()) : (acc.email.toLowerCase() === selectedManager.email.toLowerCase());
      if (match) {
        return { 
          ...acc, 
          companyName: editName, 
          company_name: editName,
          firstName: editName,
          lastName: '',
          email: editEmail,
          status: editApproved ? 'active' : 'pending',
          is_approved: editApproved,
          paid: editPaymentCompleted
        };
      }
      return acc;
    });
    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    alert('Manager updated successfully (offline mode)');
    setShowEditModal(false);
    setIsSubmitting(false);
    loadManagers();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-grow md:ml-64 ml-0 p-4 md:p-8 lg:p-12 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Managers</h1>
            <p className="text-slate-500">Approve and monitor managers representing your software.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors"
          >
            + Add Manager
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Manager Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {managers.length > 0 ? (
                managers.map((mgr, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{mgr.company_name || 'Software Manager'}</td>
                    <td className="px-6 py-4 text-[#f97316] font-medium">{mgr.email}</td>
                    <td className="px-6 py-4">
                      {mgr.is_approved ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Approved</span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button 
                        onClick={() => handleEditClick(mgr)}
                        className="text-xs font-bold text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Edit
                      </button>
                      {!mgr.is_approved ? (
                        <>
                          <button 
                            onClick={() => handleApprove(mgr.id, mgr.email)}
                            className="text-xs font-bold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(mgr.id, mgr.email)}
                            className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleRevoke(mgr.id, mgr.email)}
                          className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No managers available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Add New Manager</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Manager Name</label>
                  <input 
                    type="text" 
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    placeholder="Jane Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    placeholder="jane@syncsaas.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    placeholder="manager123"
                  />
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
                    {isSubmitting ? 'Adding...' : 'Add Manager'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Edit Manager Details</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-semibold focus:outline-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Manager Name</label>
                  <input 
                    type="text" 
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Approval Status</label>
                  <select
                    value={editApproved ? 'true' : 'false'}
                    onChange={(e) => setEditApproved(e.target.value === 'true')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-white font-medium"
                  >
                    <option value="true">Approved</option>
                    <option value="false">Pending</option>
                  </select>
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

export default AdminManagers;

