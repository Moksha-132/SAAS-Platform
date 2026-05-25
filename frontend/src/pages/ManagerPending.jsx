import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ManagerPending = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const existingAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const matched = existingAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setAccount(matched);
    } else {
      const storedUser = localStorage.getItem('syncsaas_user');
      if (storedUser) {
        setAccount(JSON.parse(storedUser));
      } else {
        navigate('/login');
      }
    }
  }, [email, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) {
      alert('Please fill card details');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/manager/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert('Payment successful! Your account is now active.');
        const storedUser = localStorage.getItem('syncsaas_user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          userObj.isApproved = true;
          userObj.paymentCompleted = true;
          localStorage.setItem('syncsaas_user', JSON.stringify(userObj));
        }
        navigate('/manager-dashboard');
        return;
      }
    } catch (err) {
      console.warn('Backend activation failed, using local fallback:', err.message);
    }

    const existingAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || [];
    const updated = existingAccounts.map(acc => {
      if (acc.email.toLowerCase() === email.toLowerCase()) {
        return { ...acc, status: 'active', paid: true, is_approved: true };
      }
      return acc;
    });

    localStorage.setItem('syncsaas_accounts', JSON.stringify(updated));
    const storedUser = localStorage.getItem('syncsaas_user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      userObj.isApproved = true;
      userObj.paymentCompleted = true;
      localStorage.setItem('syncsaas_user', JSON.stringify(userObj));
    }

    alert('Payment successful! Your account is now active.');
    navigate('/manager-dashboard');
  };

  if (!account) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
          {!showCheckout ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-[#f97316]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Account Pending Approval</h1>
                <p className="text-slate-500 text-sm">
                  Hello <strong className="text-slate-900">{account.firstName || 'Manager'}</strong>, your manager account at <code className="text-sm bg-slate-100 px-1 rounded">{account.email}</code> requires activation.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Admin Approval Status:</span>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full text-xs">Pending</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Activation Fee Payout:</span>
                  <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full text-xs">Unpaid</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                  Pay $99 for Instant Activation
                </button>
                <div className="text-xs text-slate-400">
                  Or wait until the platform administrator reviews and approves your registration request.
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Return to Log In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Checkout activation</h3>
                <p className="text-sm text-slate-500">Pay $99.00 USD for instant manager role activation</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Card Number</label>
                <input 
                  type="text" 
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 •••• •••• 4242"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Expiration Date</label>
                  <input 
                    type="text" 
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">CVC</label>
                  <input 
                    type="text" 
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)}
                  className="w-1/2 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-[#f97316] hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                  Pay $99.00
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerPending;
