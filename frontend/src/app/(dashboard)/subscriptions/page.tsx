'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  RefreshCw,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  Calendar,
  Check,
  Download,
  Eye,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface Subscription {
  id: string;
  customer: string;
  email: string;
  planId: string;
  planName: string;
  billingCycle: 'Monthly' | 'Quarterly' | 'Annual';
  mrr: number;
  amount: number;
  startDate: string;
  renewalDate: string;
  status: 'Active' | 'Trial' | 'Past Due' | 'Paused' | 'Cancelled';
  paymentMethod: string;
  autoRenew: boolean;
}

interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  maxUsers: string;
  active: boolean;
}

interface RecurringInvoice {
  id: string;
  subscriptionId: string;
  customer: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

// ─── Initial Seed Data ───────────────────────────────────────────────────────

const initialPlans: PlanTier[] = [
  {
    id: 'plan-starter',
    name: 'Starter Pack',
    tagline: 'Ideal for small shops and solo business owners starting out.',
    monthlyPrice: 89,
    annualPrice: 75,
    badge: 'Beginner',
    maxUsers: 'Up to 3 team members',
    features: [
      'Core Customer Directory (CRM)',
      'Basic Sales Quotes & Orders',
      'Inventory Stock Tracking',
      'Standard Invoicing',
      'Email Support (48h reply)',
    ],
    active: true,
  },
  {
    id: 'plan-growth',
    name: 'Growth Tier',
    tagline: 'For growing retail, trade, and regional service operations.',
    monthlyPrice: 199,
    annualPrice: 169,
    popular: true,
    badge: 'Most Popular',
    maxUsers: 'Up to 15 team members',
    features: [
      'Everything in Starter',
      'Multi-warehouse Stock Movement',
      'Automated Billing & Reminders',
      'Employee Attendance & HR',
      'Project Task Boards',
      'Priority Support (under 2h)',
    ],
    active: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Suite',
    tagline: 'Complete operating platform for multi-branch companies.',
    monthlyPrice: 499,
    annualPrice: 419,
    badge: 'Scale',
    maxUsers: 'Unlimited team members',
    features: [
      'Everything in Growth',
      'Custom Roles & Audit Logs',
      'Dedicated Account Manager',
      'Double-entry Ledger & Tax Filing',
      'Custom Webhooks & REST API',
      '99.9% Uptime Guarantee',
    ],
    active: true,
  },
];

const initialSubscriptions: Subscription[] = [
  {
    id: 'SUB-801',
    customer: 'Green Garden Cafe',
    email: 'billing@greengarden.cafe',
    planId: 'plan-growth',
    planName: 'Growth Tier',
    billingCycle: 'Monthly',
    mrr: 199.0,
    amount: 199.0,
    startDate: 'May 14, 2026',
    renewalDate: 'Nov 14, 2026',
    status: 'Active',
    paymentMethod: 'Visa ending in 4821',
    autoRenew: true,
  },
  {
    id: 'SUB-802',
    customer: 'Apex Logistics Hub',
    email: 'accounts@apexlogistics.com',
    planId: 'plan-enterprise',
    planName: 'Enterprise Suite',
    billingCycle: 'Annual',
    mrr: 419.0,
    amount: 5028.0,
    startDate: 'Jan 15, 2026',
    renewalDate: 'Jan 15, 2027',
    status: 'Active',
    paymentMethod: 'Corporate ACH Bank',
    autoRenew: true,
  },
  {
    id: 'SUB-803',
    customer: 'Nordic Warehouses Ltd',
    email: 'finance@nordicstorage.se',
    planId: 'plan-enterprise',
    planName: 'Enterprise Suite',
    billingCycle: 'Monthly',
    mrr: 499.0,
    amount: 499.0,
    startDate: 'Feb 02, 2026',
    renewalDate: 'Nov 02, 2026',
    status: 'Active',
    paymentMethod: 'Mastercard ending in 9102',
    autoRenew: true,
  },
  {
    id: 'SUB-804',
    customer: 'Summit Medical Clinic',
    email: 'ops@summithealth.org',
    planId: 'plan-growth',
    planName: 'Growth Tier',
    billingCycle: 'Monthly',
    mrr: 199.0,
    amount: 199.0,
    startDate: 'Jul 30, 2026',
    renewalDate: 'Oct 30, 2026',
    status: 'Past Due',
    paymentMethod: 'Amex ending in 1004',
    autoRenew: true,
  },
  {
    id: 'SUB-805',
    customer: 'Highland Residency',
    email: 'manager@highlandstay.in',
    planId: 'plan-starter',
    planName: 'Starter Pack',
    billingCycle: 'Monthly',
    mrr: 89.0,
    amount: 89.0,
    startDate: 'Oct 20, 2026',
    renewalDate: 'Nov 20, 2026',
    status: 'Trial',
    paymentMethod: 'Trial (Card Attached)',
    autoRenew: true,
  },
  {
    id: 'SUB-806',
    customer: 'Harbor Marine Electronics',
    email: 'support@harbormarine.co',
    planId: 'plan-starter',
    planName: 'Starter Pack',
    billingCycle: 'Quarterly',
    mrr: 85.0,
    amount: 255.0,
    startDate: 'Jun 10, 2026',
    renewalDate: 'Dec 10, 2026',
    status: 'Paused',
    paymentMethod: 'Visa ending in 3319',
    autoRenew: false,
  },
];

const initialInvoices: RecurringInvoice[] = [
  {
    id: 'INV-2026-901',
    subscriptionId: 'SUB-801',
    customer: 'Green Garden Cafe',
    date: 'Oct 14, 2026',
    amount: 199.0,
    paymentMethod: 'Visa •• 4821',
    status: 'Paid',
  },
  {
    id: 'INV-2026-902',
    subscriptionId: 'SUB-802',
    customer: 'Apex Logistics Hub',
    date: 'Jan 15, 2026',
    amount: 5028.0,
    paymentMethod: 'Direct ACH',
    status: 'Paid',
  },
  {
    id: 'INV-2026-903',
    subscriptionId: 'SUB-803',
    customer: 'Nordic Warehouses Ltd',
    date: 'Oct 02, 2026',
    amount: 499.0,
    paymentMethod: 'Mastercard •• 9102',
    status: 'Paid',
  },
  {
    id: 'INV-2026-904',
    subscriptionId: 'SUB-804',
    customer: 'Summit Medical Clinic',
    date: 'Oct 30, 2026',
    amount: 199.0,
    paymentMethod: 'Amex •• 1004',
    status: 'Failed',
  },
  {
    id: 'INV-2026-905',
    subscriptionId: 'SUB-806',
    customer: 'Harbor Marine Electronics',
    date: 'Sep 10, 2026',
    amount: 255.0,
    paymentMethod: 'Visa •• 3319',
    status: 'Paid',
  },
];

export default function SubscriptionsPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans' | 'invoices' | 'analytics'>('subscriptions');

