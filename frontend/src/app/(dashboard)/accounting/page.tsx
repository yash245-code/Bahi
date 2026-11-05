'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Landmark,
  Plus,
  Search,
  Download,
  ChevronRight,
  X,
  FileText,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  CreditCard,
  PieChart,
  ShieldCheck,
  Calendar,
  Wallet,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export type TransactionType = 'Income' | 'Expense' | 'Transfer';

export interface LedgerTransaction {
  id: string;
  ref: string;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  accountId: string;
  accountName: string;
  payeeOrPayer: string;
  amount: number;
  cleared: boolean;
  notes?: string;
}

export interface BankAccount {
  id: string;
  code: string;
  name: string;
  institution: string;
  type: 'Operating Checking' | 'Merchant Clearing' | 'Business Savings' | 'Cash & Petty Cash' | 'Credit Facility';
  accountNumberMask: string;
  currentBalance: number;
  currency: string;
  lastReconciledDate: string;
  status: 'Active' | 'Requires Sync';
}

export interface TaxLineItem {
  id: string;
  period: string;
  taxCategory: string;
  grossTaxableSales: number;
  taxCollected: number;
  taxPaidOnPurchases: number;
  netTaxPayable: number;
  dueDate: string;
  status: 'Current' | 'Filed & Settled';
}

// ─── Initial Data for Tenant Company ─────────────────────────────────────────

const initialBankAccounts: BankAccount[] = [
  {
    id: 'acc-1',
    code: '1010',
    name: 'Primary Operating Checking',
    institution: 'Chase Commercial Banking',
    type: 'Operating Checking',
    accountNumberMask: '•••• 4892',
    currentBalance: 58420.0,
    currency: 'USD',
    lastReconciledDate: '2026-11-01',
    status: 'Active',
  },
  {
    id: 'acc-2',
    code: '1020',
    name: 'Online Merchant Clearing',
    institution: 'Stripe Payments',
    type: 'Merchant Clearing',
    accountNumberMask: '•••• STRIPE',
    currentBalance: 12950.0,
    currency: 'USD',
    lastReconciledDate: '2026-11-04',
    status: 'Active',
  },
  {
    id: 'acc-3',
    code: '1030',
    name: 'High-Yield Treasury Reserve',
    institution: 'Morgan Stanley Business',
    type: 'Business Savings',
    accountNumberMask: '•••• 9104',
    currentBalance: 85000.0,
    currency: 'USD',
    lastReconciledDate: '2026-10-31',
    status: 'Active',
  },
  {
    id: 'acc-4',
    code: '1050',
    name: 'Field Cash & Petty Cash Vault',
    institution: 'On-Premises Safe',
    type: 'Cash & Petty Cash',
    accountNumberMask: 'VAULT-01',
    currentBalance: 2450.0,
    currency: 'USD',
    lastReconciledDate: '2026-11-02',
    status: 'Active',
  },
];

