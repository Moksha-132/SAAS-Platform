import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Store, MessageSquare, Rocket, Search, ShoppingCart, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

const LandingPage = () => {
  const settings = useWebsiteSettings();

  const heroTitle = settings?.heroTitle || 'The Ultimate SaaS Hub for modern teams.';
  const heroSubtitle = settings?.heroSubtitle || 'Connect with top-tier software providers, manage subscriptions, and scale your business with ease. Managers represent the best software, and you reap the benefits.';
  const aboutTitle = settings?.aboutTitle || 'About SyncSaaS.';
  const aboutDescription1 = settings?.aboutDescription1 || 'SyncSaaS was built with a single mission in mind: to democratize software distribution and sales. We noticed a disconnect between amazing developers building great SaaS applications, and independent software managers or agencies seeking powerful tools to represent and sell to local businesses.';
  const aboutDescription2 = settings?.aboutDescription2 || 'By creating a unified hub, we allow software creators to manage their catalog globally, empower independent managers to market and support these products under their custom white-label subdomains, and give clients the confidence to negotiate with humans rather than ticket bots. We believe the future of software sales is personal, connected, and highly local.';
  
  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  // #9a3412 (orange-800) has > 4.5:1 contrast on white — passes WCAG AA
  const accentColor = settings?.accentColor || '#9a3412';

  const contactTitle = settings?.contactTitle || 'Get in Touch';
  const contactSubtitle = settings?.contactSubtitle || "Have questions about our platform? We're here to help.";
  const contactEmail = settings?.contactEmail || 'info@shnoor.com';
  const contactPhone1 = settings?.contactPhone1 || '+91-9429694298';
  const contactPhone2 = settings?.contactPhone2 || '+91-9041914601';
  const contactAddress = settings?.contactAddress || '10009 Mount Tabor Road, City, Odessa Missouri, United States';

  const defaultFeatures = [
    { id: 'feat-1', title: 'Admin Analytics', desc: "Complete oversight of your software's performance, total revenue, company growth, and global reach in one seamless dashboard." },
    { id: 'feat-2', title: 'Manager Portals', desc: 'Represent top software, chat directly with clients, schedule meetings seamlessly, and earn commissions on closed deals.' },
    { id: 'feat-3', title: 'Instant Discovery', desc: 'Users can search, compare, and instantly subscribe to powerful tools with one-click checkouts and flexible billing plans.' }
  ];
  const features = settings?.features || defaultFeatures;

  const titleWords = heroTitle.split(' ');
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(' ');

  const aboutWords = aboutTitle.split(' ');
  const lastAboutWord = aboutWords.pop();
  const aboutMain = aboutWords.join(' ');

  const [softwareList, setSoftwareList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        const url = searchQuery 
          ? `http://localhost:5000/api/users/software?search=${encodeURIComponent(searchQuery)}`
          : 'http://localhost:5000/api/users/software';
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setSoftwareList(data.software);
        }
      } catch (err) {
        console.error("Failed to fetch software marketplace:", err);
      }
    };
    
    const timerId = setTimeout(() => {
      fetchSoftware();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor, color: textColor }}>
      {/* Skip to main content for keyboard/screen reader users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:font-bold focus:shadow-lg">Skip to main content</a>
      <Navbar />
      
      <main id="main-content">
      <div className="pt-32 pb-20 lg:pt-44 lg:pb-32 text-center" style={{ backgroundColor: bgColor }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6" style={{ color: textColor }}>
              {titleMain}{' '}
              <span style={{ color: accentColor }}>{lastWord}</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg mb-10 leading-relaxed opacity-80" style={{ color: textColor }}>
              {heroSubtitle}
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="/register"
                className="text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-md hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Get Started Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div id="features" className="py-24 text-center border-t border-b border-slate-100/30" style={{ backgroundColor: bgColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: textColor }}>
              Powerful <span style={{ color: accentColor }}>Features.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {features.map((feat) => (
              <div key={feat.id} className="p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: bgColor }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>{feat.title}</h3>
                <p className="leading-relaxed opacity-70" style={{ color: textColor }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="marketplace" className="py-24 border-b border-slate-100/30" style={{ backgroundColor: bgColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: textColor }}>
              Software <span style={{ color: accentColor }}>Marketplace.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto opacity-70" style={{ color: textColor }}>
              Discover the perfect tools to accelerate your business growth.
            </p>
          </div>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for software tools..." 
              aria-label="Search for software tools"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-slate-800"
            />
          </div>

          {softwareList.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 border border-slate-200/40 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-600 mb-1">No software found</h3>
              <p className="text-sm text-slate-400">There are currently no products hosted in the marketplace matching your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {softwareList.map(software => (
                <div key={software.id} className="border border-slate-200/60 rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full shadow-sm">
                  <div className="w-full h-40 bg-slate-50 rounded-xl mb-6 flex items-center justify-center border border-slate-100">
                    <span className="text-slate-400 font-bold text-xl">{software.name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{software.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-3">{software.description}</p>
                  
                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Monthly Plan:</span>
                      <span className="font-bold text-slate-900">${software.monthly_price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Yearly Plan:</span>
                      <span className="font-bold text-[#b45309]">${software.yearly_price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <a href="/login" className="flex-1 bg-[#0f172a] hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2 text-center text-sm">
                      <ShoppingCart className="w-4 h-4" /> Buy Plan
                    </a>
                    {software.deployment_link && (
                      <a 
                        href={software.deployment_link.startsWith('http') ? software.deployment_link : `https://${software.deployment_link}`}
                        target="_blank" rel="noreferrer"
                        className="bg-white border-2 border-slate-200 hover:border-[#b45309] hover:text-[#b45309] text-slate-500 p-3 rounded-xl transition-colors"
                        title="View Deployment"
                        aria-label={`View deployment for ${software.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="how-it-works" className="py-24 border-b border-slate-100/30" style={{ backgroundColor: bgColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: textColor }}>
              How SyncSaaS <span style={{ color: accentColor }}>Works.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto opacity-70" style={{ color: textColor }}>
              A seamless ecosystem connecting software owners, dedicated managers, and businesses looking for the perfect tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', icon: UserPlus, title: 'Create Your Account', desc: 'Sign up and select your role: Software Owner (Admin), Manager, or Client. We tailor the dashboard specifically to your needs.' },
              { num: '02', icon: Store, title: 'List or Represent', desc: 'Owners list their software on the platform. Managers can then apply to host those products on their own custom domains to start selling.' },
              { num: '03', icon: MessageSquare, title: 'Connect & Negotiate', desc: 'Clients browse the marketplace and chat directly with Managers. Schedule demos, ask questions, and negotiate terms all in one place.' },
              { num: '04', icon: Rocket, title: 'Subscribe & Grow', desc: 'Complete the secure payment process. Managers earn their commission, Owners see revenue growth, and Clients get instant access.' }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative p-8 border border-slate-200/50 rounded-3xl shadow-sm hover:shadow-lg transition-all text-left overflow-hidden" style={{ backgroundColor: bgColor }}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: accentColor }}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-5xl font-black opacity-10" style={{ color: textColor }}>{step.num}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: textColor }}>{step.title}</h3>
                  <p className="leading-relaxed opacity-70 text-sm" style={{ color: textColor }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>




      <div className="py-24 text-center" style={{ backgroundColor: bgColor }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8" style={{ color: textColor }}>
            {aboutMain}{' '}
            <span style={{ color: accentColor }}>{lastAboutWord}</span>
          </h2>
          <p className="text-lg leading-relaxed mb-6 opacity-85" style={{ color: textColor }}>
            {aboutDescription1}
          </p>
          <p className="text-lg leading-relaxed opacity-85" style={{ color: textColor }}>
            {aboutDescription2}
          </p>
        </div>
      </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