  // Data State
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [plans, setPlans] = useState<PlanTier[]>(initialPlans);
  const [invoices, setInvoices] = useState<RecurringInvoice[]>(initialInvoices);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pricingCycleView, setPricingCycleView] = useState<'monthly' | 'annual'>('monthly');

  // Modals & Drawers
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Toast System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // ─── Filtered Subscriptions ────────────────────────────────────────────────
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
      const matchCycle = cycleFilter === 'all' || s.billingCycle.toLowerCase() === cycleFilter.toLowerCase();
      const matchSearch =
        s.customer.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.planName.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchCycle && matchSearch;
    });
  }, [subscriptions, statusFilter, cycleFilter, search]);

  // ─── Financial Calculations ────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === 'Active' || s.status === 'Trial');
    const totalMrr = activeSubs.reduce((acc, curr) => acc + curr.mrr, 0);
    const totalArr = totalMrr * 12;
    const activeCount = subscriptions.filter((s) => s.status === 'Active').length;
    const trialCount = subscriptions.filter((s) => s.status === 'Trial').length;
    const pastDueCount = subscriptions.filter((s) => s.status === 'Past Due').length;
    const arpu = activeSubs.length > 0 ? totalMrr / activeSubs.length : 0;

    return {
      totalMrr,
      totalArr,
      activeCount,
      trialCount,
      pastDueCount,
      arpu,
    };
  }, [subscriptions]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleTogglePause = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const nextStatus = s.status === 'Paused' ? 'Active' : 'Paused';
          showToast(`Subscription ${s.id} marked as ${nextStatus}`, 'info');
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    if (selectedSub && selectedSub.id === subId) {
      setSelectedSub((prev) => (prev ? { ...prev, status: prev.status === 'Paused' ? 'Active' : 'Paused' } : null));
    }
  };

  const handleCancelSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'Cancelled', autoRenew: false } : s))
    );
    showToast(`Subscription ${subId} has been cancelled.`, 'warn');
    if (selectedSub && selectedSub.id === subId) {
      setSelectedSub((prev) => (prev ? { ...prev, status: 'Cancelled', autoRenew: false } : null));
    }
  };

  const handleSendReminder = (sub: Subscription) => {
    showToast(`Payment reminder sent to ${sub.email}`, 'success');
  };

  const handleMarkInvoicePaid = (invId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invId ? { ...inv, status: 'Paid' } : inv))
    );
    const targetInvoice = invoices.find((i) => i.id === invId);
    if (targetInvoice) {
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === targetInvoice.subscriptionId && s.status === 'Past Due'
            ? { ...s, status: 'Active' }
            : s
        )
      );
    }
    showToast(`Invoice ${invId} marked as Paid. Customer account updated.`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Subscription ID', 'Customer', 'Email', 'Plan', 'Billing Cycle', 'MRR ($)', 'Renewal Date', 'Status'];
    const rows = filteredSubscriptions.map((s) => [
      s.id,
      `"${s.customer}"`,
      s.email,
      `"${s.planName}"`,
      s.billingCycle,
      s.mrr.toFixed(2),
      s.renewalDate,
      s.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_subscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscriptions list exported to CSV', 'success');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* ─── Toast Feedback ──────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 text-white shadow-xl border border-neutral-700 animate-slide-up">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'warn' && <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          {toast.type === 'info' && <RefreshCw className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-neutral-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Header & Primary Navigation ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 font-mono">
              Recurring Engine
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-2 py-0.5 rounded">
              Multi-Tier Billing
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-Renew Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight flex items-center gap-3">
            Subscriptions &amp; Plans
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl">
            Keep track of customer recurring contracts, configure pricing tiers, and monitor predictable monthly cash flow.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
          >
            ← All Apps
          </Link>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            Export CSV
          </button>

          <button
            onClick={() => setIsNewPlanModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#E11D48]/30 bg-[#E11D48]/10 text-[#E11D48] hover:bg-[#E11D48]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + New Plan
          </button>

          <button
            onClick={() => setIsNewSubModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Subscription
          </button>
        </div>
      </div>

      {/* ─── High-Level Financial Metrics (KPIs) ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: MRR */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Monthly Recurring (MRR)
            </span>
            <DollarSign className="w-4 h-4 text-[#E11D48]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalMrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            +14.8% vs last month
          </div>
        </div>

        {/* Metric 2: ARR */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Annual Run Rate (ARR)
            </span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalArr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-ink-muted dark:text-neutral-400 font-medium">
            Based on active contracts
          </p>
        </div>

        {/* Metric 3: Active Subscriptions */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Active Accounts
            </span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink dark:text-white font-mono">
            {metrics.activeCount} <span className="text-xs font-normal text-neutral-400">({metrics.trialCount} on trial)</span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-neutral-400">
            Avg. ARPU: ${metrics.arpu.toFixed(0)}/account
          </p>
        </div>

        {/* Metric 4: Past Due Alerts */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Overdue / Attention
            </span>
            <AlertCircle className={`w-4 h-4 ${metrics.pastDueCount > 0 ? 'text-rose-500' : 'text-neutral-400'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-mono ${metrics.pastDueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-ink dark:text-white'}`}>
            {metrics.pastDueCount}
          </div>
          <p className="text-[11px] text-ink-muted dark:text-neutral-400">
            {metrics.pastDueCount > 0 ? 'Requires dunning follow-up' : 'All accounts healthy'}
          </p>
        </div>
      </div>

      {/* ─── Main Sub-Navigation Tabs ────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'subscriptions'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Customer Subscriptions
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'subscriptions' ? 'bg-white/25 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          }`}>
            {subscriptions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'plans'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Pricing Plans &amp; Tiers
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'plans' ? 'bg-white/25 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          }`}>
            {plans.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Recurring Invoices
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'invoices' ? 'bg-white/25 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          }`}>
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Growth &amp; Retention
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: CUSTOMER SUBSCRIPTIONS                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Controls Bar: Search & Status Pills */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/40">
            {/* Status Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['all', 'active', 'trial', 'past due', 'paused', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30 font-bold'
                      : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Billing Cycle Filter + Search Box */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={cycleFilter}
                onChange={(e) => setCycleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="all">All Cycles</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>

              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer, ID, plan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Customer &amp; Contact</th>
                  <th className="py-3 px-4">Plan &amp; Cycle</th>
                  <th className="py-3 px-4">Renewal Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">MRR / Charge</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-sm">No matching subscriptions found</p>
                      <p className="text-xs mt-0.5">Try adjusting your search query or filter pills.</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedSub(s)}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#E11D48] flex items-center gap-1.5">
                          {s.id}
                        </span>
                        <span className="text-[10px] text-ink-muted dark:text-neutral-500 block">
                          Since {s.startDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-ink dark:text-white leading-tight">{s.customer}</p>
                        <p className="text-[11px] text-ink-muted dark:text-neutral-400 font-mono mt-0.5">{s.email}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-ink dark:text-neutral-200">{s.planName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                            {s.billingCycle}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-300">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span>{s.renewalDate}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-ink-muted dark:text-neutral-400 text-[11px] flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-neutral-400" />
                          {s.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            s.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                              : s.status === 'Trial'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
                              : s.status === 'Past Due'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                              : s.status === 'Paused'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                              : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/25'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {s.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-bold text-ink dark:text-white">
                          ${s.mrr.toFixed(2)}<span className="text-[10px] text-neutral-400 font-normal">/mo</span>
                        </div>
                        {s.billingCycle !== 'Monthly' && (
                          <div className="text-[10px] text-ink-muted dark:text-neutral-500">
                            (${s.amount.toFixed(0)} / {s.billingCycle})
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedSub(s)}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-ink dark:hover:text-white"
                            title="View Subscription Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {s.status === 'Past Due' ? (
                            <button
                              onClick={() => handleSendReminder(s)}
                              className="px-2 py-1 text-[10px] font-bold rounded bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 transition-colors"
                              title="Send Reminder"
                            >
                              Remind
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTogglePause(s.id)}
                              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-ink dark:hover:text-white"
                              title={s.status === 'Paused' ? 'Resume Subscription' : 'Pause Subscription'}
                            >
                              {s.status === 'Paused' ? <RefreshCw className="w-4 h-4 text-emerald-500" /> : <PauseCircle className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: PRICING PLANS & TIERS CATALOG                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Top Controls: Monthly / Annual Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27]">
            <div>
              <h2 className="text-base font-bold text-ink dark:text-white">Active Plan Tiers</h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Define the tiers your customers can subscribe to with limits and feature sets.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl border border-border dark:border-[#2A2B27]">
              <button
                onClick={() => setPricingCycleView('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  pricingCycleView === 'monthly'
                    ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Monthly Rate
              </button>
              <button
                onClick={() => setPricingCycleView('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  pricingCycleView === 'annual'
                    ? 'bg-white dark:bg-[#1A1B18] text-ink dark:text-white shadow-xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Annual Rate
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  Save ~15%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p) => {
              const activeSubscribers = subscriptions.filter(
                (s) => s.planId === p.id && (s.status === 'Active' || s.status === 'Trial')
              ).length;
              const displayPrice = pricingCycleView === 'monthly' ? p.monthlyPrice : p.annualPrice;

              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl bg-white dark:bg-[#1A1B18] border p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                    p.popular
                      ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                      : 'border-border dark:border-[#2A2B27]'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {p.badge || 'Most Popular'}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-ink dark:text-white">{p.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                        {p.maxUsers}
                      </span>
                    </div>

                    <p className="text-xs text-ink-muted dark:text-neutral-400 leading-relaxed min-h-[36px]">
                      {p.tagline}
                    </p>

                    <div className="pt-2 border-t border-border dark:border-[#2A2B27]">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-3xl font-black text-ink dark:text-white">
                          ${displayPrice}
                        </span>
                        <span className="text-xs text-ink-muted dark:text-neutral-400">
                          / month {pricingCycleView === 'annual' && '(billed annually)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {activeSubscribers} active {activeSubscribers === 1 ? 'business' : 'businesses'} enrolled
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="pt-3 space-y-2">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-ink-muted dark:text-neutral-500 block">
                        Included Modules &amp; Perks:
                      </span>
                      <ul className="space-y-2 text-xs">
                        {p.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-ink-muted dark:text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-[#E11D48] flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border dark:border-[#2A2B27] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        showToast(`Plan ${p.name} configuration opened for editing`, 'info');
                      }}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-ink dark:text-neutral-200 transition-colors text-center cursor-pointer"
                    >
                      Edit Tier
                    </button>
                    <button
                      onClick={() => {
                        setIsNewSubModalOpen(true);
                      }}
                      className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white transition-colors text-center cursor-pointer shadow-2xs"
                    >
                      Assign Client
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: RECURRING INVOICES & BILLING HISTORY                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/40">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Recurring Invoice History</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Invoices generated automatically by customer renewal dates.
              </p>
            </div>
            <div className="text-xs font-mono text-ink-muted dark:text-neutral-400">
              Total Recorded: <span className="font-bold text-ink dark:text-white">${invoices.reduce((a, c) => a + c.amount, 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Billed Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-ink dark:text-white">{inv.id}</td>
                    <td className="py-3.5 px-4 font-mono text-[#E11D48] font-semibold">{inv.subscriptionId}</td>
                    <td className="py-3.5 px-4 font-semibold text-ink dark:text-white">{inv.customer}</td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{inv.date}</td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{inv.paymentMethod}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-ink dark:text-white">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : inv.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {inv.status === 'Failed' ? (
                        <button
                          onClick={() => handleMarkInvoicePaid(inv.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          Retry / Mark Paid
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Receipt emailed for ${inv.id}`, 'success')}
                          className="px-2.5 py-1 rounded border border-border dark:border-[#2A2B27] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-[10px] transition-colors cursor-pointer"
                        >
                          Send Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 4: GROWTH & RETENTION ANALYTICS                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Distribution Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] space-y-4">
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E11D48]" />
              MRR Breakdown by Plan Tier
            </h3>
            <div className="space-y-3 pt-2">
              {plans.map((p) => {
                const subsForPlan = subscriptions.filter(
                  (s) => s.planId === p.id && (s.status === 'Active' || s.status === 'Trial')
                );
                const planMrr = subsForPlan.reduce((a, c) => a + c.mrr, 0);
                const percent = metrics.totalMrr > 0 ? (planMrr / metrics.totalMrr) * 100 : 0;

                return (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink dark:text-neutral-200">{p.name}</span>
                      <span className="font-mono font-bold text-ink dark:text-white">
                        ${planMrr.toFixed(2)} ({percent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#E11D48] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retention & Dunning Health */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] space-y-4">
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Retention &amp; Subscription Health
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Churn Rate</span>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">0.8%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Below industry 3% target</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Trial Conversion</span>
                <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">68.4%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Trials converting to paid</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Renewal Success</span>
                <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">98.2%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Automated auto-charge rate</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Annual Plan Ratio</span>
                <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">33.3%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">High upfront retention</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE NEW SUBSCRIPTION                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isNewSubModalOpen && (
        <CreateSubscriptionModal
          plans={plans}
          onClose={() => setIsNewSubModalOpen(false)}
          onCreated={(newSub) => {
            setSubscriptions((prev) => [newSub, ...prev]);
            // Generate corresponding invoice
            setInvoices((prev) => [
              {
                id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                subscriptionId: newSub.id,
                customer: newSub.customer,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                amount: newSub.amount,
                paymentMethod: newSub.paymentMethod,
                status: newSub.status === 'Trial' ? 'Pending' : 'Paid',
              },
              ...prev,
            ]);
            setIsNewSubModalOpen(false);
            showToast(`Subscription ${newSub.id} for ${newSub.customer} created successfully!`, 'success');
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE NEW PLAN                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isNewPlanModalOpen && (
        <CreatePlanModal
          onClose={() => setIsNewPlanModalOpen(false)}
          onCreated={(newPlan) => {
            setPlans((prev) => [...prev, newPlan]);
            setIsNewPlanModalOpen(false);
            showToast(`New tier "${newPlan.name}" added to pricing catalog!`, 'success');
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL / DRAWER: SUBSCRIPTION DETAILS                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {selectedSub && (
        <SubscriptionDetailsModal
          sub={selectedSub}
          plans={plans}
          onClose={() => setSelectedSub(null)}
          onTogglePause={() => handleTogglePause(selectedSub.id)}
          onCancel={() => handleCancelSubscription(selectedSub.id)}
          onSendReminder={() => handleSendReminder(selectedSub)}
          onUpdatePlan={(newPlanId) => {
            const planObj = plans.find((p) => p.id === newPlanId);
            if (!planObj) return;
            const newMrr = selectedSub.billingCycle === 'Annual' ? planObj.annualPrice : planObj.monthlyPrice;
            const newAmount = selectedSub.billingCycle === 'Annual' ? newMrr * 12 : newMrr;

            setSubscriptions((prev) =>
              prev.map((s) =>
                s.id === selectedSub.id
                  ? { ...s, planId: newPlanId, planName: planObj.name, mrr: newMrr, amount: newAmount }
                  : s
              )
            );
            setSelectedSub((prev) =>
              prev ? { ...prev, planId: newPlanId, planName: planObj.name, mrr: newMrr, amount: newAmount } : null
            );
            showToast(`Upgraded subscription to ${planObj.name}`, 'success');
          }}
        />
      )}
    </div>
  );
}

// ─── Sub-Component: Create Subscription Modal ───────────────────────────────

function CreateSubscriptionModal({
  plans,
  onClose,
  onCreated,
}: {
  plans: PlanTier[];
  onClose: () => void;
  onCreated: (sub: Subscription) => void;
}) {
  const [customer, setCustomer] = useState('');
  const [email, setEmail] = useState('');
  const [planId, setPlanId] = useState(plans[0]?.id || 'plan-starter');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [isTrial, setIsTrial] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Instant Online)');
  const [autoRenew, setAutoRenew] = useState(true);

  const fallbackPlan: PlanTier = {
    id: 'plan-starter',
    name: 'Starter Pack',
    tagline: 'Standard tier',
    monthlyPrice: 89,
    annualPrice: 75,
    features: [],
    maxUsers: '3 seats',
    active: true,
  };
  const selectedPlan: PlanTier = plans.find((p) => p.id === planId) || plans[0] || fallbackPlan;

  const calculatedMrr = useMemo(() => {
    if (!selectedPlan) return 0;
    if (billingCycle === 'Annual') return selectedPlan.annualPrice;
    if (billingCycle === 'Quarterly') return Math.round(selectedPlan.monthlyPrice * 0.95);
    return selectedPlan.monthlyPrice;
  }, [selectedPlan, billingCycle]);

  const totalCharge = useMemo(() => {
    if (billingCycle === 'Annual') return calculatedMrr * 12;
    if (billingCycle === 'Quarterly') return calculatedMrr * 3;
    return calculatedMrr;
  }, [calculatedMrr, billingCycle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !email.trim()) return;

    const subId = `SUB-${Math.floor(800 + Math.random() * 199)}`;
    const now = new Date();
    const startDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const renewDate = new Date();
    if (isTrial) {
      renewDate.setDate(now.getDate() + 14);
    } else if (billingCycle === 'Annual') {
      renewDate.setFullYear(now.getFullYear() + 1);
    } else if (billingCycle === 'Quarterly') {
      renewDate.setMonth(now.getMonth() + 3);
    } else {
      renewDate.setMonth(now.getMonth() + 1);
    }
    const renewalDate = renewDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    onCreated({
      id: subId,
      customer: customer.trim(),
      email: email.trim(),
      planId,
      planName: selectedPlan.name,
      billingCycle,
      mrr: calculatedMrr,
      amount: isTrial ? 0 : totalCharge,
      startDate,
      renewalDate,
      status: isTrial ? 'Trial' : 'Active',
      paymentMethod,
      autoRenew,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl max-w-lg w-full border border-border dark:border-[#2A2B27] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-5 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#E11D48]" />
            <h3 className="text-base font-bold text-ink dark:text-white">New Customer Subscription</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Customer or Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Blue River Bakery"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Billing Email *
            </label>
            <input
              type="email"
              required
              placeholder="billing@blueriver.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Select Plan Tier
              </label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.monthlyPrice}/mo)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Billing Frequency
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as 'Monthly' | 'Quarterly' | 'Annual')}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly (-5%)</option>
                <option value="Annual">Annual (-15%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
            >
              <option value="Credit Card (Visa ending in 4242)">Credit Card (Visa •• 4242)</option>
              <option value="Direct ACH Bank Transfer">Direct ACH Bank Transfer</option>
              <option value="Manual Monthly Invoice">Manual Monthly Invoice</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink dark:text-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isTrial}
                onChange={(e) => setIsTrial(e.target.checked)}
                className="rounded accent-[#E11D48]"
              />
              Start with 14-day Free Trial
            </label>
            <span className="text-[10px] font-mono text-neutral-400">Card on file</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink dark:text-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="rounded accent-[#E11D48]"
              />
              Auto-renew subscription at end of billing cycle
            </label>
          </div>

          {/* Pricing Preview Summary */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex justify-between text-xs text-ink-muted dark:text-neutral-400">
              <span>Monthly Run Rate (MRR):</span>
              <span className="font-mono font-bold text-ink dark:text-white">${calculatedMrr.toFixed(2)}/mo</span>
            </div>
            <div className="flex justify-between text-xs text-ink-muted dark:text-neutral-400">
              <span>First Period Charge:</span>
              <span className="font-mono font-bold text-[#E11D48] text-sm">
                {isTrial ? '$0.00 (Trial)' : `$${totalCharge.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs"
            >
              Create Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-Component: Create Plan Modal ───────────────────────────────────────

function CreatePlanModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (plan: PlanTier) => void;
}) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState(149);
  const [annualPrice, setAnnualPrice] = useState(125);
  const [maxUsers, setMaxUsers] = useState('Up to 10 team members');
  const [featuresStr, setFeaturesStr] = useState('Full CRM, Sales Quotes, Inventory, Automated Invoicing, Live Chat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `plan-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const features = featuresStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    onCreated({
      id: newId,
      name: name.trim(),
      tagline: tagline.trim() || 'Custom business tier tailored for operations.',
      monthlyPrice: Number(monthlyPrice),
      annualPrice: Number(annualPrice),
      maxUsers,
      features,
      active: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl max-w-lg w-full border border-border dark:border-[#2A2B27] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-5 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E11D48]" />
            <h3 className="text-base font-bold text-ink dark:text-white">Create New Plan Tier</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Plan Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Professional Scale"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Short Description / Tagline
            </label>
            <input
              type="text"
              placeholder="e.g. Best for growing wholesale distributors."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Monthly Price ($/mo)
              </label>
              <input
                type="number"
                min="0"
                required
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Annual Price ($/mo billed yr)
              </label>
              <input
                type="number"
                min="0"
                required
                value={annualPrice}
                onChange={(e) => setAnnualPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Team Member Limit / Seats
            </label>
            <input
              type="text"
              placeholder="e.g. Up to 10 team members"
              value={maxUsers}
              onChange={(e) => setMaxUsers(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Included Features (comma-separated)
            </label>
            <textarea
              rows={3}
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              placeholder="Feature 1, Feature 2, Feature 3"
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-Component: Subscription Details Modal ──────────────────────────────

function SubscriptionDetailsModal({
  sub,
  plans,
  onClose,
  onTogglePause,
  onCancel,
  onSendReminder,
  onUpdatePlan,
}: {
  sub: Subscription;
  plans: PlanTier[];
  onClose: () => void;
  onTogglePause: () => void;
  onCancel: () => void;
  onSendReminder: () => void;
  onUpdatePlan: (planId: string) => void;
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(sub.planId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl max-w-xl w-full border border-border dark:border-[#2A2B27] shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#E11D48] text-sm">{sub.id}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  sub.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : sub.status === 'Trial'
                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    : sub.status === 'Past Due'
                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    : 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20'
                }`}
              >
                {sub.status}
              </span>
            </div>
            <h3 className="text-lg font-black text-ink dark:text-white mt-1">{sub.customer}</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Billing Email</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block truncate">{sub.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Billing Cycle</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block">{sub.billingCycle}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Payment Method</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block">{sub.paymentMethod}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Next Renewal</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block">{sub.renewalDate}</span>
            </div>
          </div>

          {/* Plan Change Section */}
          <div className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] space-y-2">
            <span className="text-xs font-bold text-ink dark:text-white block">Change Customer Plan Tier</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-neutral-900 text-ink dark:text-white"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.monthlyPrice}/mo
                  </option>
                ))}
              </select>
              <button
                disabled={selectedPlanId === sub.planId}
                onClick={() => onUpdatePlan(selectedPlanId)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-[#E11D48] text-white disabled:opacity-40 hover:bg-[#BE123C] cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePause}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-ink dark:text-neutral-200 transition-colors cursor-pointer"
              >
                {sub.status === 'Paused' ? 'Resume Subscription' : 'Pause Subscription'}
              </button>
              {sub.status === 'Past Due' && (
                <button
                  onClick={onSendReminder}
                  className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  Send Payment Reminder
                </button>
              )}
            </div>

            {sub.status !== 'Cancelled' && (
              <button
                onClick={onCancel}
                className="px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
