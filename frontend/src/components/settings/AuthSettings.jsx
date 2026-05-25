import React from 'react';
import { Lock } from 'lucide-react';

const AuthSettings = ({
  loginTitle, setLoginTitle,
  loginSubtitle, setLoginSubtitle,
  registerTitle, setRegisterTitle,
  registerSubtitle, setRegisterSubtitle
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
      <Lock className="text-[#f97316] w-5 h-5" />
      Login & Registration Copy
    </h3>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
        <p className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">Login Page Settings</p>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Title</label>
          <input type="text" required value={loginTitle} onChange={(e) => setLoginTitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Subtitle</label>
          <textarea rows="2" required value={loginSubtitle} onChange={(e) => setLoginSubtitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm leading-relaxed" />
        </div>
      </div>

      <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
        <p className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">Registration Settings</p>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Title</label>
          <input type="text" required value={registerTitle} onChange={(e) => setRegisterTitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Subtitle</label>
          <textarea rows="2" required value={registerSubtitle} onChange={(e) => setRegisterSubtitle(e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-sm leading-relaxed" />
        </div>
      </div>
    </div>
  </div>
);

export default AuthSettings;