const initialTransactions: LedgerTransaction[] = [
  {
    id: 'tx-1',
    ref: 'TRX-9481',
    date: '2026-11-04',
    description: 'Client Settlement: Highland Residency Club (INV-2026-088)',
    type: 'Income',
    category: 'Commercial Service Revenue',
    accountId: 'acc-1',
    accountName: 'Primary Operating Checking',
    payeeOrPayer: 'Highland Residency Club',
    amount: 2150.0,
    cleared: true,
    notes: 'Direct ACH wire settlement for quarterly HVAC maintenance',
  },
  {
    id: 'tx-2',
    ref: 'TRX-9480',
    date: '2026-11-03',
    description: 'Supplier PO-2026-043 Settlement: Apex Fluid Power Ltd',
    type: 'Expense',
    category: 'Cost of Goods Sold (Materials)',
    accountId: 'acc-1',
    accountName: 'Primary Operating Checking',
    payeeOrPayer: 'Apex Fluid Power Ltd',
    amount: 4200.0,
    cleared: true,
    notes: 'Supplier payment for hydraulic valves & seals',
  },
  {
    id: 'tx-3',
    ref: 'TRX-9479',
    date: '2026-11-03',
    description: 'Client Card Payment: Green Garden Cafe (INV-2026-084)',
    type: 'Income',
    category: 'Equipment Maintenance Revenue',
    accountId: 'acc-2',
    accountName: 'Online Merchant Clearing',
    payeeOrPayer: 'Green Garden Cafe',
    amount: 3200.0,
    cleared: true,
    notes: 'Credit card payment via online customer portal',
  },
  {
    id: 'tx-4',
    ref: 'TRX-9478',
    date: '2026-11-02',
    description: 'Fleet Fuel & Field Van Maintenance',
    type: 'Expense',
    category: 'Vehicle & Transportation',
    accountId: 'acc-1',
    accountName: 'Primary Operating Checking',
    payeeOrPayer: 'Shell Fleet Commercial',
    amount: 485.5,
    cleared: true,
    notes: 'Fuel cards for Van 1, Van 2, Van 3',
  },
  {
    id: 'tx-5',
    ref: 'TRX-9477',
    date: '2026-11-01',
    description: 'Central Warehouse Facility Rent & Utilities',
    type: 'Expense',
    category: 'Facilities & Rent',
    accountId: 'acc-1',
    accountName: 'Primary Operating Checking',
    payeeOrPayer: 'Prologis Industrial Properties',
    amount: 3850.0,
    cleared: true,
    notes: 'November rent for Newark Central Depot WH-MAIN',
  },
  {
    id: 'tx-6',
    ref: 'TRX-9476',
    date: '2026-10-30',
    description: 'Transfer from Stripe Clearing to Operating Checking',
    type: 'Transfer',
    category: 'Internal Account Transfer',
    accountId: 'acc-1',
    accountName: 'Primary Operating Checking',
    payeeOrPayer: 'Internal Transfer',
    amount: 8500.0,
    cleared: true,
    notes: 'Automated weekly payout from Stripe balance',
  },
  {
    id: 'tx-7',
    ref: 'TRX-9475',
    date: '2026-10-29',
    description: 'Technician Emergency Parts Petty Cash Advance',
    type: 'Expense',
    category: 'Field Operations Incidentals',
    accountId: 'acc-4',
    accountName: 'Field Cash & Petty Cash Vault',
    payeeOrPayer: 'Carlos Mendez (Tech Lead)',
    amount: 180.0,
    cleared: true,
    notes: 'Hardware store replacement coupling for emergency call',
  },
];

