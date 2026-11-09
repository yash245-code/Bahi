'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Headphones,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LifeBuoy,
  Send,
  Star,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

interface TicketMessage {
  id: string;
  sender: string;
  role: 'customer' | 'staff';
  text: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  customer: string;
  company: string;
  email: string;
  subject: string;
  category: 'Hardware & Devices' | 'Software & API' | 'Billing & Plans' | 'Field Service Dispatch';
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  assignee: string;
  status: 'Open' | 'In Progress' | 'Waiting on Client' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  slaBreach: boolean;
  messages: TicketMessage[];
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  views: number;
  helpfulCount: number;
  solution: string;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TKT-901',
    customer: 'David Miller',
    company: 'Green Garden Cafe',
    email: 'd.miller@greengarden.com',
    subject: 'Receipt thermal printer hardware head calibration error',
    category: 'Hardware & Devices',
    priority: 'High',
    assignee: 'Carlos Mendez',
    status: 'Open',
    createdAt: '2026-11-03 08:30 AM',
    updatedAt: '25 mins ago',
    slaBreach: false,
    messages: [
      {
        id: 'M-1',
        sender: 'David Miller',
        role: 'customer',
        text: 'Our counter receipt printer is skipping lines during morning peak rush. Need field technician check.',
        timestamp: '08:30 AM',
      },
    ],
  },
  {
    id: 'TKT-902',
    customer: 'Rachel Green',
    company: 'Apex Logistics Hub',
    email: 'rachel@apexlogistics.io',
    subject: 'API Webhook authentication signature timeout on ERP dispatch',
    category: 'Software & API',
    priority: 'Urgent',
    assignee: 'Elena Rostova',
    status: 'In Progress',
    createdAt: '2026-11-03 07:45 AM',
    updatedAt: '45 mins ago',
    slaBreach: false,
    messages: [
      {
        id: 'M-2',
        sender: 'Rachel Green',
        role: 'customer',
        text: 'Automated warehouse dock webhook returns HTTP 408 on payload verification.',
        timestamp: '07:45 AM',
      },
      {
        id: 'M-3',
        sender: 'Elena Rostova',
        role: 'staff',
        text: 'Investigating TLS handshake latency on your dedicated gateway node right now.',
        timestamp: '08:05 AM',
      },
    ],
  },
  {
    id: 'TKT-903',
    customer: 'Marcus Vance',
    company: 'Nordic Warehouses',
    email: 'marcus@nordicwarehouses.se',
    subject: 'Request provision of 4 additional barcode scanner licenses',
    category: 'Billing & Plans',
    priority: 'Normal',
    assignee: 'Maya Lin',
    status: 'Resolved',
    createdAt: '2026-11-02 02:15 PM',
    updatedAt: 'Yesterday',
    slaBreach: false,
    messages: [
      {
        id: 'M-4',
        sender: 'Marcus Vance',
        role: 'customer',
        text: 'We added 4 new dock workers and need user seats provisioned on our Growth plan.',
        timestamp: '02:15 PM',
      },
      {
        id: 'M-5',
        sender: 'Maya Lin',
        role: 'staff',
        text: 'Licenses added to your account subscription. You can now log in and assign IDs in Staff directory.',
        timestamp: '02:40 PM',
      },
    ],
  },
  {
    id: 'TKT-904',
    customer: 'Amara Okafor',
    company: 'Summit Medical Clinic',
    email: 'a.okafor@summitmedical.org',
    subject: 'Schedule monthly field HVAC compressor maintenance visit',
    category: 'Field Service Dispatch',
    priority: 'Normal',
    assignee: 'Liam O\'Connor',
    status: 'Waiting on Client',
    createdAt: '2026-11-02 11:20 AM',
    updatedAt: 'Yesterday',
    slaBreach: false,
    messages: [
      {
        id: 'M-6',
        sender: 'Amara Okafor',
        role: 'customer',
        text: 'Please confirm visit time window for Friday clinic air sterilization unit filter replacement.',
        timestamp: '11:20 AM',
      },
      {
        id: 'M-7',
        sender: 'Liam O\'Connor',
        role: 'staff',
        text: 'We have 09:00 AM or 01:30 PM open with lead tech Carlos. Let us know which window suits your clinic best.',
        timestamp: '11:45 AM',
      },
    ],
  },
  {
    id: 'TKT-905',
    customer: 'Sarah Jenkins',
    company: 'Metro Retail Mart',
    email: 's.jenkins@metroretail.com',
    subject: 'Emergency backup battery alarm sounding on POS terminal 3',
    category: 'Hardware & Devices',
    priority: 'Urgent',
    assignee: 'Carlos Mendez',
    status: 'Open',
    createdAt: '2026-11-03 09:10 AM',
    updatedAt: '10 mins ago',
    slaBreach: false,
    messages: [
      {
        id: 'M-8',
        sender: 'Sarah Jenkins',
        role: 'customer',
        text: 'Continuous beep tone coming from backup battery inverter. Please advise immediately.',
        timestamp: '09:10 AM',
      },
    ],
  },
];

