'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('bahi_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('bahi_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('bahi_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#14161C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl text-white">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1 text-xs">
            <h4 className="font-semibold text-neutral-100">Cookie & Privacy Preferences</h4>
            <p className="text-neutral-400 leading-relaxed">
              We use essential cookies to keep you signed in and maintain theme state. No invasive advertising
              trackers are used. See our{' '}
              <Link href="/cookies" className="text-accent underline hover:opacity-80">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="text-neutral-400 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 rounded-xl border border-white/10 text-neutral-300 hover:bg-white/5 transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-xl bg-accent text-white font-medium hover:opacity-95 transition-opacity"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

