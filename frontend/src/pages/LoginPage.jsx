import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.role === 'manager') {
          navigate('/manager-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        alert(data.message || 'Login failed. Please verify credentials.');
      }
    } catch (error) {
      console.error('Authentication Error:', error);
      alert('Unable to reach auth server. Defaulting to local demo fallback.');
      navigate('/user-dashboard');
    }
  };

  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@syncsaas.com');
      setPassword('admin123');
    } else if (role === 'manager') {
      setEmail('manager@syncsaas.com');
      setPassword('manager123');
    } else if (role === 'user') {
      setEmail('user@company.com');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Welcome <span className="text-[#b45309]">Back</span></h1>
            <p className="text-slate-500">Log in to manage your software and subscriptions.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 mb-6">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" 
                  placeholder="you@company.com" 
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-900">Password</label>
                  <a href="#" className="text-sm text-[#b45309] hover:underline font-medium">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" 
                  placeholder="••••••••" 
                />
              </div>
              <button type="submit" className="w-full bg-[#0B132B] hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md">
                Sign In
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account? <Link to="/register" className="text-[#0B132B] font-bold hover:underline">Register here</Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Demo Credentials</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => fillCredentials('admin')}
                className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-[#b45309] hover:text-[#b45309] transition-colors"
              >
                <strong>Admin:</strong> admin@syncsaas.com / admin123
              </button>
              <button 
                onClick={() => fillCredentials('manager')}
                className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-[#b45309] hover:text-[#b45309] transition-colors"
              >
                <strong>Manager:</strong> manager@syncsaas.com / manager123
              </button>
              <button 
                onClick={() => fillCredentials('user')}
                className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-[#b45309] hover:text-[#b45309] transition-colors"
              >
                <strong>User:</strong> user@company.com / user123
              </button>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
