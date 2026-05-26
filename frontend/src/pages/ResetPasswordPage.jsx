import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';
import { KeyRound, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token');

  const settings = useWebsiteSettings();
  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Reset failed. The link may have expired.');
      }
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor, color: textColor }}>
      <Navbar />
      <div className="flex-grow pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div
            className="p-8 rounded-3xl border shadow-xl"
            style={{ backgroundColor: bgColor, borderColor: `${textColor}15` }}
          >
            {!done ? (
              <>
                <div className="text-center mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <KeyRound className="w-7 h-7" style={{ color: accentColor }} />
                  </div>
                  <h1 className="text-3xl font-extrabold mb-2" style={{ color: textColor }}>
                    New <span style={{ color: accentColor }}>Password</span>
                  </h1>
                  <p className="text-sm opacity-70" style={{ color: textColor }}>
                    Choose a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900 pr-12"
                        style={{ borderColor: `${textColor}20` }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 bg-white text-slate-900"
                      style={{ borderColor: `${textColor}20` }}
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-medium text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-white px-6 py-4 rounded-xl font-bold text-base transition-all shadow-md hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${accentColor}15` }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: accentColor }} />
                </div>
                <h2 className="text-2xl font-extrabold mb-3" style={{ color: textColor }}>Password Reset!</h2>
                <p className="text-sm opacity-70 leading-relaxed" style={{ color: textColor }}>
                  Your password has been updated successfully. Redirecting you to login...
                </p>
              </div>
            )}

            <div className="mt-7 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
                style={{ color: accentColor }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
