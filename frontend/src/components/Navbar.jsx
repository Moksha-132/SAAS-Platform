import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="w-full bg-white py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center cursor-pointer">
          <Link to="/" className="text-2xl font-black text-slate-900 tracking-wider">
            SYNCSAAS
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">Features</Link>
          <Link to="/marketplace" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">Marketplace</Link>
          <Link to="/how-it-works" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">How It Works</Link>
          <Link to="/contact" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">Contact</Link>
          <Link to="/login" className="text-slate-500 font-medium hover:text-slate-900 transition-colors">Log In</Link>
          <Link to="/register" className="bg-[#0F172A] hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
