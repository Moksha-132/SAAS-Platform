import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Create <span className="text-[#f97316]">Account</span></h1>
            <p className="text-slate-500">Join SyncSaaS and accelerate your business.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" placeholder="you@company.com" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                <input type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A]" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">I am signing up as a:</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-white">
                  <option>Software Client (User)</option>
                  <option>Software Manager</option>
                  <option>Software Owner (Admin)</option>
                </select>
              </div>

              <button type="button" className="w-full bg-[#0F172A] hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md mt-2">
                Create Account
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account? <Link to="/login" className="text-[#0F172A] font-bold hover:underline">Sign In</Link>
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
