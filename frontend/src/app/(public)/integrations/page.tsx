'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'Payments' | 'Communication' | 'Productivity' | 'Storage' | 'Accounting';
  description: string;
  logo: string;
  featured?: boolean;
  status: 'Available' | 'Beta';
}

const integrationsList: IntegrationItem[] = [
  {
    id: 'stripe',
    name: 'Stripe Payments & Billing',
    category: 'Payments',
    description: 'Accept credit cards, automated subscription billing, payment links on invoices, and instant webhooks.',
    logo: '💳',
    featured: true,
    status: 'Available',
  },
  {
    id: 'razorpay',
    name: 'Razorpay UPI & Netbanking',
    category: 'Payments',
    description: 'Instant UPI QR codes, virtual bank accounts, and automatic reconciliation for India and SE Asia.',
    logo: '⚡',
    featured: true,
    status: 'Available',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace & Gmail',
    category: 'Productivity',
    description: 'Synchronize customer emails, sync meeting schedules to calendar, and export reports to Google Sheets.',
    logo: '📁',
    featured: true,
    status: 'Available',
  },
  {
    id: 'slack',
    name: 'Slack Alerts & Notifications',
    category: 'Communication',
    description: 'Get real-time deal alerts, inventory low-stock warnings, and team approval pings inside Slack channels.',
    logo: '💬',
    featured: false,
    status: 'Available',
  },
  {
    id: 'zapier',
    name: 'Zapier Automation Hub',
    category: 'Productivity',
    description: 'Connect Bahi triggers and actions to 5,000+ web applications without writing a line of code.',
    logo: '⚡',
    featured: true,
    status: 'Available',
  },
  {
    id: 'minio-s3',
    name: 'Amazon S3 & MinIO Storage',
    category: 'Storage',
    description: 'Store high-resolution product photos, signed contract PDFs, and employee tax slips in your own S3 bucket.',
    logo: '🗄️',
    featured: false,
    status: 'Available',
  },
  {
    id: 'quickbooks-sync',
    name: 'QuickBooks Ledger Migration',
    category: 'Accounting',
    description: 'One-click migration assistant to import your chart of accounts, past invoices, and vendor balances.',
    logo: '📊',
    featured: false,
    status: 'Beta',
  },
  {
    id: 'twilio-whatsapp',
    name: 'Twilio & WhatsApp Business',
    category: 'Communication',
    description: 'Send automated PDF invoice links and shipment tracking updates directly to customer WhatsApp numbers.',
    logo: '📱',
    featured: false,
    status: 'Available',
  },
];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Payments', 'Communication', 'Productivity', 'Storage', 'Accounting'];

  const filtered = useMemo(() => {
    return integrationsList.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connected Ecosystem</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ink dark:text-white tracking-tight">
            Connect Bahi with your existing tech stack
          </h1>
          <p className="text-sm sm:text-base text-ink-muted dark:text-neutral-300 leading-relaxed">
            From payment gateways to cloud document storage and communication tools, Bahi integrates seamlessly
            with standard webhooks, OAuth 2.0, and REST APIs.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search integrations by name or function..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14161C] text-xs sm:text-sm text-ink dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-ink dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-6 bg-white dark:bg-[#14161C] border border-black/10 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-2xl">
                    {item.logo}
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-ink dark:text-white">{item.name}</h3>
                  <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">{item.category}</span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <Link
                  href={`/contact?subject=Integration+Setup:+${encodeURIComponent(item.name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-80"
                >
                  <span>Setup guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-neutral-400">Zero Code Required</span>
              </div>
            </div>
          ))}
        </div>

        {/* API callout */}
        <div className="mt-20 rounded-3xl p-8 bg-neutral-100 dark:bg-[#111318] border border-black/10 dark:border-white/10 text-center space-y-3">
          <h3 className="font-serif font-bold text-xl text-ink dark:text-white">Need a custom integration?</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Use our typed OpenAPI 3.0 endpoints, webhook listener dispatchers, and scoped API tokens to build
            bespoke internal tools in hours.
          </p>
          <div className="pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs shadow-md shadow-accent/20"
            >
              <span>Explore Developer Docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
