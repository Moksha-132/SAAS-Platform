import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Get in <span className="text-[#f97316]">Touch</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Have questions about our platform? We're here to help.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Contact Information</h2>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                <Mail className="text-[#f97316] w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Email Us</h3>
                <a href="mailto:info@shnoor.com" className="text-slate-500 hover:text-[#f97316] transition-colors">info@shnoor.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                <Phone className="text-[#f97316] w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Call Us</h3>
                <p className="text-slate-500">+91-9429694298</p>
                <p className="text-slate-500">+91-9041914601</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-[#f97316] w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Visit Us</h3>
                <p className="text-slate-500 leading-relaxed">
                  10009 Mount Tabor Road, City,<br />Odessa Missouri,<br />United States
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-white" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] bg-white resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-[#0F172A] hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
