'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  FileSpreadsheet,
  CreditCard,
  Package,
  Wrench,
  Truck,
  Landmark,
  Receipt,
  Wallet,
  UserCheck,
  Clock,
  Calendar,
  FolderKanban,
  Headphones,
  FileText,
  Sparkles,
  Layers,
  Search,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface ApplicationItem {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  description: string;
  route: string;
  colorClass: string;
  glowClass: string;
  badgeClass: string;
  features: string[];
  icon: React.ReactNode;
  status: 'ready' | 'not-ready';
}

interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryGroup[] = [
  {
    id: 'sales',
    name: 'Sales & Customers',
    description: 'Find new clients, send price quotes, and manage recurring plans.',
    badge: '3 Applications',
    icon: <Sparkles className="w-5 h-5 text-accent" />,
  },
  {
    id: 'operations',
    name: 'Products & Field Work',
    description: 'Track items in stock, schedule technician visits, and order from suppliers.',
    badge: '3 Applications',
    icon: <Layers className="w-5 h-5 text-[#3E7FBF]" />,
  },
  {
    id: 'finance',
    name: 'Money & Bookkeeping',
    description: 'Keep track of cash flow, send invoices to clients, and log business expenses.',
    badge: '3 Applications',
    icon: <Landmark className="w-5 h-5 text-[#2E9169]" />,
  },
  {
    id: 'hr',
    name: 'Team & Staff',
    description: 'Manage your team directory, record work hours, and approve vacation days.',
    badge: '3 Applications',
    icon: <UserCheck className="w-5 h-5 text-[#C24A6B]" />,
  },
  {
    id: 'productivity',
    name: 'Projects & Support',
    description: 'Organize project tasks, answer customer help questions, and store signed contracts.',
    badge: '3 Applications',
    icon: <FolderKanban className="w-5 h-5 text-[#D1A536]" />,
  },
];

