import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const settings = useWebsiteSettings();
  const bgColor = settings?.bgColor || '#FFFFFF';
  const textColor = settings?.textColor || '#0F172A';
  const accentColor = settings?.accentColor || '#f97316';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSent(true);
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
            {!sent ? (
              <>
                <div className="text-center mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <Mail className="w-7 h-7" style={{ color: accentColor }} />
                  </div>
                  <h1 className="text-3xl font-extrabold mb-2" style={{ color: textColor }}>
                    Forgot <span style={{ color: accentColor }}>Password?</span>
                  </h1>
                  <p className="text-sm opacity-70" style={{ color: textColor }}>
                    Enter your account email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: textColor }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
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
                <h2 className="text-2xl font-extrabold mb-3" style={{ color: textColor }}>Check your inbox</h2>
                <p className="text-sm opacity-70 leading-relaxed" style={{ color: textColor }}>
                  If <strong>{email}</strong> is registered, a password reset link has been sent. Check your spam folder if you don't see it.
                </p>
                <p className="text-xs opacity-50 mt-4" style={{ color: textColor }}>
                  Link expires in 1 hour.
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

export default ForgotPasswordPage;
