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
  Package,
  Wrench,
  Clock,
  Truck,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'Scheduled Service & Maintenance'
  | 'Physical Goods & Replenishment'
  | 'Professional Retainers & Hours'
  | 'Memberships & Facility Passes';

export interface CompanyPlanTier {
  id: string;
  name: string;
  productLine: string;
  category: ProductCategory;
  description: string;
  billingFrequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  unitPrice: number;
  setupFee?: number;
  trialDays?: number;
  deliverables: string[];
  active: boolean;
  badge?: string;
  popular?: boolean;
}

export interface CustomerSubscription {
  id: string;
  customer: string;
  email: string;
  phone: string;
  planId: string;
  planName: string;
  productLine: string;
  category: ProductCategory;
  quantity: number;
  billingCycle: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  unitPrice: number;
  mrr: number;
  cycleAmount: number;
  startDate: string;
  nextRenewalDate: string;
  nextFulfillmentDate: string; // e.g. next delivery or scheduled maintenance visit
  status: 'Active' | 'Trial' | 'Past Due' | 'Paused' | 'Cancelled';
  paymentMethod: string;
  specialInstructions?: string;
  autoRenew: boolean;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  customer: string;
  productLine: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

// ─── Initial Seed Data: Company Products & Services Offered ──────────────────

const initialPlans: CompanyPlanTier[] = [
  {
    id: 'plan-hvac-maint',
    name: 'Commercial Preventive Maintenance Plan',
    productLine: 'Facility & Equipment Maintenance',
    category: 'Scheduled Service & Maintenance',
    description: 'Scheduled monthly inspections, filter replacements, and prioritized technician dispatch for client facilities.',
    billingFrequency: 'Monthly',
    unitPrice: 350.0,
    setupFee: 150.0,
    popular: true,
    badge: 'Popular Service',
    deliverables: [
      'Monthly on-site equipment inspection & calibration',
      'Consumables & standard filter replacements included',
      'Priority emergency call-out dispatch (< 2 hours)',
      '15% client discount on extra replacement parts',
      'Digital service logs & compliance certificates',
    ],
    active: true,
  },
  {
    id: 'plan-coffee-roast',
    name: 'Artisan Whole-Bean Coffee Subscription',
    productLine: 'Specialty Roasted Coffee Beans',
    category: 'Physical Goods & Replenishment',
    description: 'Freshly roasted single-origin batches delivered every 2 weeks to corporate offices, cafes, and restaurants.',
    billingFrequency: 'Monthly',
    unitPrice: 75.0,
    setupFee: 0.0,
    badge: 'Replenishment',
    deliverables: [
      '2kg freshly roasted single-origin bags per delivery',
      'Dispatched bi-weekly on Tuesdays directly from roastery',
      'Free regional temperature-controlled courier delivery',
      'Tasting notes and brewing profile cards with every box',
      'Flexible skip, pause, or grind size adjustments',
    ],
    active: true,
  },
  {
    id: 'plan-it-retainer',
    name: 'Dedicated IT Support & Server Retainer',
    productLine: 'Managed IT & Cloud Infrastructure',
    category: 'Professional Retainers & Hours',
    description: 'Guaranteed monthly technical retainer providing proactive server monitoring, cybersecurity, and helpdesk support.',
    billingFrequency: 'Monthly',
    unitPrice: 850.0,
    setupFee: 300.0,
    deliverables: [
      'Up to 30 hours of dedicated remote & on-site IT support',
      '24/7 cloud server uptime monitoring & automated failover',
      'Weekly automated offsite backup verification',
      'Guaranteed 30-minute SLA response for critical outages',
      'Monthly security vulnerability audit & report',
    ],
    active: true,
  },
  {
    id: 'plan-wellness-pass',
    name: 'Corporate Wellness & Facility Access',
    productLine: 'Health & Wellness Club Membership',
    category: 'Memberships & Facility Passes',
    description: 'Tiered monthly corporate wellness pass providing company employees full facility and training access.',
    billingFrequency: 'Monthly',
    unitPrice: 120.0,
    setupFee: 25.0,
    deliverables: [
      'Full unrestricted facility, pool & studio access',
      '2 complimentary personal coaching sessions per month',
      'Access to wellness workshops and nutrition seminars',
      'Guest passes (2 per month for clients or colleagues)',
    ],
    active: true,
  },
];

const initialSubscriptions: CustomerSubscription[] = [
  {
    id: 'SUB-101',
    customer: 'Apex Logistics Hub',
    email: 'ops@apexlogistics.com',
    phone: '+1 (555) 234-5678',
    planId: 'plan-hvac-maint',
    planName: 'Commercial Preventive Maintenance Plan',
    productLine: 'Facility & Equipment Maintenance',
    category: 'Scheduled Service & Maintenance',
    quantity: 2, // 2 facility units
    billingCycle: 'Monthly',
    unitPrice: 350.0,
    mrr: 700.0,
    cycleAmount: 700.0,
    startDate: 'Mar 15, 2026',
    nextRenewalDate: 'Nov 15, 2026',
    nextFulfillmentDate: 'Nov 10, 2026 (Monthly Inspection Visit)',
    status: 'Active',
    paymentMethod: 'Corporate ACH Bank Direct',
    specialInstructions: 'Technicians must check in at Security Gate B before entering warehouse roof.',
    autoRenew: true,
  },
  {
    id: 'SUB-102',
    customer: 'Green Garden Cafe',
    email: 'orders@greengarden.cafe',
    phone: '+1 (555) 345-6789',
    planId: 'plan-coffee-roast',
    planName: 'Artisan Whole-Bean Coffee Subscription',
    productLine: 'Specialty Roasted Coffee Beans',
    category: 'Physical Goods & Replenishment',
    quantity: 3, // 3 x 2kg
    billingCycle: 'Monthly',
    unitPrice: 75.0,
    mrr: 225.0,
    cycleAmount: 225.0,
    startDate: 'May 04, 2026',
    nextRenewalDate: 'Nov 04, 2026',
    nextFulfillmentDate: 'Nov 08, 2026 (Bi-Weekly Bean Delivery)',
    status: 'Active',
    paymentMethod: 'Visa •• 4821',
    specialInstructions: 'Deliver to rear kitchen entrance between 7:00 AM - 8:30 AM.',
    autoRenew: true,
  },
  {
    id: 'SUB-103',
    customer: 'Nordic Warehouses Ltd',
    email: 'finance@nordicstorage.se',
    phone: '+46 8 123 4567',
    planId: 'plan-it-retainer',
    planName: 'Dedicated IT Support & Server Retainer',
    productLine: 'Managed IT & Cloud Infrastructure',
    category: 'Professional Retainers & Hours',
    quantity: 1,
    billingCycle: 'Annual',
    unitPrice: 850.0,
    mrr: 720.0, // Discounted annual rate
    cycleAmount: 8640.0,
    startDate: 'Jan 15, 2026',
    nextRenewalDate: 'Jan 15, 2027',
    nextFulfillmentDate: 'Nov 14, 2026 (Quarterly Firewall Audit)',
    status: 'Active',
    paymentMethod: 'Wire Transfer / Net-30',
    specialInstructions: 'Primary technical point of contact: Anders Blom (IT Lead).',
    autoRenew: true,
  },
  {
    id: 'SUB-104',
    customer: 'Summit Medical Clinic',
    email: 'director@summithealth.org',
    phone: '+1 (555) 890-1234',
    planId: 'plan-hvac-maint',
    planName: 'Commercial Preventive Maintenance Plan',
    productLine: 'Facility & Equipment Maintenance',
    category: 'Scheduled Service & Maintenance',
    quantity: 1,
    billingCycle: 'Monthly',
    unitPrice: 350.0,
    mrr: 350.0,
    cycleAmount: 350.0,
    startDate: 'Jul 20, 2026',
    nextRenewalDate: 'Oct 30, 2026',
    nextFulfillmentDate: 'Oct 28, 2026 (Sterilization HVAC Check)',
    status: 'Past Due',
    paymentMethod: 'Mastercard •• 1004',
    specialInstructions: 'Requires HEPA filter certifications signed after each maintenance visit.',
    autoRenew: true,
  },
  {
    id: 'SUB-105',
    customer: 'Highland Boutique Hotel',
    email: 'concierge@highlandstay.com',
    phone: '+1 (555) 678-9012',
    planId: 'plan-coffee-roast',
    planName: 'Artisan Whole-Bean Coffee Subscription',
    productLine: 'Specialty Roasted Coffee Beans',
    category: 'Physical Goods & Replenishment',
    quantity: 2,
    billingCycle: 'Monthly',
    unitPrice: 75.0,
    mrr: 150.0,
    cycleAmount: 150.0,
    startDate: 'Oct 20, 2026',
    nextRenewalDate: 'Nov 20, 2026',
    nextFulfillmentDate: 'Nov 05, 2026 (First Trial Delivery Crate)',
    status: 'Trial',
    paymentMethod: 'Trial (Card Authorized)',
    specialInstructions: 'Send 1 bag medium roast + 1 bag dark roast in welcome package.',
    autoRenew: true,
  },
  {
    id: 'SUB-106',
    customer: 'Harbor Marine Electronics',
    email: 'accounts@harbormarine.co',
    phone: '+1 (555) 432-1098',
    planId: 'plan-it-retainer',
    planName: 'Dedicated IT Support & Server Retainer',
    productLine: 'Managed IT & Cloud Infrastructure',
    category: 'Professional Retainers & Hours',
    quantity: 1,
    billingCycle: 'Quarterly',
    unitPrice: 850.0,
    mrr: 800.0,
    cycleAmount: 2400.0,
    startDate: 'Feb 10, 2026',
    nextRenewalDate: 'Dec 10, 2026',
    nextFulfillmentDate: 'Scheduled Paused (Winter Seasonal Break)',
    status: 'Paused',
    paymentMethod: 'Visa •• 3319',
    specialInstructions: 'Seasonal client. Auto-resumes in spring March 2027.',
    autoRenew: false,
  },
];

const initialInvoices: SubscriptionInvoice[] = [
  {
    id: 'INV-2026-801',
    subscriptionId: 'SUB-101',
    customer: 'Apex Logistics Hub',
    productLine: 'Facility & Equipment Maintenance',
    date: 'Oct 15, 2026',
    amount: 700.0,
    paymentMethod: 'Corporate ACH',
    status: 'Paid',
  },
  {
    id: 'INV-2026-802',
    subscriptionId: 'SUB-102',
    customer: 'Green Garden Cafe',
    productLine: 'Specialty Roasted Coffee Beans',
    date: 'Oct 04, 2026',
    amount: 225.0,
    paymentMethod: 'Visa •• 4821',
    status: 'Paid',
  },
  {
    id: 'INV-2026-803',
    subscriptionId: 'SUB-103',
    customer: 'Nordic Warehouses Ltd',
    productLine: 'Managed IT & Cloud Infrastructure',
    date: 'Jan 15, 2026',
    amount: 8640.0,
    paymentMethod: 'Wire Transfer',
    status: 'Paid',
  },
  {
    id: 'INV-2026-804',
    subscriptionId: 'SUB-104',
    customer: 'Summit Medical Clinic',
    productLine: 'Facility & Equipment Maintenance',
    date: 'Oct 30, 2026',
    amount: 350.0,
    paymentMethod: 'Mastercard •• 1004',
    status: 'Failed',
  },
  {
    id: 'INV-2026-805',
    subscriptionId: 'SUB-106',
    customer: 'Harbor Marine Electronics',
    productLine: 'Managed IT & Cloud Infrastructure',
    date: 'Sep 10, 2026',
    amount: 2400.0,
    paymentMethod: 'Visa •• 3319',
    status: 'Paid',
  },
];

export default function SubscriptionsPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'subscribers' | 'plans' | 'invoices' | 'growth'>('subscribers');

