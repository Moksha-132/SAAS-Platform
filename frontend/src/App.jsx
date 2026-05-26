import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalNotificationListener from './components/GlobalNotificationListener';

// Performance Optimization: Dynamic lazy-loading for code splitting
import LandingPage from './pages/LandingPage';
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCompanies = lazy(() => import('./pages/AdminCompanies'));
const AdminManagers = lazy(() => import('./pages/AdminManagers'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminChat = lazy(() => import('./pages/AdminChat'));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'));
const ManagerSoftware = lazy(() => import('./pages/ManagerSoftware'));
const ManagerChat = lazy(() => import('./pages/ManagerChat'));
const ManagerSalesPage = lazy(() => import('./pages/ManagerSales'));
const ManagerPending = lazy(() => import('./pages/ManagerPending'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const UserMarketplace = lazy(() => import('./pages/UserMarketplace'));
const UserContact = lazy(() => import('./pages/UserContact'));
const UserChat = lazy(() => import('./pages/UserChat'));
const UserCart = lazy(() => import('./pages/UserCart'));
const UserSettings = lazy(() => import('./pages/UserSettings'));
const ManagerSettings = lazy(() => import('./pages/ManagerSettings'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));

function App() {
  useEffect(() => {
    const controller = new AbortController();

    const applyTheme = () => {
      const stored = localStorage.getItem('syncsaas_website_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        const root = document.documentElement;
        if (settings.bgColor) root.style.setProperty('--theme-bg', settings.bgColor);
        if (settings.textColor) root.style.setProperty('--theme-text', settings.textColor);
        if (settings.accentColor) root.style.setProperty('--theme-accent', settings.accentColor);
        if (settings.navBgColor) root.style.setProperty('--theme-nav-bg', settings.navBgColor);
        if (settings.navTextColor) root.style.setProperty('--theme-nav-text', settings.navTextColor);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/settings', {
          signal: controller.signal
        });
        const data = await response.json();
        if (response.ok && data.success && data.settings) {
          localStorage.setItem('syncsaas_website_settings', JSON.stringify(data.settings));
          applyTheme();
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('syncsaas_settings_updated'));
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn(err.message);
        }
      }
    };

    applyTheme();
    fetchSettings();
    window.addEventListener('storage', applyTheme);
    return () => {
      controller.abort();
      window.removeEventListener('storage', applyTheme);
    };
  }, []);

  return (
    <Router>
      <GlobalNotificationListener />
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/manager-pending" element={<ManagerPending />} />
          
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-companies" element={<AdminCompanies />} />
          <Route path="/admin-managers" element={<AdminManagers />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/admin-chat" element={<AdminChat />} />
          <Route path="/admin-settings" element={<AdminSettings />} />

          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/manager-software" element={<ManagerSoftware />} />
          <Route path="/manager-chat" element={<ManagerChat />} />
          <Route path="/manager-sales" element={<ManagerSalesPage />} />
          <Route path="/manager-settings" element={<ManagerSettings />} />

          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-marketplace" element={<UserMarketplace />} />
          <Route path="/user-cart" element={<UserCart />} />
          <Route path="/user-contact" element={<UserContact />} />
          <Route path="/user-chat" element={<UserChat />} />
          <Route path="/user-settings" element={<UserSettings />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
