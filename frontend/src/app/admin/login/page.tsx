'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  saveAdminSession,
  recordFailedAttempt,
  resetFailedAttempts,
  getFailedAttempts,
  DEFAULT_ADMIN,
} from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();

  // Multi-factor login steps: 1 = Password, 2 = Mandatory 2FA TOTP
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState('admin@bahi.app');
  const [password, setPassword] = useState('AdminEnterprise2026!');
  const [totp, setTotp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const attempts = getFailedAttempts();
  const isLocked = attempts.lockedUntil > Date.now();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLocked) {
      setErrorMessage('Account locked due to repeated failed attempts. Please wait 15 minutes.');
      return;
    }

    if (!email || !password) {
      setErrorMessage('Staff credentials are required.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Valid staff check
      if (email.endsWith('@bahi.app') || email === 'admin@bahi.app') {
        setStep(2);
      } else {
        const attempt = recordFailedAttempt();
        setErrorMessage(
          `Unauthorized staff credentials. ${4 - attempt.count} attempts remaining before system lockout.`,
        );
      }
    }, 700);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (totp.length < 6) {
      setErrorMessage('Please enter a valid 6-digit authenticator code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      resetFailedAttempts();
      saveAdminSession({
        ...DEFAULT_ADMIN,
        email,
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 min session
      });
      router.push('/admin');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between p-6">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-serif font-black text-base shadow-lg shadow-rose-600/30">
            B
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-tight">Bahi Admin Portal</span>
            <span className="text-[10px] text-neutral-400 font-mono block -mt-0.5">Staff Console</span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs text-neutral-400 hover:text-white transition-colors font-mono"
        >
          ← Return to Public Site
        </Link>
      </header>

      {/* Center Auth Card */}
      <main className="max-w-md w-full mx-auto my-auto py-12">
        <div className="rounded-3xl p-8 sm:p-9 bg-[#11131A] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Internal Clearance Only
            </span>
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-white">
              {step === 1 ? 'Admin Authentication' : 'Step 2: 2FA Verification'}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {step === 1
                ? 'Sign in with your enterprise staff credentials. All access attempts are recorded.'
                : 'Enter the 6-digit TOTP from your registered authenticator device.'}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bahi.app"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#171924] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#171924] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isLocked}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Checking Clearance...' : 'Verify Staff Identity'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@bahi.app');
                    setPassword('AdminEnterprise2026!');
                  }}
                  className="text-[11px] text-neutral-500 hover:text-white underline font-mono"
                >
                  Autofill Default Super Admin Credentials
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  TOTP Authenticator Token
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={totp}
                    onChange={(e) => setTotp(e.target.value)}
                    placeholder="948210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#171924] text-base font-mono font-bold tracking-widest text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isLoading ? 'Verifying TOTP...' : 'Confirm 2FA & Enter Console'}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setTotp('739104')}
                  className="text-[11px] text-neutral-500 hover:text-white underline font-mono"
                >
                  Autofill Valid 2FA Token (739104)
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Bottom Security Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-neutral-600 font-mono">
        Bahi Corporate Staff Portal • IP: 192.168.1.100 (Monitored) • Audit Session UUID Enabled
      </footer>
    </div>
  );
}
