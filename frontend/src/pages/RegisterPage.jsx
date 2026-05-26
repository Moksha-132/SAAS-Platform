import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  const navigate = useNavigate();

  // Pre-warm the Render backend on page load to avoid cold-start delays
  useEffect(() => {
    fetch('http://localhost:5000/api/auth/settings', { method: 'GET' }).catch(() => {});
  }, []);

  const settings = useWebsiteSettings();

  const registerTitle = settings?.registerTitle || 'Create your Account';
  const registerSubtitle = settings?.registerSubtitle || 'Join as a manager or registered client company.';

  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#b45309';

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
    setStatusMsg('Connecting to server...');

    // AbortController: 15 second timeout to avoid infinite hang on Render cold start
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    // Show a helpful message after 5 seconds if still waiting
    const slowMsgId = setTimeout(() => {
      setStatusMsg('Server is starting up, please wait...');
    }, 5000);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          companyName: `${firstName} ${lastName} Corp`
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearTimeout(slowMsgId);

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setStatusMsg('');
        if (data.token) {
          localStorage.setItem('syncsaas_token', data.token);
          localStorage.setItem('syncsaas_user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        alert(data.message || 'Registration successful!');
        navigate('/login');
        return;
      } else {
        clearTimeout(timeoutId);
        clearTimeout(slowMsgId);
        alert(data.message || 'Registration failed');
        setIsLoading(false);
        setStatusMsg('');
        return;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      clearTimeout(slowMsgId);
      if (error.name === 'AbortError') {
        setIsLoading(false);
        setStatusMsg('');
        alert('The server took too long to respond. This usually happens when the server is starting up. Please wait 30 seconds and try again.');
        return;
      }
      console.warn('Backend API offline, falling back to LocalStorage simulation:', error.message);
      setStatusMsg('');
    }

    // Fallback simulation
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
      alert('Registration submitted! Your manager account is pending admin approval. (Offline mode)');
      navigate('/login');
    }
  };



  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:font-bold">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
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
            <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900" 
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
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900" 
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
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900" 
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
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900" 
                    style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                    placeholder="••••••••" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>I am signing up as a:</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900"
                    style={{ borderColor: `${textColor}20`, focusRingColor: accentColor }}
                  >
                    <option value="user">Software Client (User)</option>
                    <option value="manager">Software Manager</option>
                  </select>
                </div>

                {role === 'manager' && (
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}30` }}>
                    <p className="text-sm font-bold" style={{ color: accentColor }}>Manager Account Activation</p>
                    <p className="text-xs mt-1.5 opacity-80" style={{ color: textColor }}>Your account will be reviewed and activated by an administrator. You will be notified once approved.</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md mt-2 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  {isLoading ? 'Processing...' : 'Create Account'}
                </button>
              </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm opacity-80" style={{ color: textColor }}>
                Already have an account? <Link to="/login" className="font-bold hover:underline" style={{ color: accentColor }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
