import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(() => {
    const acceptedPrivacy = localStorage.getItem('syncsaas_accepted_privacy') === 'true';
    const acceptedTermsPage = localStorage.getItem('syncsaas_accepted_terms_page') === 'true';
    return acceptedPrivacy && acceptedTermsPage;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const settings = useWebsiteSettings();

  const loginTitle = settings?.loginTitle || 'Welcome Back';
  const loginSubtitle = settings?.loginSubtitle || 'Log in to manage your software and subscriptions.';

  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#b45309';

  const titleWords = loginTitle.split(' ');
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(' ');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    if (!acceptedTerms) {
      alert('You must accept the Privacy Policy and Terms & Conditions before logging in.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('syncsaas_token', data.token);
        localStorage.setItem('syncsaas_user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert(`Welcome back! Logged in as ${data.user.role}.`);
        
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.role === 'manager') {
          if (!data.user.isApproved && !data.user.paymentCompleted && !data.user.is_approved && !data.user.payment_completed) {
            navigate(`/manager-pending?email=${encodeURIComponent(data.user.email)}`);
          } else {
            navigate('/manager-dashboard');
          }
        } else {
          navigate('/user-dashboard');
        }
        setIsLoading(false);
        return;
      } else {
        alert(data.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }
    } catch (apiError) {
      console.warn('Backend API connection failed, falling back to LocalStorage simulation:', apiError.message);
    }

    const defaultAccounts = [
      { id: 'a2bcbaaa-8369-487b-b7db-ccc4fc610304', firstName: 'Super', lastName: 'Admin', email: 'admin@syncsaas.com', password: 'admin123', role: 'admin', status: 'active', paid: false },
      { id: 'f7a03c11-83ae-449d-aaed-8161dbf8daf0', firstName: 'Alex', lastName: 'Manager', email: 'manager@syncsaas.com', password: 'manager123', role: 'manager', status: 'active', paid: true, domain: 'alex.syncsaas.com' },
      { id: 'e2e657bf-98d5-44a2-a7c7-9827f8da17f6', firstName: 'John', lastName: 'User', email: 'user@company.com', password: 'user123', role: 'user', status: 'active', paid: false }
    ];

    const existingAccounts = JSON.parse(localStorage.getItem('syncsaas_accounts')) || defaultAccounts;
    const matchedAccount = existingAccounts.find(
      acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );

    setIsLoading(false);

    if (!matchedAccount) {
      alert('Invalid email or password (offline verification)');
      return;
    }

    const userData = {
      id: matchedAccount.id || matchedAccount.email,
      email: matchedAccount.email,
      role: matchedAccount.role,
      firstName: matchedAccount.firstName,
      isApproved: matchedAccount.status === 'active',
      paymentCompleted: matchedAccount.paid,
      is_approved: matchedAccount.status === 'active',
      payment_completed: matchedAccount.paid
    };

    localStorage.setItem('syncsaas_user', JSON.stringify(userData));
    localStorage.setItem('syncsaas_token', 'mock_token_12345');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'mock_token_12345');

    alert(`Offline simulated login as ${matchedAccount.role}.`);

    if (matchedAccount.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (matchedAccount.role === 'manager') {
      if (matchedAccount.status === 'pending') {
        navigate(`/manager-pending?email=${encodeURIComponent(matchedAccount.email)}`);
      } else {
        navigate('/manager-dashboard');
      }
    } else {
      navigate('/user-dashboard');
    }
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
            <p className="opacity-80" style={{ color: textColor }}>{loginSubtitle}</p>
          </div>
          
          <div 
            className="p-8 rounded-3xl border shadow-xl"
            style={{ backgroundColor: bgColor, borderColor: `${textColor}15` }}
          >
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="you@company.com" 
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold" style={{ color: textColor }}>Password</label>
                  <Link to="/forgot-password" className="text-sm hover:underline font-medium" style={{ color: accentColor }}>Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white" 
                  style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  placeholder="••••••••" 
                  required
                />
              </div>
              
              <div className="flex items-start gap-3 mt-4 select-none">
                <input 
                  type="checkbox" 
                  id="acceptTerms"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    localStorage.setItem('syncsaas_accepted_privacy', e.target.checked ? 'true' : 'false');
                    localStorage.setItem('syncsaas_accepted_terms_page', e.target.checked ? 'true' : 'false');
                  }}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                  style={{ accentColor }}
                />
                <label htmlFor="acceptTerms" className="text-sm font-semibold cursor-pointer opacity-85 leading-tight" style={{ color: textColor }}>
                  I accept the{' '}
                  <Link to="/privacy-policy" className="font-bold underline" style={{ color: accentColor }}>
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms-conditions" className="font-bold underline" style={{ color: accentColor }}>
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !acceptedTerms}
                className="w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:opacity-90 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                Don't have an account? <Link to="/register" className="font-bold hover:underline" style={{ color: accentColor }}>Register here</Link>
              </p>
            </div>
          </div>


        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
