import React from 'react';
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
import AdminSoftware from './pages/AdminSoftware';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerSoftware from './pages/ManagerSoftware';
import ManagerChat from './pages/ManagerChat';
import ManagerSales from './pages/ManagerSales';
import ManagerPending from './pages/ManagerPending';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/manager-pending" element={<ManagerPending />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-companies" element={<AdminCompanies />} />
        <Route path="/admin-managers" element={<AdminManagers />} />
        <Route path="/admin-software" element={<AdminSoftware />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-settings" element={<AdminSettings />} />

        {/* Manager Routes */}
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/manager-software" element={<ManagerSoftware />} />
        <Route path="/manager-chat" element={<ManagerChat />} />
        <Route path="/manager-sales" element={<ManagerSales />} />

        {/* User Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
