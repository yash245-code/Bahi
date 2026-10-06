import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0E0F12] text-white flex flex-col justify-between selection:bg-accent/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[650px] h-[650px] rounded-full bg-brand-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

      {/* Subtle Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-[#8B2500] flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <span className="font-serif font-black text-xl text-white tracking-tight flex items-center gap-1">
              Bahi<span className="text-accent">.</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block -mt-1">
              Unified Enterprise OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Atlas v2 Live</span>
          </div>
        </div>
      </header>

      {/* Center Main Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2 border-t border-white/5">
        <p>© 2026 Bahi Technologies Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="http://localhost:4000/api/docs" target="_blank" rel="noreferrer" className="hover:text-neutral-400 transition-colors">
            API Docs
          </a>
          <Link href="/applications" className="hover:text-neutral-400 transition-colors">
            Applications
          </Link>
          <Link href="/login" className="hover:text-neutral-400 transition-colors">
            Security & Compliance
          </Link>
        </div>
      </footer>
    </div>
  );
}
