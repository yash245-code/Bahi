'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Receipt as ReceiptIcon,
  DollarSign,
  CreditCard,
  Tag,
  Eye,
  FileSpreadsheet,
  AlertCircle,
  PieChart,
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  submitter: string;
  department: string;
  category: string;
  merchant: string;
  date: string;
  amount: number;
  paymentMethod: 'Reimbursement' | 'Company Card' | 'Petty Cash';
  taxDeductible: boolean;
  status: 'Pending' | 'Approved' | 'Reimbursed' | 'Rejected';
  receiptUrl?: string;
  notes: string;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'EXP-1001',
    submitter: 'Carlos Mendez',
    department: 'Field Services',
    category: 'Travel & Fuel',
    merchant: 'Chevron Fuel Station #402',
    date: '2026-10-28',
    amount: 84.50,
    paymentMethod: 'Reimbursement',
    taxDeductible: true,
    status: 'Approved',
    notes: 'Service van fuel refuel for urgent customer HVAC dispatch in North District.',
  },
  {
    id: 'EXP-1002',
    submitter: 'Maya Lin',
    department: 'Revenue Ops',
    category: 'Client Entertainment',
    merchant: 'The Capital Grille',
    date: '2026-10-27',
    amount: 195.00,
    paymentMethod: 'Company Card',
    taxDeductible: true,
    status: 'Reimbursed',
    notes: 'Q4 strategic partnership renewal lunch with Meridian Enterprise executive team.',
  },
  {
    id: 'EXP-1003',
    submitter: 'Devon Vance',
    department: 'Supply Chain',
    category: 'Equipment & Safety',
    merchant: 'Grainger Industrial Supply',
    date: '2026-10-26',
    amount: 320.00,
    paymentMethod: 'Reimbursement',
    taxDeductible: true,
    status: 'Pending',
    notes: 'High-visibility safety vests, steel-toe boot allowances, and gloves for 3 warehouse dock workers.',
  },
  {
    id: 'EXP-1004',
    submitter: 'Sarah Chen',
    department: 'Finance',
    category: 'Software & Subscriptions',
    merchant: 'QuickBooks Intuit Enterprise',
    date: '2026-10-25',
    amount: 490.00,
    paymentMethod: 'Company Card',
    taxDeductible: true,
    status: 'Reimbursed',
    notes: 'Annual corporate tax filing and multi-entity reconciliation license upgrade.',
  },
  {
    id: 'EXP-1005',
    submitter: 'Yash Rawat',
    department: 'Leadership',
    category: 'Office Supplies',
    merchant: 'Apple Store Downtown',
    date: '2026-10-24',
    amount: 149.00,
    paymentMethod: 'Company Card',
    taxDeductible: true,
    status: 'Approved',
    notes: 'Replacement USB-C multi-display hub and backup battery pack for field demos.',
  },
  {
    id: 'EXP-1006',
    submitter: 'Elena Rostova',
    department: 'Engineering',
    category: 'Software & Subscriptions',
    merchant: 'Amazon Web Services AWS',
    date: '2026-10-23',
    amount: 612.40,
    paymentMethod: 'Company Card',
    taxDeductible: true,
    status: 'Approved',
    notes: 'Monthly database replica snapshots, CloudWatch metrics, and S3 backup storage.',
  },
  {
    id: 'EXP-1007',
    submitter: 'Marcus Vance',
    department: 'Sales',
    category: 'Travel & Fuel',
    merchant: 'Delta Airlines Flight DL-842',
    date: '2026-10-22',
    amount: 418.60,
    paymentMethod: 'Reimbursement',
    taxDeductible: true,
    status: 'Pending',
    notes: 'Roundtrip flight for on-site client kickoff and commercial contract signing.',
  },
];

interface CategoryBudget {
  category: string;
  monthlyLimit: number;
  spent: number;
  color: string;
}

