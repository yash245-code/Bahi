'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, Key, Server } from 'lucide-react';

const securityPillars = [
  {
    icon: <Lock className="w-6 h-6 text-emerald-500" />,
    title: 'Encryption in Transit & at Rest',
    desc: 'All HTTP traffic requires TLS 1.3 with modern cipher suites and HSTS enabled. Data at rest is encrypted with AES-256 keys managed in secure hardware security modules (HSM).',
  },
  {
    icon: <Database className="w-6 h-6 text-accent" />,
    title: 'PostgreSQL Row-Level Security (RLS)',
    desc: 'Tenancy isolation is enforced directly by PostgreSQL kernel policies. Each authenticated database session binds to the caller’s verified tenant UUID, making cross-tenant data leaks impossible.',
  },
  {
    icon: <Key className="w-6 h-6 text-amber-500" />,
    title: 'Role-Based Access Control (RBAC)',
    desc: 'Granular permissions protect every API endpoint and user action. Assign strict roles (Owner, Billing, Support, Content, Custom) with field-level visibility controls.',
  },
  {
    icon: <Server className="w-6 h-6 text-blue-500" />,
    title: 'Immutable Audit Logging',
    desc: 'Every critical system change—role updates, exports, billing adjustments, and user impersonations—is recorded in an append-only audit log with timestamp, IP, and actor identity.',
  },
];

const complianceBadges = [
  { label: 'SOC 2 Type II Certified Architecture', status: 'Verified' },
  { label: 'GDPR / CCPA Compliant Data Processing', status: 'Compliant' },
  { label: 'ISO/IEC 27001 Security Controls', status: 'Aligned' },
  { label: 'HIPAA Business Associate Ready (BAA)', status: 'Enterprise' },
];

export default function SecurityPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enterprise Security & Trust</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            Security engineered at every layer of the architecture
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Your business operations and financial ledgers represent your company&apos;s most sensitive asset.
            We treat privacy, reliability, and security as foundational engineering requirements.
          </p>
        </div>

        {/* Compliance Badges Strip */}
        <div className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceBadges.map((badge, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-5 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-ink dark:text-white">{badge.label}</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {badge.status}
              </span>
            </div>
          ))}
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {securityPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-4"
            >
              <div className="p-3 w-fit rounded-2xl bg-neutral-100 dark:bg-white/5">{pillar.icon}</div>
              <h3 className="font-serif font-bold text-xl text-ink dark:text-white">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Responsible Disclosure & SLA */}
        <div className="rounded-3xl p-8 sm:p-12 bg-neutral-100 dark:bg-[#111318] border border-black/10 dark:border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h3 className="font-serif font-bold text-2xl text-ink dark:text-white">
              Vulnerability Disclosure & Bounty Program
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We welcome responsible reports from security researchers. If you identify a potential security
              issue, please notify our security team at <code className="text-accent">security@bahi.app</code> with PGP
              encryption.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/status"
              className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] text-xs font-semibold text-ink dark:text-white hover:bg-neutral-50"
            >
              Check Live Status
            </Link>
            <Link
              href="/contact?intent=security-audit"
              className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold shadow-md shadow-accent/20"
            >
              Request SOC2 Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
