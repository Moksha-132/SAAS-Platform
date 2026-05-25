import React from 'react';
import { Phone } from 'lucide-react';

const ContactSettings = ({
  contactTitle, setContactTitle,
  contactSubtitle, setContactSubtitle,
  contactEmail, setContactEmail,
  contactPhone1, setContactPhone1,
  contactPhone2, setContactPhone2,
  contactAddress, setContactAddress
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
      <Phone className="text-[#f97316] w-5 h-5" />
      Contact Info Settings
    </h3>
    
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Main Heading</label>
          <input type="text" required value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Page Subtitle</label>
          <input type="text" required value={contactSubtitle} onChange={(e) => setContactSubtitle(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Support Email</label>
          <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Support Phone 1</label>
          <input type="text" required value={contactPhone1} onChange={(e) => setContactPhone1(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Support Phone 2</label>
          <input type="text" required value={contactPhone2} onChange={(e) => setContactPhone2(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Headquarters Address</label>
        <textarea rows="2" required value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#f97316]" />
      </div>
    </div>
  </div>
);

export default ContactSettings;
