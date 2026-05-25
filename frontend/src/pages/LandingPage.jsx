import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Store, MessageSquare, Rocket } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  const stored = localStorage.getItem('syncsaas_website_settings');
  const settings = stored ? JSON.parse(stored) : null;

  const heroTitle = settings?.heroTitle || 'The Ultimate SaaS Hub for modern teams.';
  const heroSubtitle = settings?.heroSubtitle || 'Connect with top-tier software providers, manage subscriptions, and scale your business with ease. Managers represent the best software, and you reap the benefits.';
  const aboutTitle = settings?.aboutTitle || 'About SyncSaaS.';
  const aboutDescription1 = settings?.aboutDescription1 || 'SyncSaaS was built with a single mission in mind: to democratize software distribution and sales. We noticed a disconnect between amazing developers building great SaaS applications, and independent software managers or agencies seeking powerful tools to represent and sell to local businesses.';
  const aboutDescription2 = settings?.aboutDescription2 || 'By creating a unified hub, we allow software creators to manage their catalog globally, empower independent managers to market and support these products under their custom white-label subdomains, and give clients the confidence to negotiate with humans rather than ticket bots. We believe the future of software sales is personal, connected, and highly local.';
  
  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const titleWords = heroTitle.split(' ');
  const lastWord = titleWords.pop();
  const titleMain = titleWords.join(' ');

  const aboutWords = aboutTitle.split(' ');
  const lastAboutWord = aboutWords.pop();
  const aboutMain = aboutWords.join(' ');

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      
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
            <div className="p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: bgColor }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>Admin Analytics</h3>
              <p className="leading-relaxed opacity-70" style={{ color: textColor }}>Complete oversight of your software's performance, total revenue, company growth, and global reach in one seamless dashboard.</p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: bgColor }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>Manager Portals</h3>
              <p className="leading-relaxed opacity-70" style={{ color: textColor }}>Represent top software, chat directly with clients, schedule meetings seamlessly, and earn commissions on closed deals.</p>
            </div>
            <div className="p-8 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: bgColor }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: textColor }}>Instant Discovery</h3>
              <p className="leading-relaxed opacity-70" style={{ color: textColor }}>Users can search, compare, and instantly subscribe to powerful tools with one-click checkouts and flexible billing plans.</p>
            </div>
          </div>
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

      <Footer />
    </div>
  );
};

export default LandingPage;
