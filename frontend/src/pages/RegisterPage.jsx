import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState('Software Client (User)');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName) {
      alert('First name, email, and password are required.');
      return;
    }

    const roleMap = {
      'Software Client (User)': 'user',
      'Software Manager': 'manager',
      'Software Owner (Admin)': 'admin'
    };
    const role = roleMap[roleSelection];

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          companyName: `${firstName} ${lastName}`
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(data.message);

        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'manager') {
          navigate('/manager-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert('Unable to reach registration server. Defaulting to local demo fallback.');
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Create <span className="text-[#b45309]">Account</span></h1>
            <p className="text-slate-500">Join SHNOOR International LLC and accelerate your business.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
            <form className="space-y-5" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B132B]" 
                    placeholder="John" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B132B]" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B132B]" 
                  placeholder="you@company.com" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B132B]" 
                  placeholder="••••••••" 
                />
              </div>
 
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">I am signing up as a:</label>
                <select 
                  value={roleSelection}
                  onChange={(e) => setRoleSelection(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B132B] bg-white"
                >
                  <option>Software Client (User)</option>
                  <option>Software Manager</option>
                  <option>Software Owner (Admin)</option>
                </select>
              </div>
 
              <button type="submit" className="w-full bg-[#0B132B] hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md mt-2">
                Create Account
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account? <Link to="/login" className="text-[#0B132B] font-bold hover:underline">Sign In</Link>
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