const INITIAL_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'KB-101',
    title: 'POS Receipt Printer Thermal Head Cleaning & Self-Test',
    category: 'Hardware & Devices',
    views: 342,
    helpfulCount: 88,
    solution: 'Turn off power switch. Press and hold paper FEED button while toggling power ON. Release after 3 seconds to print full diagnostic pattern. Clean thermal strip with isopropyl alcohol pad.',
  },
  {
    id: 'KB-102',
    title: 'Webhook Cryptographic Signature Verification in Node & Python',
    category: 'Software & API',
    views: 520,
    helpfulCount: 145,
    solution: 'Verify HMAC-SHA256 signature against raw body bytes using the shared webhook secret found in Organization Developer settings. Reject timestamp older than 300 seconds.',
  },
  {
    id: 'KB-103',
    title: 'Adding User Licenses & Pro-Rated Billing Calculation',
    category: 'Billing & Plans',
    views: 215,
    helpfulCount: 62,
    solution: 'Seat increases take effect immediately. Pro-rated charges for remainder of monthly billing cycle are added to the next invoice statement.',
  },
  {
    id: 'KB-104',
    title: 'Preparing Site Access for Certified Field Technician Service Visits',
    category: 'Field Service Dispatch',
    views: 184,
    helpfulCount: 51,
    solution: 'Ensure clear 3-foot perimeter around mechanical units and electrical breaker panels. Authorized facility manager must sign off on safety lock-out procedures.',
  },
];

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [articles] = useState<KnowledgeArticle[]>(INITIAL_ARTICLES);
  const [activeTab, setActiveTab] = useState<'tickets' | 'triage' | 'knowledge' | 'analytics'>('tickets');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  // New Ticket Form State
  const [newCustomer, setNewCustomer] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<'Hardware & Devices' | 'Software & API' | 'Billing & Plans' | 'Field Service Dispatch'>('Hardware & Devices');
  const [newPriority, setNewPriority] = useState<'Urgent' | 'High' | 'Normal' | 'Low'>('Normal');
  const [newAssignee, setNewAssignee] = useState('Carlos Mendez');
  const [newDescription, setNewDescription] = useState('');

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.customer.toLowerCase().includes(search.toLowerCase()) ||
        t.company.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter]);

  // Urgent tickets
  const urgentTickets = useMemo(() => {
    return tickets.filter((t) => t.priority === 'Urgent' || t.priority === 'High');
  }, [tickets]);

  // Metrics
  const metrics = useMemo(() => {
    const openCount = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
    const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
    const urgentCount = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved').length;
    const avgResponseTime = '14 mins';

    return { openCount, resolvedCount, urgentCount, avgResponseTime };
  }, [tickets]);

  // Handlers
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newSubject) return;

    const newId = `TKT-${900 + tickets.length + 1}`;
    const newEntry: Ticket = {
      id: newId,
      customer: newCustomer,
      company: newCompany || 'Independent Client',
      email: newEmail || 'client@example.com',
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      assignee: newAssignee,
      status: 'Open',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      slaBreach: false,
      messages: [
        {
          id: `M-${Date.now()}`,
          sender: newCustomer,
          role: 'customer',
          text: newDescription || 'Assistance requested by client.',
          timestamp: 'Just now',
        },
      ],
    };

    setTickets([newEntry, ...tickets]);
    setIsNewTicketOpen(false);

    // Reset Form
    setNewCustomer('');
    setNewCompany('');
    setNewEmail('');
    setNewSubject('');
    setNewDescription('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;

    const newMessage: TicketMessage = {
      id: `M-${Date.now()}`,
      sender: activeTicket.assignee,
      role: 'staff',
      text: replyText,
      timestamp: 'Just now',
    };

    const updated = {
      ...activeTicket,
      status: 'In Progress' as const,
      updatedAt: 'Just now',
      messages: [...activeTicket.messages, newMessage],
    };

    setTickets((prev) => prev.map((t) => (t.id === activeTicket.id ? updated : t)));
    setActiveTicket(updated);
    setReplyText('');
  };

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' as const, updatedAt: 'Just now' } : t))
    );
    if (activeTicket && activeTicket.id === id) {
      setActiveTicket({ ...activeTicket, status: 'Resolved', updatedAt: 'Just now' });
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Customer',
      'Company',
      'Email',
      'Subject',
      'Category',
      'Priority',
      'Assignee',
      'Status',
      'Created',
      'Updated',
    ];

    const rows = filteredTickets.map((t) => [
      t.id,
      `"${t.customer}"`,
      `"${t.company}"`,
      t.email,
      `"${t.subject}"`,
      `"${t.category}"`,
      t.priority,
      `"${t.assignee}"`,
      t.status,
      `"${t.createdAt}"`,
      `"${t.updatedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* ─── Header & Top Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 font-mono">
              Helpdesk
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Helpdesk
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Resolve customer service tickets, monitor response SLAs, and maintain troubleshooting guides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-400" />
            Export Tickets
          </button>
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Open Tickets
            </span>
            <Headphones className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.openCount} Active
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> {metrics.urgentCount} marked urgent priority
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Avg First Response
            </span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.avgResponseTime}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Target SLA: under 30 mins
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              SLA Adherence
            </span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            98.8%
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Zero SLA breach penalties
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              CSAT Rating
            </span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            4.9 / 5.0
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Based on 142 client reviews
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          Support Tickets ({tickets.length})
        </button>

        <button
          onClick={() => setActiveTab('triage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'triage'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Priority Triage Queue
          {urgentTickets.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
              {urgentTickets.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'knowledge'
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Knowledge Base ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          Customer CSAT &amp; SLA
        </button>
      </div>

      {/* ─── TAB 1: TICKETS ─── */}
      {activeTab === 'tickets' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket, client, subject, staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter tickets by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting on Client">Waiting on Client</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                aria-label="Filter tickets by priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>

              <select
                aria-label="Filter tickets by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Hardware & Devices">Hardware & Devices</option>
                <option value="Software & API">Software & API</option>
                <option value="Billing & Plans">Billing & Plans</option>
                <option value="Field Service Dispatch">Field Dispatch</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Customer &amp; Client</th>
                  <th className="py-3 px-4">Subject &amp; Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      No support tickets found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#8B5CF6]">
                        {t.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink dark:text-white">{t.customer}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">{t.company}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-medium text-ink dark:text-neutral-200 truncate">
                          {t.subject}
                        </div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">
                          {t.category}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.priority === 'Urgent'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              : t.priority === 'High'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-ink-muted dark:text-neutral-300'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-ink dark:text-neutral-200 font-medium">
                        {t.assignee}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'Resolved'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : t.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : t.status === 'Waiting on Client'
                              ? 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-ink-muted text-[11px]">
                        {t.updatedAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveTicket(t)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-ink dark:text-white transition-colors cursor-pointer"
                          >
                            Reply
                          </button>
                          {t.status !== 'Resolved' && (
                            <button
                              onClick={() => handleResolveTicket(t.id)}
                              title="Mark Resolved"
                              className="p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
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

      {/* ─── TAB 2: TRIAGE QUEUE ─── */}
      {activeTab === 'triage' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink dark:text-white">High Priority SLA Queue</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Critical customer tickets requiring response within guaranteed 30-minute SLA window.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              {urgentTickets.length} Escalations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentTickets.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                        {t.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        {t.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-ink dark:text-white">{t.subject}</h4>
                    <p className="text-xs text-ink-muted dark:text-neutral-400">
                      {t.customer} • <span className="font-medium text-ink dark:text-neutral-200">{t.company}</span>
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-ink-muted">{t.updatedAt}</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] text-xs text-ink-muted dark:text-neutral-300">
                  &quot;{t.messages[0]?.text}&quot;
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border dark:border-[#2A2B27]">
                  <span className="text-ink-muted">Assigned to: <strong className="text-ink dark:text-white">{t.assignee}</strong></span>
                  <button
                    onClick={() => setActiveTicket(t)}
                    className="px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Triage &amp; Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: KNOWLEDGE BASE ─── */}
      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8B5CF6] font-bold">{art.id} • {art.category}</span>
                    <h4 className="text-sm font-bold text-ink dark:text-white mt-0.5">{art.title}</h4>
                  </div>
                  <BookOpen className="w-4 h-4 text-neutral-400" />
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] text-xs text-ink-muted dark:text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-ink dark:text-white block mb-1">Standard Solution:</span>
                  {art.solution}
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1 border-t border-border dark:border-[#2A2B27]">
                  <span>{art.views} team views</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ {art.helpfulCount} customer issues resolved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: CSAT & SLA ─── */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-6 border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">Customer Satisfaction &amp; Service SLAs</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Performance metrics measured across all client channels (web portal, email, emergency phone).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5]/40 dark:bg-[#141513]/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-muted">First Contact Resolution</span>
              <p className="text-2xl font-black font-mono text-ink dark:text-white">84.2%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Solved on initial response</p>
            </div>

            <div className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5]/40 dark:bg-[#141513]/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-muted">Resolution Turnaround</span>
              <p className="text-2xl font-black font-mono text-ink dark:text-white">2.8 hrs</p>
              <p className="text-xs text-ink-muted">Average time to complete ticket</p>
            </div>

            <div className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5]/40 dark:bg-[#141513]/40 space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-muted">Positive CSAT Surveys</span>
              <p className="text-2xl font-black font-mono text-amber-500">97.6%</p>
              <p className="text-xs text-ink-muted">5-star customer feedback</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: NEW TICKET ─── */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Open Support Ticket
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Log customer issue and dispatch to specialized technician.
                </p>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Miller"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Client Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Green Garden Cafe"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Subject / Issue Overview *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Field sensor disconnected from gateway"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  >
                    <option value="Hardware & Devices">Hardware & Devices</option>
                    <option value="Software & API">Software & API</option>
                    <option value="Billing & Plans">Billing & Plans</option>
                    <option value="Field Service Dispatch">Field Dispatch</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  >
                    <option value="Urgent">Urgent (30m SLA)</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Assignee
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  >
                    <option value="Carlos Mendez">Carlos Mendez</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Maya Lin">Maya Lin</option>
                    <option value="Liam O'Connor">Liam O&apos;Connor</option>
                    <option value="Devon Vance">Devon Vance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Detailed Issue Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide customer error codes, steps to reproduce, or unit serial numbers..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Open Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: TICKET THREAD & REPLY ─── */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#8B5CF6]">{activeTicket.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-ink-muted">
                    {activeTicket.status}
                  </span>
                </div>
                <h3 className="text-base font-black text-ink dark:text-white mt-0.5">
                  {activeTicket.subject}
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  {activeTicket.customer} ({activeTicket.company}) • Assignee: {activeTicket.assignee}
                </p>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
              {activeTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl text-xs space-y-1 max-w-[85%] ${
                    m.role === 'customer'
                      ? 'bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] mr-auto'
                      : 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-ink dark:text-white ml-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                    <span>{m.sender} ({m.role === 'customer' ? 'Client' : 'Staff'})</span>
                    <span className="text-ink-muted font-mono">{m.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-border dark:border-[#2A2B27]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type official reply or customer diagnostic update..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleResolveTicket(activeTicket.id)}
                  className="px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs transition-colors cursor-pointer"
                >
                  ✓ Mark Ticket Resolved
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="text-xs text-ink-muted hover:text-ink cursor-pointer"
                >
                  Close Drawer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
