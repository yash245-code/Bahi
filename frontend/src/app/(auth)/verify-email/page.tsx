'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MailCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleInputChange = (idx: number, val: string) => {
    let char = val;
    if (char.length > 1) char = char[char.length - 1] || '';
    const newCode = [...code];
    newCode[idx] = char;
    setCode(newCode);

    // Auto-focus next input
    if (char && idx < 5) {
      const nextInput = document.getElementById(`digit-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      setTimeout(() => {
        router.push('/onboarding');
      }, 1200);
    }, 900);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#14161C]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden text-center">
        {verified ? (
          <div className="py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-black text-2xl text-white">Email Verified!</h2>
            <p className="text-xs text-neutral-400">
              Your cryptographic identity is confirmed. Launching initial workspace setup...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mx-auto">
              <MailCheck className="w-8 h-8" />
            </div>

            <div>
              <h1 className="font-serif font-black text-2xl text-white">Verify Your Email</h1>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                We sent a 6-digit confirmation code to your inbox. Enter the code below to activate your tenant.
              </p>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex items-center justify-center gap-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`digit-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border border-white/10 bg-[#1D1F29] text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying || code.join('').length < 6}
              className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isVerifying ? 'Verifying Code...' : 'Confirm & Launch Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-xs text-neutral-500">
              Didn&apos;t receive a code?{' '}
              <button
                type="button"
                onClick={() => setCode(['4', '8', '2', '9', '1', '0'])}
                className="text-accent underline"
              >
                Autofill test code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
