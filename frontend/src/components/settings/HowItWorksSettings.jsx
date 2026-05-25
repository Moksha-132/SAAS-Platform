import React from 'react';
import { HelpCircle } from 'lucide-react';

const HowItWorksSettings = ({
  howItWorksTitle, setHowItWorksTitle,
  howItWorksSubtitle, setHowItWorksSubtitle,
  step1Title, setStep1Title,
  step1Desc, setStep1Desc,
  step2Title, setStep2Title,
  step2Desc, setStep2Desc,
  step3Title, setStep3Title,
  step3Desc, setStep3Desc,
  step4Title, setStep4Title,
  step4Desc, setStep4Desc
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
      <HelpCircle className="text-[#f97316] w-5 h-5" />
      How It Works Step Settings
    </h3>
    
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Page Main Title</label>
          <input type="text" required value={howItWorksTitle} onChange={(e) => setHowItWorksTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Page Description</label>
          <input type="text" required value={howItWorksSubtitle} onChange={(e) => setHowItWorksSubtitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="font-extrabold text-slate-900 text-sm">Step 01 Account Setup</p>
          <input type="text" required value={step1Title} onChange={(e) => setStep1Title(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
          <textarea rows="2" required value={step1Desc} onChange={(e) => setStep1Desc(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm leading-relaxed" />
        </div>
        <div className="space-y-3">
          <p className="font-extrabold text-slate-900 text-sm">Step 02 Distribution Setup</p>
          <input type="text" required value={step2Title} onChange={(e) => setStep2Title(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
          <textarea rows="2" required value={step2Desc} onChange={(e) => setStep2Desc(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm leading-relaxed" />
        </div>
        <div className="space-y-3">
          <p className="font-extrabold text-slate-900 text-sm">Step 03 Connection Settings</p>
          <input type="text" required value={step3Title} onChange={(e) => setStep3Title(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
          <textarea rows="2" required value={step3Desc} onChange={(e) => setStep3Desc(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm leading-relaxed" />
        </div>
        <div className="space-y-3">
          <p className="font-extrabold text-slate-900 text-sm">Step 04 Subscription Execution</p>
          <input type="text" required value={step4Title} onChange={(e) => setStep4Title(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
          <textarea rows="2" required value={step4Desc} onChange={(e) => setStep4Desc(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm leading-relaxed" />
        </div>
      </div>
    </div>
  </div>
);

export default HowItWorksSettings;
