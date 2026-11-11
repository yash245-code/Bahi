'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="w-full bg-[#0E0F12] text-neutral-300 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white font-serif font-black text-base shadow-sm">
                B
              </div>
              <span className="font-serif font-black text-xl text-white tracking-tight">
                Bahi<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="mt-4 text-xs text-neutral-400 max-w-sm leading-relaxed">
              The unified multi-tenant enterprise operating system. Seamlessly connecting CRM, Sales,
              Inventory, Accounting, HR, and Operations on a single real-time ledger.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Link
                href="/status"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational (99.99%)
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Features & Modules
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition-colors">
                  Solutions & Use Cases
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-white transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security & Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog & Insights
                </Link>
              </li>
              <li>
                <Link href="/customers" className="hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-accent transition-colors flex items-center gap-1">
                  Staff Console <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full ml-1">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support & Sales
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Bahi Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>SOC2 Type II Certified Architecture</span>
            <span>GDPR & ISO/IEC 27001 Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
