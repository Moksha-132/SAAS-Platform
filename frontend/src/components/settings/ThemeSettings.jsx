import React from 'react';
import { Palette } from 'lucide-react';

const ThemeSettings = ({
  bgColor, setBgColor,
  textColor, setTextColor,
  accentColor, setAccentColor,
  navBgColor, setNavBgColor,
  navTextColor, setNavTextColor,
  brandName, setBrandName
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
      <Palette className="text-[#f97316] w-5 h-5" />
      Color Theme Configuration
    </h3>
    
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Background Color</label>
        <div className="flex gap-2">
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer p-1" />
          <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-sm uppercase font-mono" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Base Text Color</label>
        <div className="flex gap-2">
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer p-1" />
          <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-sm uppercase font-mono" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Accent Highlight Color</label>
        <div className="flex gap-2">
          <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer p-1" />
          <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-sm uppercase font-mono" />
        </div>
      </div>
    </div>

    <h4 className="font-extrabold text-slate-900 text-base mt-8 border-t border-slate-100 pt-6 mb-4">Navbar & Branding Customization</h4>
    
    <div className="grid md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Brand / Logo Name</label>
        <input type="text" required value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Navbar Background Color</label>
        <div className="flex gap-2">
          <input type="color" value={navBgColor} onChange={(e) => setNavBgColor(e.target.value)} className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer p-1" />
          <input type="text" value={navBgColor} onChange={(e) => setNavBgColor(e.target.value)} className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-sm uppercase font-mono" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Navbar Text Color</label>
        <div className="flex gap-2">
          <input type="color" value={navTextColor} onChange={(e) => setNavTextColor(e.target.value)} className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer p-1" />
          <input type="text" value={navTextColor} onChange={(e) => setNavTextColor(e.target.value)} className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-sm uppercase font-mono" />
        </div>
      </div>
    </div>

    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 leading-relaxed mt-4">
      Applying a custom Background and Text color will update the styling properties dynamically of all public pages, including the Contact view, How It Works timeline, and authentication screens.
    </div>
  </div>
);

export default ThemeSettings;
