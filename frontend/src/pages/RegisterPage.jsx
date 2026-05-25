import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [paymentOption, setPaymentOption] = useState('approval');
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const stored = localStorage.getItem('syncsaas_website_settings');
  const settings = stored ? JSON.parse(stored) : null;

  const registerTitle = settings?.registerTitle || 'Create your Account';
  const registerSubtitle = settings?.registerSubtitle || 'Join as a manager or registered client company.';

  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const titleWords = registerTitle.split(' ');
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(' ');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      alert('Please fill in all details');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          companyName: `${firstName} ${lastName} Corp`
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        if (role === 'manager' && paymentOption === 'pay') {
          setShowCheckout(true);
        } else {
          alert(data.message || 'Registration successful!');
          navigate('/login');
        }
        return;
      } else {
        alert(data.message || 'Registration failed');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.warn('Backend API offline, falling back to LocalStorage simulation:', error.message);
    }

    const defaultAccounts = [
      { firstName: 'Super', lastName: 'Admin', email: 'admin@syncsaas.com', password: 'admin123', role: 'admin', status: 'active', paid: false },
      { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', password: 'manager123', role: 'manager', status: 'active', paid: true, domain: 'alex.syncsaas.com' },
      { firstName: 'John', lastName: 'User', email: 'user@company.com', password: 'user123', role: 'user', status: 'active', paid: false }
    ];

    const existingAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;

    if (existingAccounts.some(acc => acc.email === email)) {
      alert('This email address is already registered.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    if (role === 'manager' && paymentOption === 'pay') {
      setShowCheckout(true);
    } else {
      const newAccount = {
        firstName,
        lastName,
        email,
        password,
        role,
        status: role === 'user' ? 'active' : 'pending',
        paid: false,
        domain: role === 'manager' ? `${firstName.toLowerCase()}.syncsaas.com` : ''
      };
      
      existingAccounts.push(newAccount);
      localStorage.setItem('syncsaas_accounts', JSON.stringify(existingAccounts));

      if (role === 'user') {
        alert('Registration successful! (Offline mode)');
        navigate('/login');
      } else {
        alert('Registration submitted! Your manager account is pending approval. (Offline mode)');
        navigate('/login');
      }
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) {
      alert('Please fill all card details');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/manager/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Payment processed successfully. Your account is active now.');
        navigate('/login');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.warn('Backend payment route offline, activating via LocalStorage:', error.message);
    }

    const defaultAccounts = [
      { firstName: 'Super', lastName: 'Admin', email: 'admin@syncsaas.com', password: 'admin123', role: 'admin', status: 'active', paid: false },
      { firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', password: 'manager123', role: 'manager', status: 'active', paid: true, domain: 'alex.syncsaas.com' },
      { firstName: 'John', lastName: 'User', email: 'user@company.com', password: 'user123', role: 'user', status: 'active', paid: false }
    ];

    const existingAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;

    const newAccount = {
      firstName,
      lastName,
      email,
      password,
      role: 'manager',
      status: 'active',
      paid: true,
      domain: `${firstName.toLowerCase()}.syncsaas.com`
    };

    existingAccounts.push(newAccount);
    localStorage.setItem('syncsaas_accounts', JSON.stringify(existingAccounts));

    alert('Payment successful! (Offline activation complete). You can now log in.');
    navigate('/login');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3" style={{ color: textColor }}>
              {titleMain}{' '}
              <span style={{ color: accentColor }}>{lastWord}</span>
            </h1>
            <p className="opacity-80" style={{ color: textColor }}>{registerSubtitle}</p>
          </div>
          
          <div 
            className="p-8 rounded-3xl border shadow-xl"
            style={{ backgroundColor: bgColor, borderColor: `${textColor}15` }}
          >
            {!showCheckout ? (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                      style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                      style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                    style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                    placeholder="you@company.com" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                    style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                    placeholder="••••••••" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>I am signing up as a:</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  >
                    <option value="user">Software Client (User)</option>
                    <option value="manager">Software Manager</option>
                  </select>
                </div>

                {role === 'manager' && (
                  <div className="p-4 rounded-2xl space-y-3" style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}30` }}>
                    <label className="block text-sm font-bold" style={{ color: accentColor }}>Manager Activation Method:</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: textColor }}>
                        <input 
                          type="radio" 
                          name="paymentOption" 
                          value="approval"
                          checked={paymentOption === 'approval'}
                          onChange={() => setPaymentOption('approval')}
                          style={{ accentColor: accentColor }}
                        />
                        <span>Request manual admin approval (Free)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: textColor }}>
                        <input 
                          type="radio" 
                          name="paymentOption" 
                          value="pay"
                          checked={paymentOption === 'pay'}
                          onChange={() => setPaymentOption('pay')}
                          style={{ accentColor: accentColor }}
                        />
                        <span className="font-semibold">Complete payment of $99 (Instant login)</span>
                      </label>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md mt-2 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  {isLoading ? 'Processing...' : (role === 'manager' && paymentOption === 'pay' ? 'Proceed to Payment' : 'Create Account')}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold" style={{ color: textColor }}>Checkout activation</h3>
                  <p className="text-sm opacity-70" style={{ color: textColor }}>Pay $99.00 USD for instant manager role activation</p>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Card Number</label>
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                    style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Expiration Date</label>
                    <input 
                      type="text" 
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                      style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>CVC</label>
                    <input 
                      type="text" 
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                      style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCheckout(false)}
                    className="w-1/2 border text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
                    style={{ borderColor: `${textColor}20` }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-1/2 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                  >
                    {isLoading ? 'Paying...' : 'Pay $99.00'}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                Already have an account? <Link to="/login" className="font-bold hover:underline" style={{ color: accentColor }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
