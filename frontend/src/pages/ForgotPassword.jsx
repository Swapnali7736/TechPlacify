import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '', devUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '', devUrl: '' });
    setLoading(true);

    try {
      const res = await api.post('/auth/password-reset/', { email });
      setStatus({
        type: 'success',
        message: 'Password reset link has been dispatched to your email address.',
        devUrl: res.data.dev_reset_url || '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Could not send reset link. Please check the email entered and try again.',
        devUrl: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your account email to receive a password reset link
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          {status.type === 'error' && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'success' ? (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Check Your Email</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {status.message}
              </p>

              {status.devUrl && (
                <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-1.5 flex items-center gap-1">
                    <span>Local Development Link:</span>
                  </p>
                  <a
                    href={status.devUrl}
                    className="text-xs text-indigo-700 hover:text-indigo-900 break-all underline flex items-center gap-1 font-mono"
                  >
                    <span>Open Reset Link directly</span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
