import React from 'react';
import { Layout } from 'lucide-react';

const HomeSettings = ({
  heroTitle, setHeroTitle,
  heroSubtitle, setHeroSubtitle,
  aboutTitle, setAboutTitle,
  aboutDescription1, setAboutDescription1,
  aboutDescription2, setAboutDescription2,
  footerText, setFooterText,
  footerDescription, setFooterDescription
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
      <Layout className="text-[#f97316] w-5 h-5" />
      Hero & About Headings
    </h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Hero Title</label>
        <input type="text" required value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Hero Subtitle</label>
        <textarea rows="3" required value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] leading-relaxed" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">About Section Title</label>
        <input type="text" required value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">About Description Paragraph 1</label>
        <textarea rows="3" required value={aboutDescription1} onChange={(e) => setAboutDescription1(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">About Description Paragraph 2</label>
        <textarea rows="3" required value={aboutDescription2} onChange={(e) => setAboutDescription2(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Footer Copyright Text</label>
          <input type="text" required value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Footer Description Text</label>
          <textarea rows="1" required value={footerDescription} onChange={(e) => setFooterDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
      </div>
    </div>
  </div>
);

export default HomeSettings;