const CATEGORY_BUDGETS: CategoryBudget[] = [
  { category: 'Travel & Fuel', monthlyLimit: 2500, spent: 503.10, color: '#3E7FBF' },
  { category: 'Software & Subscriptions', monthlyLimit: 3000, spent: 1102.40, color: '#8B5CF6' },
  { category: 'Client Entertainment', monthlyLimit: 1500, spent: 195.00, color: '#EC4899' },
  { category: 'Equipment & Safety', monthlyLimit: 2000, spent: 320.00, color: '#F59E0B' },
  { category: 'Office Supplies', monthlyLimit: 1000, spent: 149.00, color: '#10B981' },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [activeTab, setActiveTab] = useState<'claims' | 'approvals' | 'receipts' | 'budgets'>('claims');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  // Modals
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ExpenseItem | null>(null);

  // New Expense Form State
  const [newSubmitter, setNewSubmitter] = useState('Carlos Mendez');
  const [newDepartment, setNewDepartment] = useState('Field Services');
  const [newCategory, setNewCategory] = useState('Travel & Fuel');
  const [newMerchant, setNewMerchant] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState('2026-11-03');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'Reimbursement' | 'Company Card' | 'Petty Cash'>('Reimbursement');
  const [newTaxDeductible, setNewTaxDeductible] = useState(true);
  const [newNotes, setNewNotes] = useState('');

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.submitter.toLowerCase().includes(search.toLowerCase()) ||
        e.merchant.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.notes.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchesPayment = paymentFilter === 'ALL' || e.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPayment;
    });
  }, [expenses, search, statusFilter, categoryFilter, paymentFilter]);

  // Pending approval items
  const pendingClaims = useMemo(() => {
    return expenses.filter((e) => e.status === 'Pending');
  }, [expenses]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = expenses
      .filter((e) => e.status === 'Pending')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const reimbursedAmount = expenses
      .filter((e) => e.status === 'Reimbursed')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const taxDeductibleTotal = expenses
      .filter((e) => e.taxDeductible)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return { totalSpent, pendingAmount, reimbursedAmount, taxDeductibleTotal };
  }, [expenses]);

  // Actions
  const handleApprove = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved' } : e))
    );
  };

  const handleReject = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
  };

  const handleMarkReimbursed = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Reimbursed' } : e))
    );
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant || !newAmount) return;

    const parsedAmount = parseFloat(newAmount) || 0;
    const newId = `EXP-${1000 + expenses.length + 1}`;

    const newEntry: ExpenseItem = {
      id: newId,
      submitter: newSubmitter,
      department: newDepartment,
      category: newCategory,
      merchant: newMerchant,
      date: newDate,
      amount: parsedAmount,
      paymentMethod: newPaymentMethod,
      taxDeductible: newTaxDeductible,
      status: 'Pending',
      notes: newNotes || 'Submitted through Bahi Expenses portal.',
    };

    setExpenses([newEntry, ...expenses]);
    setIsNewExpenseOpen(false);

    // Reset Form
    setNewMerchant('');
    setNewAmount('');
    setNewNotes('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Claim ID',
      'Submitter',
      'Department',
      'Category',
      'Merchant',
      'Date',
      'Amount',
      'Payment Method',
      'Tax Deductible',
      'Status',
      'Notes',
    ];

    const rows = filteredExpenses.map((e) => [
      e.id,
      `"${e.submitter}"`,
      `"${e.department}"`,
      `"${e.category}"`,
      `"${e.merchant}"`,
      e.date,
      e.amount.toFixed(2),
      e.paymentMethod,
      e.taxDeductible ? 'Yes' : 'No',
      e.status,
      `"${e.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 font-mono">
              Expenses
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Expenses
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Record company receipts, approve team reimbursements, and monitor departmental budgets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-400" />
            Export CSV
          </button>
          <button
            onClick={() => setIsNewExpenseOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#84CC16] hover:bg-[#72B313] text-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Log Expense
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
              Total Spent (Oct)
            </span>
            <DollarSign className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Within monthly budget limit
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Pending Approvals
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            ${metrics.pendingAmount.toFixed(2)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            {pendingClaims.length} claims awaiting supervisor sign-off
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Reimbursed to Staff
            </span>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            ${metrics.reimbursedAmount.toFixed(2)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Directly transferred to bank accounts
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Tax Deductible
            </span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${metrics.taxDeductibleTotal.toFixed(2)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Verified compliant with tax deduction
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'claims'
              ? 'bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <ReceiptIcon className="w-4 h-4" />
          All Expense Claims ({expenses.length})
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'approvals'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Approval Queue
          {pendingClaims.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
              {pendingClaims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'receipts'
              ? 'bg-[#3E7FBF]/15 text-[#3E7FBF] border border-[#3E7FBF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          Receipt Vault
        </button>

        <button
          onClick={() => setActiveTab('budgets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'budgets'
              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Spending &amp; Budgets
        </button>
      </div>

      {/* ─── TAB 1: CLAIMS LIST ─── */}
      {activeTab === 'claims' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, staff, merchant, note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Status Filter */}
              <select
                aria-label="Filter expenses by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Reimbursed">Reimbursed</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Category Filter */}
              <select
                aria-label="Filter expenses by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Travel & Fuel">Travel & Fuel</option>
                <option value="Software & Subscriptions">Software</option>
                <option value="Client Entertainment">Client Entertainment</option>
                <option value="Equipment & Safety">Equipment</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>

              {/* Payment Filter */}
              <select
                aria-label="Filter expenses by payment method"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Payment Types</option>
                <option value="Reimbursement">Reimbursement (Out-of-Pocket)</option>
                <option value="Company Card">Company Card</option>
                <option value="Petty Cash">Petty Cash</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Claim</th>
                  <th className="py-3 px-4">Employee &amp; Dept</th>
                  <th className="py-3 px-4">Merchant &amp; Notes</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      No expense claims match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#84CC16]">
                        {exp.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink dark:text-white">{exp.submitter}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">
                          {exp.department}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-ink dark:text-neutral-200 truncate">
                          {exp.merchant}
                        </div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400 truncate">
                          {exp.notes}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-ink-muted dark:text-neutral-300 font-medium text-[11px]">
                          <Tag className="w-3 h-3 text-ink-muted" />
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-ink-muted dark:text-neutral-400">
                        {exp.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400 font-mono">
                        {exp.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            exp.status === 'Reimbursed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : exp.status === 'Approved'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : exp.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                        ${exp.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceipt(exp)}
                            title="View Receipt Slip"
                            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {exp.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(exp.id)}
                                title="Approve Claim"
                                className="p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReject(exp.id)}
                                title="Reject Claim"
                                className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {exp.status === 'Approved' && exp.paymentMethod === 'Reimbursement' && (
                            <button
                              onClick={() => handleMarkReimbursed(exp.id)}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer"
                            >
                              Pay Out
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

      {/* ─── TAB 2: APPROVAL QUEUE ─── */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#141513] p-4 rounded-2xl border border-border dark:border-[#2A2B27] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink dark:text-white">
                  Manager Sign-Off Roster
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  {pendingClaims.length} expenses require management verification before reimbursement payout.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              ${metrics.pendingAmount.toFixed(2)} Total Queue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingClaims.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                No pending claims! All staff expenses have been approved or reimbursed.
              </div>
            ) : (
              pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#84CC16]">
                          {claim.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          Pending Approval
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink dark:text-white">{claim.merchant}</h4>
                      <p className="text-xs text-ink-muted dark:text-neutral-400">
                        Submitted by <span className="font-semibold text-ink dark:text-neutral-200">{claim.submitter}</span> ({claim.department})
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-black text-ink dark:text-white">
                        ${claim.amount.toFixed(2)}
                      </div>
                      <span className="text-[10px] font-mono text-ink-muted">{claim.date}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] text-xs text-ink-muted dark:text-neutral-300">
                    <span className="font-semibold text-ink dark:text-white">Purpose: </span>
                    {claim.notes}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border dark:border-[#2A2B27]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-ink-muted">
                        Method: {claim.paymentMethod}
                      </span>
                      {claim.taxDeductible && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                          Tax Deductible
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(claim.id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleApprove(claim.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve Claim
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: RECEIPT VAULT ─── */}
      {activeTab === 'receipts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelectedReceipt(exp)}
                className="group bg-white dark:bg-[#1A1B18] rounded-2xl p-4 border border-border dark:border-[#2A2B27] shadow-xs hover:border-[#84CC16]/50 transition-all cursor-pointer space-y-3"
              >
                <div className="h-28 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group-hover:bg-[#84CC16]/5 transition-colors">
                  <ReceiptIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mb-1 group-hover:text-[#84CC16] transition-colors" />
                  <span className="text-xs font-mono font-bold text-ink dark:text-white truncate w-full">
                    {exp.merchant}
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted dark:text-neutral-400">
                    {exp.date} • {exp.id}
                  </span>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] font-bold">
                    VOUCHER
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-ink dark:text-white">{exp.submitter}</p>
                    <p className="text-[10px] text-ink-muted dark:text-neutral-400">{exp.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-black text-sm text-ink dark:text-white">
                      ${exp.amount.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-[#84CC16] font-bold">Click to view slip</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: SPENDING & BUDGETS ─── */}
      {activeTab === 'budgets' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-6 border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">
              Departmental Spending Caps &amp; Monthly Allocations
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Target budgets for October 2026. Automated alerts trigger when any bucket reaches 85% of limit.
            </p>
          </div>

          <div className="space-y-4">
            {CATEGORY_BUDGETS.map((budget) => {
              const percentage = Math.min(100, Math.round((budget.spent / budget.monthlyLimit) * 100));
              return (
                <div key={budget.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink dark:text-white">{budget.category}</span>
                      <span className="text-ink-muted dark:text-neutral-400 font-mono">
                        (${budget.spent.toFixed(2)} of ${budget.monthlyLimit.toLocaleString()})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-ink dark:text-neutral-200">
                      {percentage}% Used
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: budget.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] dark:bg-[#141513] border border-border dark:border-[#2A2B27] flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-ink dark:text-white">All Buckets Healthy</p>
              <p className="text-ink-muted dark:text-neutral-400 leading-relaxed">
                Overall organization expense burn is at 22.5% of total $10,000 monthly allowance. No budget overruns detected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: LOG NEW EXPENSE ─── */}
      {isNewExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Record New Expense
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Submit business spending for approval and reimbursement.
                </p>
              </div>
              <button
                onClick={() => setIsNewExpenseOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Employee Submitter
                  </label>
                  <select
                    value={newSubmitter}
                    onChange={(e) => {
                      setNewSubmitter(e.target.value);
                      if (e.target.value === 'Carlos Mendez') setNewDepartment('Field Services');
                      if (e.target.value === 'Maya Lin') setNewDepartment('Revenue Ops');
                      if (e.target.value === 'Devon Vance') setNewDepartment('Supply Chain');
                      if (e.target.value === 'Sarah Chen') setNewDepartment('Finance');
                      if (e.target.value === 'Yash Rawat') setNewDepartment('Leadership');
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
                  >
                    <option value="Carlos Mendez">Carlos Mendez</option>
                    <option value="Maya Lin">Maya Lin</option>
                    <option value="Devon Vance">Devon Vance</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Yash Rawat">Yash Rawat</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
                  >
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Software & Subscriptions">Software & Subscriptions</option>
                    <option value="Client Entertainment">Client Entertainment</option>
                    <option value="Equipment & Safety">Equipment & Safety</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Merchant / Vendor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shell, Delta, Home Depot"
                    value={newMerchant}
                    onChange={(e) => setNewMerchant(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Amount ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.50"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#84CC16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#84CC16]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
                  >
                    <option value="Reimbursement">Employee Out-of-Pocket</option>
                    <option value="Company Card">Company Credit Card</option>
                    <option value="Petty Cash">Petty Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Business Purpose / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why this expense was required..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#84CC16]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taxDeductibleCheck"
                  checked={newTaxDeductible}
                  onChange={(e) => setNewTaxDeductible(e.target.checked)}
                  className="rounded text-[#84CC16] focus:ring-[#84CC16]"
                />
                <label htmlFor="taxDeductibleCheck" className="text-xs text-ink dark:text-neutral-300 select-none cursor-pointer">
                  Tag as Corporate Tax Deductible (valid business expense)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewExpenseOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#84CC16] hover:bg-[#72B313] text-black transition-colors cursor-pointer shadow-sm"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: RECEIPT VOUCHER PREVIEW ─── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div className="flex items-center gap-2">
                <ReceiptIcon className="w-5 h-5 text-[#84CC16]" />
                <h3 className="text-base font-black text-ink dark:text-white tracking-tight">
                  Receipt Voucher #{selectedReceipt.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt Voucher Slip Mockup */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 font-mono text-xs space-y-3">
              <div className="text-center pb-2 border-b border-dashed border-neutral-300 dark:border-neutral-700">
                <p className="font-bold text-sm text-ink dark:text-white uppercase tracking-wider">
                  {selectedReceipt.merchant}
                </p>
                <p className="text-[10px] text-ink-muted">Transaction Date: {selectedReceipt.date}</p>
                <p className="text-[10px] text-ink-muted">Claim Reference: {selectedReceipt.id}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Submitter:</span>
                  <span className="font-bold text-ink dark:text-white">{selectedReceipt.submitter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Department:</span>
                  <span className="text-ink dark:text-white">{selectedReceipt.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Category:</span>
                  <span className="text-ink dark:text-white">{selectedReceipt.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Payment:</span>
                  <span className="text-ink dark:text-white">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Tax Deductible:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedReceipt.taxDeductible ? 'Yes (100% Qualified)' : 'No'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-neutral-300 dark:border-neutral-700 flex justify-between items-center text-sm font-bold">
                <span>TOTAL AMOUNT:</span>
                <span className="text-base font-black text-ink dark:text-white">
                  ${selectedReceipt.amount.toFixed(2)}
                </span>
              </div>

              <div className="pt-2 text-[10px] text-ink-muted italic border-t border-neutral-200 dark:border-neutral-800">
                &quot;{selectedReceipt.notes}&quot;
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