  // State
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>(initialSubscriptions);
  const [plans, setPlans] = useState<CompanyPlanTier[]>(initialPlans);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>(initialInvoices);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals & Drawers
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<CustomerSubscription | null>(null);

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
      const matchCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchSearch =
        s.customer.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.planName.toLowerCase().includes(search.toLowerCase()) ||
        s.productLine.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchCategory && matchSearch;
    });
  }, [subscriptions, statusFilter, categoryFilter, search]);

  // ─── Financial & Product Metrics ───────────────────────────────────────────
  const metrics = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === 'Active' || s.status === 'Trial');
    const totalMrr = activeSubs.reduce((acc, curr) => acc + curr.mrr, 0);
    const totalArr = totalMrr * 12;
    const activeSubscribers = subscriptions.filter((s) => s.status === 'Active').length;
    const trialSubscribers = subscriptions.filter((s) => s.status === 'Trial').length;
    const pastDueCount = subscriptions.filter((s) => s.status === 'Past Due').length;
    const avgCustomerValue = activeSubs.length > 0 ? totalMrr / activeSubs.length : 0;

    return {
      totalMrr,
      totalArr,
      activeSubscribers,
      trialSubscribers,
      pastDueCount,
      avgCustomerValue,
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

  const handleLogFulfillment = (sub: CustomerSubscription) => {
    showToast(`Service / Delivery logged for ${sub.customer}. Customer notified.`, 'success');
  };

  const handleSendReminder = (sub: CustomerSubscription) => {
    showToast(`Payment reminder dispatched to ${sub.email}`, 'success');
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
    showToast(`Invoice ${invId} marked as Paid. Customer subscription reinstated to Active.`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Subscription ID', 'Customer', 'Product Line', 'Plan Name', 'Qty', 'Billing Cycle', 'MRR ($)', 'Next Fulfillment', 'Status'];
    const rows = filteredSubscriptions.map((s) => [
      s.id,
      `"${s.customer}"`,
      `"${s.productLine}"`,
      `"${s.planName}"`,
      s.quantity,
      s.billingCycle,
      s.mrr.toFixed(2),
      `"${s.nextFulfillmentDate}"`,
      s.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `company_product_subscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer subscriptions exported to CSV', 'success');
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
              Product &amp; Service Subscriptions
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-2 py-0.5 rounded">
              Your Company Offerings
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-Billing Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight flex items-center gap-3">
            Subscriptions &amp; Plans
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl">
            Configure subscription tiers for your company&apos;s products and services, enroll client accounts, schedule recurring fulfillments, and track predictable cash flow.
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
            + New Product Plan
          </button>

          <button
            onClick={() => setIsNewSubModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Enroll Subscriber
          </button>
        </div>
      </div>

      {/* ─── Financial & Product Recurring Revenue KPIs ─────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: MRR */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Product Recurring (MRR)
            </span>
            <DollarSign className="w-4 h-4 text-[#E11D48]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalMrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" />
            +18.5% recurring growth
          </div>
        </div>

        {/* Metric 2: ARR */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Annual Recurring (ARR)
            </span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalArr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-ink-muted dark:text-neutral-400 font-medium">
            From active client contracts
          </p>
        </div>

        {/* Metric 3: Active Subscribers */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Enrolled Subscribers
            </span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-ink dark:text-white font-mono">
            {metrics.activeSubscribers} <span className="text-xs font-normal text-neutral-400">({metrics.trialSubscribers} trial)</span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-neutral-400">
            Avg. Account: ${metrics.avgCustomerValue.toFixed(0)}/mo
          </p>
        </div>

        {/* Metric 4: Past Due / Attention */}
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-4 sm:p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Overdue Payments
            </span>
            <AlertCircle className={`w-4 h-4 ${metrics.pastDueCount > 0 ? 'text-rose-500' : 'text-neutral-400'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-mono ${metrics.pastDueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-ink dark:text-white'}`}>
            {metrics.pastDueCount}
          </div>
          <p className="text-[11px] text-ink-muted dark:text-neutral-400">
            {metrics.pastDueCount > 0 ? 'Service hold warning sent' : 'All subscriptions current'}
          </p>
        </div>
      </div>

      {/* ─── Main Sub-Navigation Tabs ────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'subscribers'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Customer Subscribers
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'subscribers' ? 'bg-white/25 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
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
          Company Product Plans
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
          Recurring Client Invoices
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            activeTab === 'invoices' ? 'bg-white/25 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          }`}>
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('growth')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'growth'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Product Revenue Analytics
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: CUSTOMER SUBSCRIBERS TABLE                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'subscribers' && (
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

            {/* Product Category Filter & Search Box */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="all">All Product Categories</option>
                <option value="Scheduled Service & Maintenance">Scheduled Service & Maintenance</option>
                <option value="Physical Goods & Replenishment">Physical Goods & Replenishment</option>
                <option value="Professional Retainers & Hours">Professional Retainers & Hours</option>
                <option value="Memberships & Facility Passes">Memberships & Facility Passes</option>
              </select>

              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search client, product, ID..."
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
                  <th className="py-3 px-4">Client Customer</th>
                  <th className="py-3 px-4">Product Line &amp; Plan</th>
                  <th className="py-3 px-4">Next Scheduled Fulfillment</th>
                  <th className="py-3 px-4">Renewal Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">MRR Value</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-sm">No matching subscriptions found</p>
                      <p className="text-xs mt-0.5">Try adjusting your category filter or search keywords.</p>
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
                          Enrolled {s.startDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-ink dark:text-white leading-tight">{s.customer}</p>
                        <p className="text-[11px] text-ink-muted dark:text-neutral-400 font-mono mt-0.5">{s.email}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-ink dark:text-neutral-200">{s.productLine}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-ink-muted dark:text-neutral-400">{s.planName}</span>
                            {s.quantity > 1 && (
                              <span className="text-[9px] font-mono px-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                ×{s.quantity} units
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-300">
                          {s.category === 'Physical Goods & Replenishment' ? (
                            <Truck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          ) : s.category === 'Scheduled Service & Maintenance' ? (
                            <Wrench className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          )}
                          <span className="truncate max-w-[200px]" title={s.nextFulfillmentDate}>
                            {s.nextFulfillmentDate}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-ink-muted dark:text-neutral-300">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          <span>{s.nextRenewalDate}</span>
                        </div>
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
                            (${s.cycleAmount.toFixed(0)} / {s.billingCycle})
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

                          <button
                            onClick={() => handleLogFulfillment(s)}
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Log Service or Delivery Fulfilled"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          {s.status === 'Past Due' ? (
                            <button
                              onClick={() => handleSendReminder(s)}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 transition-colors"
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
      {/* TAB 2: COMPANY PRODUCT PLANS & TIERS CATALOG                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27]">
            <div>
              <h2 className="text-base font-bold text-ink dark:text-white">Company Subscription Offerings</h2>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                The recurring products and service tiers your company sells to clients and subscribers.
              </p>
            </div>
            <button
              onClick={() => setIsNewPlanModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Product Plan Tier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((p) => {
              const activeSubscribers = subscriptions.filter(
                (s) => s.planId === p.id && (s.status === 'Active' || s.status === 'Trial')
              );
              const totalTierMrr = activeSubscribers.reduce((acc, curr) => acc + curr.mrr, 0);

              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl bg-white dark:bg-[#1A1B18] border p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
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

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 block w-fit mb-1.5">
                        {p.category}
                      </span>
                      <h3 className="text-base font-black text-ink dark:text-white leading-snug">{p.name}</h3>
                      <p className="text-[11px] font-semibold text-[#E11D48] mt-0.5">{p.productLine}</p>
                    </div>

                    <p className="text-xs text-ink-muted dark:text-neutral-400 leading-relaxed min-h-[36px]">
                      {p.description}
                    </p>

                    <div className="pt-2 border-t border-border dark:border-[#2A2B27]">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-2xl font-black text-ink dark:text-white">
                          ${p.unitPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-ink-muted dark:text-neutral-400">
                          / {p.billingFrequency.toLowerCase()}
                        </span>
                      </div>
                      {p.setupFee ? (
                        <p className="text-[10px] text-ink-muted dark:text-neutral-500 font-mono mt-0.5">
                          + ${p.setupFee} initial onboarding / setup fee
                        </p>
                      ) : null}
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        {activeSubscribers.length} clients enrolled (${totalTierMrr.toFixed(0)}/mo)
                      </p>
                    </div>

                    {/* Included Deliverables */}
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted dark:text-neutral-500 block">
                        Included Deliverables:
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {p.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-ink-muted dark:text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-[#E11D48] flex-shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-border dark:border-[#2A2B27] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        showToast(`Plan ${p.name} configuration opened for editing`, 'info');
                      }}
                      className="w-full py-2 px-2.5 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-ink dark:text-neutral-200 transition-colors text-center cursor-pointer"
                    >
                      Edit Offering
                    </button>
                    <button
                      onClick={() => {
                        setIsNewSubModalOpen(true);
                      }}
                      className="w-full py-2 px-2.5 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white transition-colors text-center cursor-pointer shadow-2xs"
                    >
                      Enroll Client
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: RECURRING INVOICES & REVENUE LEDGER                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/40">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Recurring Client Invoices</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Invoices generated automatically upon recurring renewal dates for company products &amp; services.
              </p>
            </div>
            <div className="text-xs font-mono text-ink-muted dark:text-neutral-400">
              Total Invoiced: <span className="font-bold text-ink dark:text-white">${invoices.reduce((a, c) => a + c.amount, 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Client Customer</th>
                  <th className="py-3 px-4">Product Line</th>
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
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300">{inv.productLine}</td>
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
                          onClick={() => showToast(`Receipt emailed to ${inv.customer} for ${inv.id}`, 'success')}
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
      {/* TAB 4: PRODUCT REVENUE & RETENTION ANALYTICS                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'growth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Distribution by Product Line */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] space-y-4">
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#E11D48]" />
              Recurring Revenue by Product / Service Line
            </h3>
            <div className="space-y-4 pt-2">
              {plans.map((p) => {
                const subsForPlan = subscriptions.filter(
                  (s) => s.planId === p.id && (s.status === 'Active' || s.status === 'Trial')
                );
                const planMrr = subsForPlan.reduce((a, c) => a + c.mrr, 0);
                const percent = metrics.totalMrr > 0 ? (planMrr / metrics.totalMrr) * 100 : 0;

                return (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-ink dark:text-neutral-200">{p.productLine}</span>
                        <span className="text-[10px] text-neutral-400 block">{p.name}</span>
                      </div>
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

          {/* Retention & Fulfillment Health */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] space-y-4">
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Contract Health &amp; Fulfillment Reliability
            </h3>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Client Churn Rate</span>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">0.4%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Extremely high retention</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">On-Time Fulfillment</span>
                <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1">99.1%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Dispatches delivered on date</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Auto-Charge Success</span>
                <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">98.2%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Automated recurring billing</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-400">Annual Subscriptions</span>
                <div className="text-2xl font-black font-mono text-ink dark:text-white mt-1">16.7%</div>
                <p className="text-[10px] text-ink-muted dark:text-neutral-500 mt-0.5">Upfront full-year clients</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: ENROLL CLIENT SUBSCRIBER                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isNewSubModalOpen && (
        <CreateSubscriberModal
          plans={plans}
          onClose={() => setIsNewSubModalOpen(false)}
          onCreated={(newSub) => {
            setSubscriptions((prev) => [newSub, ...prev]);
            setInvoices((prev) => [
              {
                id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                subscriptionId: newSub.id,
                customer: newSub.customer,
                productLine: newSub.productLine,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                amount: newSub.cycleAmount,
                paymentMethod: newSub.paymentMethod,
                status: newSub.status === 'Trial' ? 'Pending' : 'Paid',
              },
              ...prev,
            ]);
            setIsNewSubModalOpen(false);
            showToast(`Subscriber ${newSub.customer} enrolled in ${newSub.productLine}!`, 'success');
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE NEW PRODUCT PLAN                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isNewPlanModalOpen && (
        <CreateProductPlanModal
          onClose={() => setIsNewPlanModalOpen(false)}
          onCreated={(newPlan) => {
            setPlans((prev) => [...prev, newPlan]);
            setIsNewPlanModalOpen(false);
            showToast(`Product subscription plan "${newPlan.name}" created!`, 'success');
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL / DRAWER: SUBSCRIBER DETAILS                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {selectedSub && (
        <SubscriberDetailsModal
          sub={selectedSub}
          plans={plans}
          onClose={() => setSelectedSub(null)}
          onTogglePause={() => handleTogglePause(selectedSub.id)}
          onCancel={() => handleCancelSubscription(selectedSub.id)}
          onLogFulfillment={() => handleLogFulfillment(selectedSub)}
          onSendReminder={() => handleSendReminder(selectedSub)}
          onUpdatePlan={(newPlanId) => {
            const planObj = plans.find((p) => p.id === newPlanId);
            if (!planObj) return;
            const newMrr = selectedSub.billingCycle === 'Annual' ? planObj.unitPrice * 0.9 * selectedSub.quantity : planObj.unitPrice * selectedSub.quantity;
            const newAmount = selectedSub.billingCycle === 'Annual' ? newMrr * 12 : newMrr;

            setSubscriptions((prev) =>
              prev.map((s) =>
                s.id === selectedSub.id
                  ? {
                      ...s,
                      planId: newPlanId,
                      planName: planObj.name,
                      productLine: planObj.productLine,
                      category: planObj.category,
                      unitPrice: planObj.unitPrice,
                      mrr: newMrr,
                      cycleAmount: newAmount,
                    }
                  : s
              )
            );
            setSelectedSub((prev) =>
              prev
                ? {
                    ...prev,
                    planId: newPlanId,
                    planName: planObj.name,
                    productLine: planObj.productLine,
                    category: planObj.category,
                    unitPrice: planObj.unitPrice,
                    mrr: newMrr,
                    cycleAmount: newAmount,
                  }
                : null
            );
            showToast(`Customer plan updated to ${planObj.name}`, 'success');
          }}
        />
      )}
    </div>
  );
}

// ─── Sub-Component: Enroll Subscriber Modal ─────────────────────────────────

function CreateSubscriberModal({
  plans,
  onClose,
  onCreated,
}: {
  plans: CompanyPlanTier[];
  onClose: () => void;
  onCreated: (sub: CustomerSubscription) => void;
}) {
  const [customer, setCustomer] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState(plans[0]?.id || 'plan-hvac-maint');
  const [quantity, setQuantity] = useState(1);
  const [billingCycle, setBillingCycle] = useState<'Weekly' | 'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [isTrial, setIsTrial] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Auto-Charge');
  const [nextFulfillmentDate, setNextFulfillmentDate] = useState('Nov 15, 2026 (Scheduled Visit / Shipment)');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [autoRenew, setAutoRenew] = useState(true);

  const fallbackPlan: CompanyPlanTier = {
    id: 'plan-custom',
    name: 'Standard Product Tier',
    productLine: 'Company Product',
    category: 'Scheduled Service & Maintenance',
    description: 'Custom plan',
    billingFrequency: 'Monthly',
    unitPrice: 100,
    deliverables: [],
    active: true,
  };

  const selectedPlan: CompanyPlanTier = plans.find((p) => p.id === planId) || plans[0] || fallbackPlan;

  const calculatedMrr = useMemo(() => {
    const base = selectedPlan.unitPrice * quantity;
    if (billingCycle === 'Annual') return base * 0.9; // 10% annual discount
    if (billingCycle === 'Weekly') return base * 4.33;
    return base;
  }, [selectedPlan, quantity, billingCycle]);

  const totalCharge = useMemo(() => {
    if (billingCycle === 'Annual') return calculatedMrr * 12;
    if (billingCycle === 'Quarterly') return calculatedMrr * 3;
    if (billingCycle === 'Weekly') return selectedPlan.unitPrice * quantity;
    return calculatedMrr;
  }, [calculatedMrr, selectedPlan, quantity, billingCycle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !email.trim()) return;

    const subId = `SUB-${Math.floor(100 + Math.random() * 899)}`;
    const now = new Date();
    const startDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const renewDate = new Date();
    if (isTrial) {
      renewDate.setDate(now.getDate() + 14);
    } else if (billingCycle === 'Annual') {
      renewDate.setFullYear(now.getFullYear() + 1);
    } else if (billingCycle === 'Quarterly') {
      renewDate.setMonth(now.getMonth() + 3);
    } else if (billingCycle === 'Weekly') {
      renewDate.setDate(now.getDate() + 7);
    } else {
      renewDate.setMonth(now.getMonth() + 1);
    }
    const nextRenewalDate = renewDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    onCreated({
      id: subId,
      customer: customer.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      planId,
      planName: selectedPlan.name,
      productLine: selectedPlan.productLine,
      category: selectedPlan.category,
      quantity: Number(quantity),
      billingCycle,
      unitPrice: selectedPlan.unitPrice,
      mrr: calculatedMrr,
      cycleAmount: isTrial ? 0 : totalCharge,
      startDate,
      nextRenewalDate,
      nextFulfillmentDate: nextFulfillmentDate.trim() || 'Next week (Standard fulfillment)',
      status: isTrial ? 'Trial' : 'Active',
      paymentMethod,
      specialInstructions: specialInstructions.trim(),
      autoRenew,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl max-w-lg w-full border border-border dark:border-[#2A2B27] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-5 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#E11D48]" />
            <h3 className="text-base font-bold text-ink dark:text-white">Enroll Client in Product Subscription</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Client / Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Logistics Hub"
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
                placeholder="billing@apexlogistics.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Client Phone
              </label>
              <input
                type="text"
                placeholder="+1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
              />
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
                <option value="Credit Card / Auto-Charge">Credit Card / Auto-Charge</option>
                <option value="Corporate ACH Direct Debit">Corporate ACH Direct Debit</option>
                <option value="Invoice Net-30 / Wire">Invoice Net-30 / Wire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Select Company Product &amp; Plan Tier
            </label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productLine} — {p.name} (${p.unitPrice}/mo)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Quantity / Number of Units
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Billing Frequency
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual')}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual (10% Discount)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Next Scheduled Service or Delivery Dispatch
            </label>
            <input
              type="text"
              placeholder="e.g. Nov 15, 2026 (Monthly Inspection Visit)"
              value={nextFulfillmentDate}
              onChange={(e) => setNextFulfillmentDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Customer Special Delivery / Service Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Roof access via Gate B; deliver after 8 AM"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink dark:text-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isTrial}
                onChange={(e) => setIsTrial(e.target.checked)}
                className="rounded accent-[#E11D48]"
              />
              Complimentary Trial Period (14 days)
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink dark:text-neutral-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="rounded accent-[#E11D48]"
              />
              Auto-renew subscription each period
            </label>
          </div>

          {/* Pricing Preview Summary */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-1">
            <div className="flex justify-between text-xs text-ink-muted dark:text-neutral-400">
              <span>Calculated MRR:</span>
              <span className="font-mono font-bold text-ink dark:text-white">${calculatedMrr.toFixed(2)}/mo</span>
            </div>
            <div className="flex justify-between text-xs text-ink-muted dark:text-neutral-400">
              <span>Billing Charge per Cycle:</span>
              <span className="font-mono font-bold text-[#E11D48] text-sm">
                {isTrial ? '$0.00 (In Trial)' : `$${totalCharge.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs cursor-pointer"
            >
              Enroll Subscriber
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-Component: Create Product Plan Modal ───────────────────────────────

function CreateProductPlanModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (plan: CompanyPlanTier) => void;
}) {
  const [name, setName] = useState('');
  const [productLine, setProductLine] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Scheduled Service & Maintenance');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState(199);
  const [setupFee, setSetupFee] = useState(0);
  const [deliverablesStr, setDeliverablesStr] = useState('Monthly scheduled inspection, Parts warranty, Priority phone line, Emergency dispatch');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productLine.trim()) return;

    const newId = `plan-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const deliverables = deliverablesStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    onCreated({
      id: newId,
      name: name.trim(),
      productLine: productLine.trim(),
      category,
      description: description.trim() || 'Company subscription plan offering.',
      billingFrequency: 'Monthly',
      unitPrice: Number(unitPrice),
      setupFee: Number(setupFee),
      deliverables,
      active: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] rounded-2xl max-w-lg w-full border border-border dark:border-[#2A2B27] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-5 border-b border-border dark:border-[#2A2B27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E11D48]" />
            <h3 className="text-base font-bold text-ink dark:text-white">Define Company Product / Service Plan</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Plan Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Commercial HVAC Quarterly Tune-Up"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Company Product Line *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Facility Maintenance"
                value={productLine}
                onChange={(e) => setProductLine(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Fulfillment Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="Scheduled Service & Maintenance">Scheduled Service & Maintenance</option>
                <option value="Physical Goods & Replenishment">Physical Goods & Replenishment</option>
                <option value="Professional Retainers & Hours">Professional Retainers & Hours</option>
                <option value="Memberships & Facility Passes">Memberships & Facility Passes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Plan Description
            </label>
            <input
              type="text"
              placeholder="e.g. Regular on-site inspection visits and preventive diagnostics."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                Price per Unit ($)
              </label>
              <input
                type="number"
                min="0"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
                One-time Setup Fee ($)
              </label>
              <input
                type="number"
                min="0"
                value={setupFee}
                onChange={(e) => setSetupFee(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Included Deliverables &amp; Perks (comma-separated)
            </label>
            <textarea
              rows={3}
              value={deliverablesStr}
              onChange={(e) => setDeliverablesStr(e.target.value)}
              placeholder="e.g. Monthly inspection visit, 24/7 emergency dispatch, 15% discount on parts"
              className="w-full text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xs cursor-pointer"
            >
              Publish Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sub-Component: Subscriber Details Modal ────────────────────────────────

function SubscriberDetailsModal({
  sub,
  plans,
  onClose,
  onTogglePause,
  onCancel,
  onLogFulfillment,
  onSendReminder,
  onUpdatePlan,
}: {
  sub: CustomerSubscription;
  plans: CompanyPlanTier[];
  onClose: () => void;
  onTogglePause: () => void;
  onCancel: () => void;
  onLogFulfillment: () => void;
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
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Product Line</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block truncate">{sub.productLine}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Category</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block truncate">{sub.category}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Billing Email</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block truncate">{sub.email}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold">Next Billing Renewal</span>
              <span className="font-semibold text-ink dark:text-neutral-200 mt-0.5 block">{sub.nextRenewalDate}</span>
            </div>
          </div>

          {/* Fulfillment Schedule Box */}
          <div className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5] dark:bg-[#141513] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink dark:text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-500" />
                Next Service Visit / Shipment Dispatch
              </span>
              <button
                onClick={onLogFulfillment}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                ✓ Log Delivered Today
              </button>
            </div>
            <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {sub.nextFulfillmentDate}
            </p>
            {sub.specialInstructions && (
              <p className="text-[11px] text-ink-muted dark:text-neutral-400 border-t border-border dark:border-[#2A2B27] pt-2">
                <span className="font-bold text-ink dark:text-neutral-300">Client Instructions: </span>
                {sub.specialInstructions}
              </p>
            )}
          </div>

          {/* Change Plan Tier */}
          <div className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] space-y-2">
            <span className="text-xs font-bold text-ink dark:text-white block">Change Customer Plan Tier</span>
            <div className="flex items-center gap-2">
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productLine} — {p.name} (${p.unitPrice}/mo)
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
