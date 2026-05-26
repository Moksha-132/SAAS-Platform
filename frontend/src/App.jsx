import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import MarketplacePage from './pages/MarketplacePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCompanies from './pages/AdminCompanies';
import AdminManagers from './pages/AdminManagers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminChat from './pages/AdminChat';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerSoftware from './pages/ManagerSoftware';
import ManagerChat from './pages/ManagerChat';
import ManagerSalesPage from './pages/ManagerSales';
import ManagerPending from './pages/ManagerPending';
import UserDashboard from './pages/UserDashboard';
import UserMarketplace from './pages/UserMarketplace';
import UserContact from './pages/UserContact';
import UserChat from './pages/UserChat';
import UserCart from './pages/UserCart';
import UserSettings from './pages/UserSettings';
import ManagerSettings from './pages/ManagerSettings';
import GlobalNotificationListener from './components/GlobalNotificationListener';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';

function App() {
  useEffect(() => {
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
        const response = await fetch('http://localhost:5000/api/auth/settings');
        const data = await response.json();
        if (response.ok && data.success && data.settings) {
          localStorage.setItem('syncsaas_website_settings', JSON.stringify(data.settings));
          applyTheme();
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('syncsaas_settings_updated'));
        }
      } catch (err) {
        console.warn(err.message);
      }
    };

    applyTheme();
    fetchSettings();
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, []);

  return (
    <Router>
      <GlobalNotificationListener />
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
    </Router>
  );
}

export default App;
