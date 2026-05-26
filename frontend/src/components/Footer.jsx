import React from 'react';
import { Globe, Cpu, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const Footer = () => {
  const settings = useWebsiteSettings();
  const footerCopyright = settings?.footerText || '© 2026 SHNOOR International LLC. All rights reserved.';
  const footerDesc = settings?.footerDescription || 'Transform your software acquisition experience with a SaaS directory connecting providers, clients, and dedicated project managers in one premium platform.';
  const accentColor = settings?.accentColor || '#b45309';

  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1 */}
          <div className="md:col-span-2 pr-8">
            <div className="flex flex-col select-none mb-6">
              <span className="text-xl font-black tracking-wider text-white leading-none">SHNOOR</span>
              <span className="text-[9px] font-black text-[#b45309] tracking-widest uppercase mt-0.5">International LLC</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              {footerDesc}
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                <Globe className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors cursor-pointer">
                <Shield className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-400 hover:text-orange-500 transition-colors text-sm" style={{ hover: { color: accentColor } }}>Home</Link></li>
              <li><Link to="/features" className="text-slate-400 hover:text-orange-500 transition-colors text-sm">Features</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-orange-500 transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Contact & Support</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                <a href="mailto:info@shnoor.com" className="text-slate-400 hover:text-white transition-colors text-sm">info@shnoor.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                <div className="text-slate-400 text-sm flex flex-col gap-2">
                  <span>+91-9429694298</span>
                  <span>+91-9041914601</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                <span className="text-slate-400 text-sm leading-relaxed">
                  10009 Mount Tabor Road, City, Odessa<br/>Missouri, United States
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            {footerCopyright}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-slate-500 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms-conditions" className="text-slate-500 hover:text-white transition-colors text-sm">Terms & Conditions</Link>
            <a href="/Shnoor_Company_Profile (1).pdf" download="Shnoor_Company_Profile.pdf" className="text-slate-500 hover:text-white transition-colors text-sm">Company Profile</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