const ALL_APPLICATIONS: ApplicationItem[] = [
  // ─── 1. Sales & Customers (3 Apps) ──────────────────────
  {
    id: 'crm',
    name: 'Customers & Leads',
    categoryId: 'sales',
    categoryLabel: 'Sales',
    description: 'Keep track of clients, sales leads, and upcoming deals in an easy visual board.',
    route: '/crm',
    colorClass: 'text-[#C2542F] bg-[#C2542F]/10 border-[#C2542F]/20 dark:bg-[#C2542F]/15 dark:border-[#C2542F]/35',
    glowClass: 'group-hover:border-[#C2542F]/40 group-hover:shadow-[0_8px_30px_rgba(194,84,47,0.12)]',
    badgeClass: 'bg-[#C2542F]/10 text-[#C2542F] dark:text-[#E0724F] border-[#C2542F]/20',
    features: ['Deal Board', 'New Leads', 'Contact List'],
    icon: <Users className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'sales',
    name: 'Sales & Quotes',
    categoryId: 'sales',
    categoryLabel: 'Orders',
    description: 'Create price quotes for customers, confirm orders, and manage price lists.',
    route: '/sales',
    colorClass: 'text-[#A8462F] bg-[#A8462F]/10 border-[#A8462F]/20 dark:bg-[#A8462F]/15 dark:border-[#A8462F]/35',
    glowClass: 'group-hover:border-[#A8462F]/40 group-hover:shadow-[0_8px_30px_rgba(168,70,47,0.12)]',
    badgeClass: 'bg-[#A8462F]/10 text-[#A8462F] dark:text-[#D16249] border-[#A8462F]/20',
    features: ['Price Quotes', 'Customer Orders', 'Price Lists'],
    icon: <FileSpreadsheet className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions & Plans',
    categoryId: 'sales',
    categoryLabel: 'Billing',
    description: 'Set up recurring customer subscriptions, monthly billing, and auto renewals.',
    route: '/subscriptions',
    colorClass: 'text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20 dark:bg-[#E11D48]/15 dark:border-[#E11D48]/35',
    glowClass: 'group-hover:border-[#E11D48]/40 group-hover:shadow-[0_8px_30px_rgba(225,29,72,0.12)]',
    badgeClass: 'bg-[#E11D48]/10 text-[#E11D48] dark:text-[#FB7185] border-[#E11D48]/20',
    features: ['Monthly Plans', 'Payment Reminders', 'Recurring Revenue'],
    icon: <CreditCard className="w-6 h-6" />,
    status: 'not-ready',
  },

  // ─── 2. Products & Field Work (3 Apps) ───────────────────
  {
    id: 'inventory',
    name: 'Stock & Inventory',
    categoryId: 'operations',
    categoryLabel: 'Inventory',
    description: 'Keep count of items on shelves, get low stock warnings, and move items between rooms.',
    route: '/inventory',
    colorClass: 'text-[#3E7FBF] bg-[#3E7FBF]/10 border-[#3E7FBF]/20 dark:bg-[#3E7FBF]/15 dark:border-[#3E7FBF]/35',
    glowClass: 'group-hover:border-[#3E7FBF]/40 group-hover:shadow-[0_8px_30px_rgba(62,127,191,0.12)]',
    badgeClass: 'bg-[#3E7FBF]/10 text-[#3E7FBF] dark:text-[#5B9BD9] border-[#3E7FBF]/20',
    features: ['Stock Counts', 'Low Stock Alerts', 'Move Items'],
    icon: <Package className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'services',
    name: 'Service Visits & Jobs',
    categoryId: 'operations',
    categoryLabel: 'Field Jobs',
    description: 'Book customer repair jobs, assign field workers, and schedule visits.',
    route: '/services',
    colorClass: 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-[#2DD4BF]/20 dark:bg-[#2DD4BF]/15 dark:border-[#2DD4BF]/35',
    glowClass: 'group-hover:border-[#2DD4BF]/40 group-hover:shadow-[0_8px_30px_rgba(45,212,191,0.12)]',
    badgeClass: 'bg-[#2DD4BF]/10 text-[#0F766E] dark:text-[#2DD4BF] border-[#2DD4BF]/20',
    features: ['Job Bookings', 'Assign Technicians', 'Visit Schedules'],
    icon: <Wrench className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'procurement',
    name: 'Purchases & Suppliers',
    categoryId: 'operations',
    categoryLabel: 'Buying',
    description: 'Order supplies from vendors, compare prices, and check shipments when they arrive.',
    route: '/procurement',
    colorClass: 'text-[#0284C7] bg-[#0284C7]/10 border-[#0284C7]/20 dark:bg-[#0284C7]/15 dark:border-[#0284C7]/35',
    glowClass: 'group-hover:border-[#0284C7]/40 group-hover:shadow-[0_8px_30px_rgba(2,132,199,0.12)]',
    badgeClass: 'bg-[#0284C7]/10 text-[#0284C7] dark:text-[#38BDF8] border-[#0284C7]/20',
    features: ['Purchase Orders', 'Supplier List', 'Shipment Check'],
    icon: <Truck className="w-6 h-6" />,
    status: 'not-ready',
  },

  // ─── 3. Money & Bookkeeping (3 Apps) ─────────────────────
  {
    id: 'accounting',
    name: 'Bookkeeping & Finances',
    categoryId: 'finance',
    categoryLabel: 'Accounts',
    description: 'See all money coming in and going out, balance your accounts, and keep clean books.',
    route: '/accounting',
    colorClass: 'text-[#2E9169] bg-[#2E9169]/10 border-[#2E9169]/20 dark:bg-[#2E9169]/15 dark:border-[#2E9169]/35',
    glowClass: 'group-hover:border-[#2E9169]/40 group-hover:shadow-[0_8px_30px_rgba(46,145,105,0.12)]',
    badgeClass: 'bg-[#2E9169]/10 text-[#2E9169] dark:text-[#42B786] border-[#2E9169]/20',
    features: ['Income & Expenses', 'Account Balances', 'Financial Reports'],
    icon: <Landmark className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'invoicing',
    name: 'Invoices & Customer Bills',
    categoryId: 'finance',
    categoryLabel: 'Bills',
    description: 'Send professional invoices, share payment links, and get paid faster.',
    route: '/invoicing',
    colorClass: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20 dark:bg-[#10B981]/15 dark:border-[#10B981]/35',
    glowClass: 'group-hover:border-[#10B981]/40 group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]',
    badgeClass: 'bg-[#10B981]/10 text-[#059669] dark:text-[#34D399] border-[#10B981]/20',
    features: ['Send Invoices', 'Payment Links', 'Payment Reminders'],
    icon: <Receipt className="w-6 h-6" />,
    status: 'not-ready',
  },
  {
    id: 'expenses',
    name: 'Expenses & Receipts',
    categoryId: 'finance',
    categoryLabel: 'Receipts',
    description: 'Snap photos of receipts, track business expenses, and repay employee spending.',
    route: '/expenses',
    colorClass: 'text-[#84CC16] bg-[#84CC16]/10 border-[#84CC16]/20 dark:bg-[#84CC16]/15 dark:border-[#84CC16]/35',
    glowClass: 'group-hover:border-[#84CC16]/40 group-hover:shadow-[0_8px_30px_rgba(132,204,22,0.12)]',
    badgeClass: 'bg-[#84CC16]/10 text-[#65A30D] dark:text-[#A3E635] border-[#84CC16]/20',
    features: ['Receipt Photos', 'Expense Approvals', 'Daily Spending'],
    icon: <Wallet className="w-6 h-6" />,
    status: 'not-ready',
  },

  // ─── 4. Team & Staff (3 Apps) ────────────────────────────
  {
    id: 'hr',
    name: 'Team & Staff Directory',
    categoryId: 'hr',
    categoryLabel: 'Team',
    description: 'List all employees, their contact info, job roles, and emergency details.',
    route: '/hr',
    colorClass: 'text-[#C24A6B] bg-[#C24A6B]/10 border-[#C24A6B]/20 dark:bg-[#C24A6B]/15 dark:border-[#C24A6B]/35',
    glowClass: 'group-hover:border-[#C24A6B]/40 group-hover:shadow-[0_8px_30px_rgba(194,74,107,0.12)]',
    badgeClass: 'bg-[#C24A6B]/10 text-[#C24A6B] dark:text-[#DE6889] border-[#C24A6B]/20',
    features: ['Staff List', 'Job Roles', 'Team Details'],
    icon: <UserCheck className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'attendance',
    name: 'Work Hours & Attendance',
    categoryId: 'hr',
    categoryLabel: 'Clock In',
    description: 'Track clock-in and clock-out times, daily work shifts, and overtime hours.',
    route: '/attendance',
    colorClass: 'text-[#EC4899] bg-[#EC4899]/10 border-[#EC4899]/20 dark:bg-[#EC4899]/15 dark:border-[#EC4899]/35',
    glowClass: 'group-hover:border-[#EC4899]/40 group-hover:shadow-[0_8px_30px_rgba(236,72,153,0.12)]',
    badgeClass: 'bg-[#EC4899]/10 text-[#DB2777] dark:text-[#F472B6] border-[#EC4899]/20',
    features: ['Clock In / Out', 'Work Shifts', 'Overtime Logs'],
    icon: <Clock className="w-6 h-6" />,
    status: 'not-ready',
  },
  {
    id: 'leave',
    name: 'Time Off & Vacations',
    categoryId: 'hr',
    categoryLabel: 'Time Off',
    description: 'Request days off, approve employee holidays, and see who is working today.',
    route: '/leave',
    colorClass: 'text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/20 dark:bg-[#F43F5E]/15 dark:border-[#F43F5E]/35',
    glowClass: 'group-hover:border-[#F43F5E]/40 group-hover:shadow-[0_8px_30px_rgba(244,63,94,0.12)]',
    badgeClass: 'bg-[#F43F5E]/10 text-[#E11D48] dark:text-[#FB7185] border-[#F43F5E]/20',
    features: ['Vacation Requests', 'Sick Days', 'Team Calendar'],
    icon: <Calendar className="w-6 h-6" />,
    status: 'not-ready',
  },

  // ─── 5. Projects & Support (3 Apps) ──────────────────────
  {
    id: 'projects',
    name: 'Projects & Tasks',
    categoryId: 'productivity',
    categoryLabel: 'Tasks',
    description: 'Organize project tasks on simple boards, assign work, and finish on time.',
    route: '/projects',
    colorClass: 'text-[#D1A536] bg-[#D1A536]/10 border-[#D1A536]/20 dark:bg-[#D1A536]/15 dark:border-[#D1A536]/35',
    glowClass: 'group-hover:border-[#D1A536]/40 group-hover:shadow-[0_8px_30px_rgba(209,165,54,0.12)]',
    badgeClass: 'bg-[#D1A536]/10 text-[#D1A536] dark:text-[#E8BD4D] border-[#D1A536]/20',
    features: ['Task Boards', 'Milestones', 'Checklists'],
    icon: <FolderKanban className="w-6 h-6" />,
    status: 'ready',
  },
  {
    id: 'helpdesk',
    name: 'Customer Help & Support',
    categoryId: 'productivity',
    categoryLabel: 'Support',
    description: 'Answer customer questions, solve problems quickly, and keep clients happy.',
    route: '/helpdesk',
    colorClass: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20 dark:bg-[#8B5CF6]/15 dark:border-[#8B5CF6]/35',
    glowClass: 'group-hover:border-[#8B5CF6]/40 group-hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]',
    badgeClass: 'bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#A78BFA] border-[#8B5CF6]/20',
    features: ['Support Requests', 'Quick Answers', 'Help Articles'],
    icon: <Headphones className="w-6 h-6" />,
    status: 'not-ready',
  },
  {
    id: 'documents',
    name: 'Documents & Signatures',
    categoryId: 'productivity',
    categoryLabel: 'Contracts',
    description: 'Store agreements and forms, collect electronic signatures, and keep files safe.',
    route: '/documents',
    colorClass: 'text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20 dark:bg-[#6366F1]/15 dark:border-[#6366F1]/35',
    glowClass: 'group-hover:border-[#6366F1]/40 group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]',
    badgeClass: 'bg-[#6366F1]/10 text-[#4F46E5] dark:text-[#818CF8] border-[#6366F1]/20',
    features: ['Online Signatures', 'Saved Templates', 'Safe Storage'],
    icon: <FileText className="w-6 h-6" />,
    status: 'not-ready',
  },
];

export default function UserOverviewPage() {
  const [greeting, setGreeting] = useState<string>('Welcome');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Filter categories and their child applications
  const visibleCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return CATEGORIES.map((category) => {
      // If a specific category tab is selected, filter out others
      if (selectedCategory !== 'all' && selectedCategory !== category.id) {
        return { category, apps: [] };
      }

      const apps = ALL_APPLICATIONS.filter((app) => {
        if (app.categoryId !== category.id) return false;
        if (!query) return true;

        return (
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.categoryLabel.toLowerCase().includes(query) ||
          app.features.some((f) => f.toLowerCase().includes(query))
        );
      });

      return { category, apps };
    }).filter((group) => group.apps.length > 0);
  }, [selectedCategory, searchQuery]);

  const totalMatchingApps = useMemo(() => {
    return visibleCategories.reduce((acc, g) => acc + g.apps.length, 0);
  }, [visibleCategories]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-9 animate-fade-in">
      {/* ─── Header ────────────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-border/60 dark:border-[#2A2B27]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 font-mono">
              <Sparkles className="w-3 h-3 text-accent" />
              Business Hub
            </span>
            <span className="text-xs font-mono text-ink-muted dark:text-neutral-400">
              Acme Global • 7 Ready to Use • 8 Coming Soon
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink dark:text-neutral-100">
            {greeting}, <span className="text-accent">Yash</span>
          </h1>
          <p className="text-sm text-ink-muted dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            All your daily business tools in one place. 7 applications are fully ready to use, and 8 more are coming soon.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted dark:text-neutral-400 bg-white dark:bg-[#1A1B18] px-3.5 py-2 rounded-xl border border-border dark:border-[#2A2B27] shadow-xs">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span>Local Time: <strong className="text-ink dark:text-neutral-200 font-mono">10:25 AM</strong></span>
        </div>
      </header>

      {/* ─── Quick Stats Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:shadow-card-hover dark:hover:shadow-glass-dark hover:border-[#D5D2CA] dark:hover:border-neutral-700 transition-all group">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              Money In (Last 30 Days)
            </span>
            <span className="inline-flex items-center gap-1 bg-[#1F7A4D]/10 dark:bg-[#1F7A4D]/20 text-[#1F7A4D] dark:text-[#38BD7E] border border-[#1F7A4D]/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
              <TrendingUp className="w-2.5 h-2.5" />
              +14%
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-neutral-100 font-mono tracking-tight">
            $12,450.00
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2">
            vs $10,920 last month
          </p>
        </div>

        {/* New Leads */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:shadow-card-hover dark:hover:shadow-glass-dark hover:border-[#D5D2CA] dark:hover:border-neutral-700 transition-all group">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              New Inquiries
            </span>
            <span className="inline-flex items-center gap-1 bg-[#C2542F]/10 dark:bg-[#C2542F]/20 text-[#C2542F] dark:text-[#E0724F] border border-[#C2542F]/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
              +5 today
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-neutral-100 font-mono tracking-tight">
            42
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2">
            12 people to follow up with today
          </p>
        </div>

        {/* Active Projects */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:shadow-card-hover dark:hover:shadow-glass-dark hover:border-[#D5D2CA] dark:hover:border-neutral-700 transition-all group">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              Active Projects
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-md text-[10px] font-bold">
              On Track
            </span>
          </div>
          <div className="text-2xl font-black text-ink dark:text-neutral-100 font-mono tracking-tight">
            8
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2">
            3 tasks due this week
          </p>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] p-5 rounded-2xl shadow-xs hover:shadow-card-hover dark:hover:shadow-glass-dark hover:border-[#D5D2CA] dark:hover:border-neutral-700 transition-all group">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-ink-muted dark:text-neutral-400 uppercase tracking-wider">
              System Status
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-lg font-black text-ink dark:text-neutral-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>Everything Running Smoothly</span>
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 mt-2">
            All data saved and synced
          </p>
        </div>
      </div>

      {/* ─── Controls: Category Filter Tabs & Search ───── */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-2xl text-xs font-semibold no-scrollbar shadow-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-accent text-white font-bold shadow-xs'
                  : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
              }`}
            >
              All Apps ({ALL_APPLICATIONS.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-white font-bold shadow-xs'
                    : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search apps, tasks, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-100 placeholder:text-ink-muted/60 dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-accent dark:focus:border-accent transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* ─── Categorized Applications Sections ───────── */}
        {totalMatchingApps === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-2xl shadow-xs">
            <Layers className="w-10 h-10 text-ink-muted mx-auto mb-3 opacity-40" />
            <p className="text-base font-bold text-ink dark:text-neutral-200">
              No apps match &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1">
              Try searching with another keyword or reset the category filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs cursor-pointer"
            >
              Show All Apps
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {visibleCategories.map(({ category, apps }) => (
              <div key={category.id} className="space-y-4">
                {/* Category Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/80 dark:border-[#2A2B27]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] flex items-center justify-center shadow-xs">
                      {category.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-ink dark:text-neutral-100 tracking-tight">
                          {category.name}
                        </h2>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-ink-muted dark:text-neutral-300 font-mono border border-border/60 dark:border-neutral-700">
                          {apps.length} {apps.length === 1 ? 'App' : 'Apps'}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3-Column Applications Grid for This Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {apps.map((app) => (
                    <Link
                      href={app.route}
                      key={app.id}
                      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] shadow-xs hover:shadow-card-hover dark:hover:shadow-glass-dark transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden ${app.glowClass} ${
                        app.status === 'not-ready' ? 'opacity-90 hover:opacity-100' : ''
                      }`}
                    >
                      {/* Top Row: Icon + Category Badge + Arrow */}
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold shadow-xs transition-transform duration-200 group-hover:scale-105 ${app.colorClass}`}
                          >
                            {app.icon}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border font-mono ${app.badgeClass}`}>
                              {app.categoryLabel}
                            </span>
                            {app.status === 'not-ready' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 font-mono">
                                Coming Soon
                              </span>
                            )}
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-muted dark:text-neutral-500 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-bold text-ink dark:text-neutral-100 group-hover:text-accent transition-colors flex items-center gap-1.5">
                          {app.name}
                        </h3>
                        <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1.5 leading-relaxed min-h-[36px]">
                          {app.description}
                        </p>
                      </div>

                      {/* Bottom Row: Feature Chips & Launch Link */}
                      <div className="pt-4 mt-4 border-t border-border/70 dark:border-[#2A2B27]/80 flex flex-col gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {app.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/80 text-ink-muted dark:text-neutral-400 border border-border/60 dark:border-neutral-700/60 font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-[11px] font-semibold text-ink-muted dark:text-neutral-500 flex items-center gap-1.5">
                            Status:
                            {app.status === 'ready' ? (
                              <strong className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                Ready to Use
                              </strong>
                            ) : (
                              <strong className="text-amber-600 dark:text-amber-400 font-semibold inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                                Coming Soon
                              </strong>
                            )}
                          </span>
                          <span className={`font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${app.status === 'ready' ? 'text-accent' : 'text-ink-muted dark:text-neutral-400'}`}>
                            {app.status === 'ready' ? (
                              <>
                                Open App <ArrowRight className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                Preview Demo <ArrowRight className="w-3 h-3" />
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Recent Activity ───────────────────────────── */}
      <section className="space-y-3 pt-4 border-t border-border/60 dark:border-[#2A2B27]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink dark:text-neutral-100 tracking-tight">
            Recent Business Activity
          </h2>
          <span className="text-xs font-semibold text-ink-muted dark:text-neutral-400">
            Live updates across all your apps
          </span>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-2xl shadow-xs overflow-hidden divide-y divide-border dark:divide-[#2A2B27]">
          {/* Item 1 - Sales */}
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAF9F5] dark:hover:bg-[#20211D] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent dark:bg-accent/20 border border-accent/25 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              YR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-neutral-100 truncate group-hover:text-accent transition-colors">
                Quote #104 accepted by Green Garden Cafe
              </p>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Sales &amp; Quotes • 2 hours ago by Yash Rawat
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +$1,450.00
            </span>
          </div>

          {/* Item 2 - Subscriptions */}
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAF9F5] dark:hover:bg-[#20211D] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-[#E11D48]/10 text-[#E11D48] dark:bg-[#E11D48]/20 border border-[#E11D48]/25 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-neutral-100 truncate group-hover:text-accent transition-colors">
                Annual Subscription renewed for Apex Logistics Hub
              </p>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Subscriptions &amp; Plans • 3 hours ago
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +$10,680.00/yr
            </span>
          </div>

          {/* Item 3 - Inventory */}
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAF9F5] dark:hover:bg-[#20211D] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-[#3E7FBF]/10 text-[#3E7FBF] dark:bg-[#3E7FBF]/20 border border-[#3E7FBF]/25 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Package className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-neutral-100 truncate group-hover:text-accent transition-colors">
                Incoming stock received (150 items) into Main Warehouse
              </p>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Stock &amp; Inventory • 4 hours ago
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-ink-muted dark:text-neutral-400">
              150 units
            </span>
          </div>

          {/* Item 4 - Accounting */}
          <div className="p-4 flex items-center gap-4 hover:bg-[#FAF9F5] dark:hover:bg-[#20211D] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-[#2E9169]/10 text-[#2E9169] dark:bg-[#2E9169]/20 border border-[#2E9169]/25 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink dark:text-neutral-100 truncate group-hover:text-accent transition-colors">
                Invoice #084 marked as Paid via Bank Wire Transfer
              </p>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Bookkeeping &amp; Finances • Yesterday
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +$3,200.00
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
