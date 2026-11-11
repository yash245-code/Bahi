'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide your registered work email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 900);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#14161C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>

        {isSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-black text-2xl text-white">Reset Link Dispatched</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We have dispatched a time-limited password reset link to <strong className="text-white">{email}</strong>.
              Follow the instructions in the email to choose a new password.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href="/reset-password"
                className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-semibold text-center"
              >
                Proceed to Enter New Password (Demo)
              </Link>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Re-enter email address
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h1 className="font-serif font-black text-2xl text-white">Reset Your Password</h1>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your account email to receive cryptographic password reset credentials.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                Registered Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#1D1F29] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Verifying...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