const initialTaxData: TaxLineItem[] = [
  {
    id: 'tax-1',
    period: 'Q3 2026 (Jul - Sep)',
    taxCategory: 'State & Local Sales Tax',
    grossTaxableSales: 94800.0,
    taxCollected: 7584.0,
    taxPaidOnPurchases: 2140.0,
    netTaxPayable: 5444.0,
    dueDate: '2026-10-31',
    status: 'Filed & Settled',
  },
  {
    id: 'tax-2',
    period: 'Q4 2026 (Oct - Dec)',
    taxCategory: 'State & Local Sales Tax (Accruing)',
    grossTaxableSales: 41250.0,
    taxCollected: 3300.0,
    taxPaidOnPurchases: 980.0,
    netTaxPayable: 2320.0,
    dueDate: '2027-01-31',
    status: 'Current',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccountingPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState<'ledger' | 'accounts' | 'pl' | 'tax'>('ledger');

  // Core State
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(initialTransactions);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [taxLines] = useState<TaxLineItem[]>(initialTaxData);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

  // Modals & Drawers
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<LedgerTransaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Transaction Form State
  const [txType, setTxType] = useState<TransactionType>('Income');
  const [txDescription, setTxDescription] = useState('');
  const [txCategory, setTxCategory] = useState('Commercial Service Revenue');
  const [txAccountId, setTxAccountId] = useState(initialBankAccounts[0]?.id || '');
  const [txPayee, setTxPayee] = useState('');
  const [txAmount, setTxAmount] = useState<number>(500);
  const [txNotes, setTxNotes] = useState('');

  // New Account Form State
  const [newAccCode, setNewAccCode] = useState('1040');
  const [newAccName, setNewAccName] = useState('');
  const [newAccInst, setNewAccInst] = useState('');
  const [newAccType, setNewAccType] = useState<BankAccount['type']>('Operating Checking');
  const [newAccBalance, setNewAccBalance] = useState<number>(10000);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Filtered Data ──────────────────────────────────────────────────────────

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.ref.toLowerCase().includes(search.toLowerCase()) ||
        tx.payeeOrPayer.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === 'all' || tx.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesAccount = selectedAccountId === 'all' || tx.accountId === selectedAccountId;

      return matchesSearch && matchesType && matchesAccount;
    });
  }, [transactions, search, typeFilter, selectedAccountId]);

  // ─── Financial Calculations ─────────────────────────────────────────────────

  const totalCashOnHand = useMemo(() => {
    return bankAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  }, [bankAccounts]);

  const totalMonthlyIncome = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const totalMonthlyExpenses = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'Expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  const netOperatingIncome = useMemo(() => {
    return totalMonthlyIncome - totalMonthlyExpenses;
  }, [totalMonthlyIncome, totalMonthlyExpenses]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription.trim()) return;

    const targetAcc = bankAccounts.find((a) => a.id === txAccountId) || bankAccounts[0];
    if (!targetAcc) return;

    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      ref: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0] || '2026-11-05',
      description: txDescription.trim(),
      type: txType,
      category: txCategory,
      accountId: targetAcc.id,
      accountName: targetAcc.name,
      payeeOrPayer: txPayee.trim() || 'General Business Counterparty',
      amount: Number(txAmount),
      cleared: true,
      notes: txNotes.trim() || undefined,
    };

    setTransactions([newTx, ...transactions]);

    // Update account balance
    const balanceChange = txType === 'Income' ? Number(txAmount) : txType === 'Expense' ? -Number(txAmount) : 0;
    setBankAccounts(
      bankAccounts.map((a) =>
        a.id === targetAcc.id ? { ...a, currentBalance: a.currentBalance + balanceChange } : a
      )
    );

    setIsNewTxModalOpen(false);
    setTxDescription('');
    setTxPayee('');
    setTxAmount(500);
    setTxNotes('');
    showToast(`Recorded ${newTx.type} transaction ${newTx.ref} of ${formatCurrency(newTx.amount)}`);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const newAcc: BankAccount = {
      id: `acc-${Date.now()}`,
      code: newAccCode.trim() || '1060',
      name: newAccName.trim(),
      institution: newAccInst.trim() || 'Commercial Institution',
      type: newAccType,
      accountNumberMask: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      currentBalance: Number(newAccBalance),
      currency: 'USD',
      lastReconciledDate: new Date().toISOString().split('T')[0] || '2026-11-05',
      status: 'Active',
    };

    setBankAccounts([...bankAccounts, newAcc]);
    setIsNewAccountModalOpen(false);
    setNewAccName('');
    setNewAccInst('');
    setNewAccBalance(10000);
    showToast(`Bank account ${newAcc.name} added to company Chart of Accounts`);
  };

  const handleToggleReconciliation = (txId: string) => {
    const updated = transactions.map((t) => {
      if (t.id === txId) {
        return { ...t, cleared: !t.cleared };
      }
      return t;
    });

    setTransactions(updated);
    if (selectedTx && selectedTx.id === txId) {
      setSelectedTx({ ...selectedTx, cleared: !selectedTx.cleared });
    }
    showToast(`Updated bank reconciliation state for transaction`);
  };

  const handleExportCSV = () => {
    const headers = ['Ref,Date,Description,Type,Category,Account,Payee/Payer,Amount,Reconciled'];
    const rows = transactions.map((t) =>
      `"${t.ref}","${t.date}","${t.description}","${t.type}","${t.category}","${t.accountName}","${t.payeeOrPayer}",${t.amount},${t.cleared}`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bahi_general_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('General Ledger export downloaded as CSV');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-ink dark:text-neutral-100">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141513] text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-[#2E9169] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2E9169]/15 text-[#2E9169] dark:text-[#42B786] border border-[#2E9169]/30 font-mono">
              Bookkeeping &amp; Finances
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              General Ledger &amp; Cash Flow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Bookkeeping &amp; Finances
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Manage company bank accounts, monitor cash flow, balance the general ledger, and view your Profit &amp; Loss statements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            title="Download full CSV of general ledger"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewTxModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#2E9169] hover:bg-[#257554] border-[#2E9169]/40 cursor-pointer font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Cash &amp; Bank Reserves</span>
            <Wallet className="w-4 h-4 text-[#2E9169] dark:text-[#42B786]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{formatCurrency(totalCashOnHand)}</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Across {bankAccounts.length} accounts &amp; clearing</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Monthly Income</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            +{formatCurrency(totalMonthlyIncome)}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Inflows from clients &amp; contracts</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Operating Outflows</span>
            <ArrowUpRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            -{formatCurrency(totalMonthlyExpenses)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Supplies, fleet fuel &amp; facilities</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Net Operating Income</span>
            <TrendingUp className="w-4 h-4 text-[#2E9169] dark:text-[#42B786]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{formatCurrency(netOperatingIncome)}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            Profitable month (+{((netOperatingIncome / (totalMonthlyIncome || 1)) * 100).toFixed(1)}% margin)
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27]">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'ledger'
                ? 'border-[#2E9169] text-[#2E9169] dark:text-[#42B786] dark:border-[#42B786]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>General Ledger &amp; Transactions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {transactions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'accounts'
                ? 'border-[#2E9169] text-[#2E9169] dark:text-[#42B786] dark:border-[#42B786]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Chart of Accounts &amp; Banks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {bankAccounts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pl')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'pl'
                ? 'border-[#2E9169] text-[#2E9169] dark:text-[#42B786] dark:border-[#42B786]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Profit &amp; Loss Statement (P&amp;L)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tax')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'tax'
                ? 'border-[#2E9169] text-[#2E9169] dark:text-[#42B786] dark:border-[#42B786]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tax Reports &amp; Filing</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: GENERAL LEDGER & TRANSACTIONS ─────────────────────────── */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#1A1B18] p-3.5 rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['all', 'income', 'expense', 'transfer'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    typeFilter === t
                      ? 'bg-[#2E9169]/20 text-[#2E9169] dark:text-[#42B786] border border-[#2E9169]/30 font-bold'
                      : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {t}
                </button>
              ))}

              <span className="text-border dark:text-neutral-700 px-1">|</span>

              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="all">All Bank &amp; Ledger Accounts</option>
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.code} - {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search description, ref, payee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#2E9169]"
              />
              <Search className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2" />
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">Ref &amp; Date</th>
                    <th className="py-3 px-4">Description &amp; Payee</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Account</th>
                    <th className="py-3 px-4 text-center">Type</th>
                    <th className="py-3 px-4 text-right">Amount ($)</th>
                    <th className="py-3 px-4 text-center">Bank Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-400">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2E9169] dark:text-[#42B786]">
                          <div>{tx.ref}</div>
                          <span className="text-[10px] text-ink-muted dark:text-neutral-400 font-sans font-normal">
                            {tx.date}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-ink dark:text-white">{tx.description}</div>
                          <div className="text-[10px] text-ink-muted dark:text-neutral-400">
                            Counterparty: <span className="font-medium text-ink dark:text-neutral-200">{tx.payeeOrPayer}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-ink dark:text-neutral-300">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-medium text-[11px]">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-ink-muted dark:text-neutral-400">
                          {tx.accountName}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.type === 'Income'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : tx.type === 'Expense'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                          <span
                            className={
                              tx.type === 'Income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : tx.type === 'Expense'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-ink dark:text-white'
                            }
                          >
                            {tx.type === 'Income' ? '+' : tx.type === 'Expense' ? '-' : ''}
                            {formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.cleared
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {tx.cleared ? '✓ Reconciled' : '○ Pending'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTx(tx);
                            }}
                            className="text-xs font-semibold text-[#2E9169] dark:text-[#42B786] hover:underline px-2 py-1"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: CHART OF ACCOUNTS & BANKS ──────────────────────────────── */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ink dark:text-white">Chart of Accounts &amp; Banking Facilities</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Operating bank accounts, credit clearing gateways, and liquidity reserves for your business.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewAccountModalOpen(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#2E9169] hover:bg-[#257554] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Ledger Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2E9169]/10 text-[#2E9169] dark:text-[#42B786] border border-[#2E9169]/20">
                        {acc.code}
                      </span>
                      <h4 className="font-bold text-base text-ink dark:text-white">{acc.name}</h4>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1">
                      {acc.institution} • {acc.accountNumberMask}
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    ● {acc.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase font-bold">
                      Available Balance
                    </span>
                    <div className="text-2xl font-black text-ink dark:text-white font-mono mt-0.5">
                      {formatCurrency(acc.currentBalance)}
                    </div>
                  </div>
                  <CreditCard className="w-6 h-6 text-[#2E9169] dark:text-[#42B786] opacity-60" />
                </div>

                <div className="flex items-center justify-between text-xs text-ink-muted dark:text-neutral-400 pt-1 border-t border-border dark:border-[#2A2B27]">
                  <span>Last Reconciled: <strong className="font-mono text-ink dark:text-white">{acc.lastReconciledDate}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      setActiveTab('ledger');
                    }}
                    className="text-xs font-semibold text-[#2E9169] dark:text-[#42B786] hover:underline flex items-center gap-1"
                  >
                    <span>View Transactions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: PROFIT & LOSS STATEMENT ─────────────────────────────────── */}
      {activeTab === 'pl' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border dark:border-[#2A2B27] gap-2">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Profit &amp; Loss Statement (Income Statement)</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Fiscal Period: <strong className="text-ink dark:text-white">Current Month (November 2026)</strong> • Accrual Accounting
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
                  Healthy Cash Flow
                </span>
              </div>
            </div>

            {/* Operating Revenue Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-sm text-ink dark:text-white">
                <span className="uppercase tracking-wider text-xs text-[#2E9169] dark:text-[#42B786]">
                  1. Operating Revenue &amp; Income
                </span>
                <span className="font-mono">{formatCurrency(totalMonthlyIncome)}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Commercial Field Service &amp; Repair Jobs</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$18,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Recurring Equipment Maintenance Contracts</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$8,600.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Direct Parts &amp; Material Sales</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$5,350.00</span>
                </div>
              </div>
            </div>

            {/* Cost of Goods Sold Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-sm text-ink dark:text-white">
                <span className="uppercase tracking-wider text-xs text-amber-600 dark:text-amber-400">
                  2. Cost of Goods Sold (COGS)
                </span>
                <span className="font-mono text-rose-600 dark:text-rose-400">-$7,450.00</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Supplier Parts &amp; Consumables Procured</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$5,800.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Direct Inbound Freight &amp; Handling</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$1,650.00</span>
                </div>
              </div>
            </div>

            {/* Gross Profit Subtotal */}
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] flex items-center justify-between font-bold text-xs">
              <span className="uppercase text-ink dark:text-white font-bold">Gross Profit (Margin: 77.0%)</span>
              <span className="font-mono text-base text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalMonthlyIncome - 7450)}
              </span>
            </div>

            {/* Operating Expenses (OPEX) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-sm text-ink dark:text-white">
                <span className="uppercase tracking-wider text-xs text-rose-600 dark:text-rose-400">
                  3. Operating Expenses (OPEX)
                </span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  -{formatCurrency(totalMonthlyExpenses - 7450 > 0 ? totalMonthlyExpenses - 7450 : 10670)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Facilities Lease &amp; Warehouse Rent (WH-MAIN)</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$3,850.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Field Technician Staff Salaries &amp; Payroll</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$5,200.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Fleet Vans Fuel &amp; Maintenance</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$920.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Software, Communications &amp; Insurance</span>
                  <span className="font-mono font-semibold text-ink dark:text-white">$700.00</span>
                </div>
              </div>
            </div>

            {/* Net Profit Summary */}
            <div className="p-4 rounded-xl bg-[#2E9169]/10 border border-[#2E9169]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase font-bold">
                  Net Operating Profit (EBITDA)
                </span>
                <div className="text-2xl font-black text-[#2E9169] dark:text-[#42B786] font-mono mt-0.5">
                  {formatCurrency(netOperatingIncome)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{((netOperatingIncome / (totalMonthlyIncome || 1)) * 100).toFixed(1)}% Net Margin
                </span>
                <p className="text-[11px] text-ink-muted dark:text-neutral-400 mt-0.5">Retained for reinvestment</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: TAX REPORTS & FILING ────────────────────────────────────── */}
      {activeTab === 'tax' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border dark:border-[#2A2B27]">
              <h3 className="font-bold text-sm text-ink dark:text-white">Sales Tax Liability &amp; Filing Reports</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Track sales tax collected from customer invoices minus input tax credits on supplier materials.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Tax Type</th>
                    <th className="py-3 px-4 text-right">Taxable Sales</th>
                    <th className="py-3 px-4 text-right">Tax Collected</th>
                    <th className="py-3 px-4 text-right">Input Tax Credits</th>
                    <th className="py-3 px-4 text-right">Net Tax Payable</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-center">Filing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {taxLines.map((tax) => (
                    <tr key={tax.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-bold text-ink dark:text-white">{tax.period}</td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{tax.taxCategory}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-ink dark:text-white">
                        {formatCurrency(tax.grossTaxableSales)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(tax.taxCollected)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-rose-600 dark:text-rose-400">
                        -{formatCurrency(tax.taxPaidOnPurchases)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                        {formatCurrency(tax.netTaxPayable)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-ink-muted dark:text-neutral-400">{tax.dueDate}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tax.status === 'Filed & Settled'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {tax.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: RECORD TRANSACTION ───────────────────────────────────── */}
      {isNewTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Record Ledger Transaction</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">Log cash inflow, business expense, or internal transfer.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewTxModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Income', 'Expense', 'Transfer'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTxType(t)}
                      className={`py-2 px-2 rounded-lg font-bold text-center border transition-all cursor-pointer ${
                        txType === t
                          ? 'border-[#2E9169] bg-[#2E9169]/15 text-[#2E9169] dark:text-[#42B786]'
                          : 'border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-400 hover:text-ink'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Transaction Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client Wire Settlement for Service Job"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Account</label>
                  <select
                    value={txAccountId}
                    onChange={(e) => setTxAccountId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
                  >
                    {bankAccounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({formatCurrency(a.currentBalance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Accounting Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
                  >
                    <option value="Commercial Service Revenue">Commercial Service Revenue</option>
                    <option value="Equipment Maintenance Revenue">Equipment Maintenance Revenue</option>
                    <option value="Cost of Goods Sold (Materials)">Cost of Goods Sold (Materials)</option>
                    <option value="Facilities & Rent">Facilities &amp; Rent</option>
                    <option value="Vehicle & Transportation">Vehicle &amp; Transportation</option>
                    <option value="Payroll & Subcontractors">Payroll &amp; Subcontractors</option>
                    <option value="Software & Communications">Software &amp; Communications</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Counterparty (Payee / Payer)</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Logistics Hub"
                    value={txPayee}
                    onChange={(e) => setTxPayee(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Notes / Invoice Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Check #9901 or Wire Ref #WR-8841"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewTxModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#2E9169] hover:bg-[#257554] font-semibold"
                >
                  Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD BANK / LEDGER ACCOUNT ────────────────────────────── */}
      {isNewAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Add Ledger Account</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">Configure a bank or ledger asset in your Chart of Accounts.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewAccountModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block font-bold text-ink dark:text-white mb-1">Account Code</label>
                  <input
                    type="text"
                    required
                    placeholder="1040"
                    value={newAccCode}
                    onChange={(e) => setNewAccCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-ink dark:text-white mb-1">Account Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Payroll Operating Account"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Financial Institution / Bank</label>
                <input
                  type="text"
                  placeholder="e.g. Bank of America or Silicon Valley Bank"
                  value={newAccInst}
                  onChange={(e) => setNewAccInst(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Account Type</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  >
                    <option value="Operating Checking">Operating Checking</option>
                    <option value="Merchant Clearing">Merchant Clearing</option>
                    <option value="Business Savings">Business Savings</option>
                    <option value="Cash & Petty Cash">Cash &amp; Petty Cash</option>
                    <option value="Credit Facility">Credit Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Opening Balance ($)</label>
                  <input
                    type="number"
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewAccountModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#2E9169] hover:bg-[#257554]"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DRAWER 3: TRANSACTION DETAILS & RECONCILIATION ────────────────── */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border-l border-border dark:border-[#2A2B27] h-full max-w-md w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#2E9169] dark:text-[#42B786]">
                    {selectedTx.ref}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedTx.type === 'Income'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : selectedTx.type === 'Expense'
                        ? 'bg-rose-500/10 text-rose-600'
                        : 'bg-sky-500/10 text-sky-600'
                    }`}
                  >
                    {selectedTx.type}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-black text-ink dark:text-white">{selectedTx.description}</h2>
                <div className="text-xs text-ink-muted dark:text-neutral-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Posted Date: {selectedTx.date}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Transaction Amount</span>
                  <span className="font-mono font-black text-base text-ink dark:text-white">
                    {formatCurrency(selectedTx.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Account</span>
                  <span className="font-medium text-ink dark:text-white font-mono">{selectedTx.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Category</span>
                  <span className="font-medium text-ink dark:text-white">{selectedTx.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Counterparty</span>
                  <span className="font-medium text-ink dark:text-white">{selectedTx.payeeOrPayer}</span>
                </div>
                {selectedTx.notes && (
                  <div className="pt-2 border-t border-border dark:border-[#2A2B27]">
                    <span className="text-ink-muted dark:text-neutral-400 block mb-0.5">Notes:</span>
                    <span className="text-ink dark:text-white">{selectedTx.notes}</span>
                  </div>
                )}
              </div>

              {/* Reconciliation Status Toggle */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase font-bold">
                    Bank Statement Reconciliation
                  </span>
                  <div className="text-sm font-bold text-ink dark:text-white mt-0.5">
                    {selectedTx.cleared ? 'Cleared & Verified' : 'Unreconciled'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleReconciliation(selectedTx.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTx.cleared
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedTx.cleared ? 'Mark Unreconciled' : 'Mark Cleared'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border dark:border-[#2A2B27] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
