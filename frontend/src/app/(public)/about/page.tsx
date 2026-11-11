'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Heart, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: <Target className="w-5 h-5 text-accent" />,
    title: 'Zero Operational Silos',
    desc: 'Business departments should never fight over mismatched numbers. Every invoice, lead, and stock unit connects to one single source of truth.',
  },
  {
    icon: <Shield className="w-5 h-5 text-emerald-500" />,
    title: 'Uncompromising Customer Privacy',
    desc: 'Your business records belong strictly to you. We will never sell, analyze for ad profiling, or lock down your proprietary records.',
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-500" />,
    title: 'Speed as a Feature',
    desc: 'Enterprise software should be lightning fast. Sub-100ms interactions, instantaneous keyboard shortcuts, and zero waiting wheels.',
  },
  {
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    title: 'Built for Hardworking Operators',
    desc: 'We build for founders, accountants, warehouse coordinators, and sales reps—giving them software that respects their intelligence and time.',
  },
];

const teamMembers = [
  {
    name: 'Aiden Vance',
    role: 'Co-Founder & CEO',
    bio: 'Former enterprise systems architect. Passionate about empowering SMEs with modern cloud tools.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80',
  },
  {
    name: 'Rohan Mehra',
    role: 'Co-Founder & CTO',
    bio: 'PostgreSQL optimization specialist, distributed systems advocate, and compiler enthusiast.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=260&q=80',
  },
  {
    name: 'Aditi Sharma',
    role: 'VP of Product & Design',
    bio: 'Led product design for high-density fintech workflows and developer tools.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=260&q=80',
  },
  {
    name: 'Marcus Bell',
    role: 'Head of Customer Engineering',
    bio: 'Assisted over 600 companies migrating from legacy ERPs to unified cloud architectures.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=260&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            We build software for businesses that build the real world
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            Bahi started with a simple belief: small and mid-sized enterprises shouldn&apos;t have to stitch
            together six fragile SaaS tools or pay six-figure consultants for legacy ERP setups.
          </p>
        </div>

        {/* Story Section */}
        <div className="rounded-3xl p-8 sm:p-14 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm mb-20 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-white">The Bahi Story</h2>
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-4 leading-relaxed">
            <p>
              In traditional businesses, information travels at the speed of copy-paste. Sales teams close an
              order in a CRM; warehouse managers find out hours later through an exported spreadsheet; accountants
              re-key the exact same invoice numbers into a ledger at the end of the month.
            </p>
            <p>
              We founded Bahi to bring the elegance of consumer design and the bulletproof data integrity of
              PostgreSQL Row-Level Security to operational businesses. By keeping customer records, sales deals,
              warehouse bins, journal balances, and team payroll on one unified schema, Bahi allows business
              owners to see their cashflow and operations in real-time, anytime, anywhere.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink dark:text-white">Our Guiding Values</h2>
            <p className="text-xs text-neutral-500 mt-2">The principles that drive every architectural choice we make.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="p-3 w-fit rounded-2xl bg-neutral-100 dark:bg-white/5">{v.icon}</div>
                <h3 className="font-serif font-bold text-base text-ink dark:text-white">{v.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-ink dark:text-white">Leadership & Engineering</h2>
            <p className="text-xs text-neutral-500 mt-2">A dedicated team obsessed with operational craftsmanship.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm text-center space-y-3"
              >
                <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden bg-neutral-100 border border-black/10 dark:border-white/10">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-ink dark:text-white">{member.name}</h3>
                  <p className="text-[11px] font-mono text-accent">{member.role}</p>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join our team CTA */}
        <div className="rounded-3xl p-8 sm:p-12 bg-neutral-100 dark:bg-[#111318] border border-black/10 dark:border-white/10 text-center space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink dark:text-white">
            Want to help shape the future of enterprise software?
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            We are hiring frontend architects, systems engineers, and customer advocates worldwide.
          </p>
          <div className="pt-2">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20 hover:opacity-95 transition-all"
            >
              <span>View Open Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
