'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PenTool,
  Send,
  DollarSign,
  FileCheck,
} from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  category: 'Service Contract (MSA)' | 'Non-Disclosure Agreement (NDA)' | 'Vendor Agreement' | 'Employment Contract' | 'Equipment Lease';
  counterparty: string;
  signerEmail: string;
  contractValue: number;
  effectiveDate: string;
  expiryDate: string;
  status: 'Signed' | 'Out for Signature' | 'Draft' | 'Expired';
  signedAt?: string;
  certificateHash?: string;
  notes: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultValidityMonths: number;
}

interface AuditEvent {
  id: string;
  docId: string;
  action: string;
  actor: string;
  ipAddress: string;
  timestamp: string;
}

const INITIAL_DOCS: LegalDocument[] = [
  {
    id: 'DOC-501',
    title: 'Master Commercial Services Agreement (MSA)',
    category: 'Service Contract (MSA)',
    counterparty: 'Apex Logistics Hub',
    signerEmail: 'rachel@apexlogistics.io',
    contractValue: 120000,
    effectiveDate: '2026-10-01',
    expiryDate: '2027-10-01',
    status: 'Signed',
    signedAt: '2026-10-01 14:22 UTC',
    certificateHash: 'sha256-8f4b23c9a1d4e7f0923b817c6e',
    notes: 'Comprehensive multi-facility HVAC and electrical dispatch support agreement.',
  },
  {
    id: 'DOC-502',
    title: 'Mutual Commercial Non-Disclosure Agreement',
    category: 'Non-Disclosure Agreement (NDA)',
    counterparty: 'Green Garden Cafe Franchises',
    signerEmail: 'd.miller@greengarden.com',
    contractValue: 0,
    effectiveDate: '2026-10-18',
    expiryDate: '2028-10-18',
    status: 'Signed',
    signedAt: '2026-10-18 11:05 UTC',
    certificateHash: 'sha256-3b17c9e021a8f94d82b6e11409',
    notes: 'Confidentiality agreement protecting proprietary IoT sensor firmware schemas.',
  },
  {
    id: 'DOC-503',
    title: 'Warehouse Logistics Service Level Agreement (SLA)',
    category: 'Vendor Agreement',
    counterparty: 'Nordic Warehouses Ltd',
    signerEmail: 'marcus@nordicwarehouses.se',
    contractValue: 48000,
    effectiveDate: '2026-11-01',
    expiryDate: '2027-11-01',
    status: 'Out for Signature',
    notes: 'Guaranteed 2-hour field response time for refrigeration units during peak freight season.',
  },
  {
    id: 'DOC-504',
    title: 'Senior Field Technician Employment Contract',
    category: 'Employment Contract',
    counterparty: 'Carlos Mendez',
    signerEmail: 'carlos@bahi.app',
    contractValue: 85000,
    effectiveDate: '2024-06-01',
    expiryDate: '2027-06-01',
    status: 'Signed',
    signedAt: '2024-05-28 09:14 UTC',
    certificateHash: 'sha256-11b490f84a22c9e70183b24d77',
    notes: 'Standard full-time employment agreement with vehicle tool allowance clause.',
  },
  {
    id: 'DOC-505',
    title: 'High-Capacity Refrigerant Reclaimer Lease Contract',
    category: 'Equipment Lease',
    counterparty: 'Grainger Industrial Machinery',
    signerEmail: 'leasing@grainger.com',
    contractValue: 14500,
    effectiveDate: '2026-11-15',
    expiryDate: '2027-11-15',
    status: 'Draft',
    notes: '12-month lease with buyout option for dual-recovery recovery pump unit.',
  },
];

const TEMPLATES: ContractTemplate[] = [
  {
    id: 'TPL-01',
    name: 'Standard Master Services Agreement (MSA)',
    category: 'Service Contract',
    description: 'General commercial terms, payment schedules, liability indemnification, and SLA standards.',
    defaultValidityMonths: 12,
  },
  {
    id: 'TPL-02',
    name: 'Mutual Bilateral Non-Disclosure Agreement (NDA)',
    category: 'Confidentiality',
    description: 'Two-way proprietary trade secret protection for vendor evaluations and partner negotiations.',
    defaultValidityMonths: 24,
  },
  {
    id: 'TPL-03',
    name: 'Independent Subcontractor Field Agreement',
    category: 'Contractor',
    description: 'Scope of field service work, OSHA safety certifications, insurance requirements, and hourly billing rates.',
    defaultValidityMonths: 6,
  },
  {
    id: 'TPL-04',
    name: 'Commercial Equipment Lease & Bailment',
    category: 'Equipment Lease',
    description: 'Machinery custody terms, damage deductible, preventative maintenance responsibility, and return condition.',
    defaultValidityMonths: 12,
  },
];

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  { id: 'ADT-91', docId: 'DOC-501', action: 'Electronic Signature Executed', actor: 'rachel@apexlogistics.io', ipAddress: '192.168.1.104', timestamp: '2026-10-01 14:22 UTC' },
  { id: 'ADT-92', docId: 'DOC-502', action: 'Document Countersigned', actor: 'yash@bahi.app', ipAddress: '10.0.4.12', timestamp: '2026-10-18 11:05 UTC' },
  { id: 'ADT-93', docId: 'DOC-503', action: 'Signature Request Dispatched', actor: 'maya@bahi.app', ipAddress: '10.0.4.15', timestamp: '2026-11-01 09:30 UTC' },
  { id: 'ADT-94', docId: 'DOC-504', action: 'Certificate Stored in Immutable Vault', actor: 'System Daemon', ipAddress: '127.0.0.1', timestamp: '2024-05-28 09:15 UTC' },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<LegalDocument[]>(INITIAL_DOCS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = useState<'vault' | 'signing' | 'templates' | 'audit'>('vault');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [signModalDoc, setSignModalDoc] = useState<LegalDocument | null>(null);
  const [signTypedName, setSignTypedName] = useState('Yash Rawat');
  const [signAgreeChecked, setSignAgreeChecked] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New Doc Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Service Contract (MSA)' | 'Non-Disclosure Agreement (NDA)' | 'Vendor Agreement' | 'Employment Contract' | 'Equipment Lease'>('Service Contract (MSA)');
  const [newCounterparty, setNewCounterparty] = useState('');
  const [newSignerEmail, setNewSignerEmail] = useState('');
  const [newContractValue, setNewContractValue] = useState('');
  const [newEffectiveDate, setNewEffectiveDate] = useState('2026-11-05');
  const [newExpiryDate, setNewExpiryDate] = useState('2027-11-05');
  const [newNotes, setNewNotes] = useState('');

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.counterparty.toLowerCase().includes(search.toLowerCase()) ||
        d.id.toLowerCase().includes(search.toLowerCase()) ||
        d.signerEmail.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [docs, search, categoryFilter, statusFilter]);

  // Out for signature documents
  const pendingSignDocs = useMemo(() => {
    return docs.filter((d) => d.status === 'Out for Signature');
  }, [docs]);

  // Metrics
  const metrics = useMemo(() => {
    const totalDocs = docs.length;
    const signedCount = docs.filter((d) => d.status === 'Signed').length;
    const pendingSignCount = pendingSignDocs.length;
    const totalValue = docs.reduce((acc, curr) => acc + curr.contractValue, 0);

    return { totalDocs, signedCount, pendingSignCount, totalValue };
  }, [docs, pendingSignDocs]);

  // Handlers
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCounterparty) return;

    const newId = `DOC-${500 + docs.length + 1}`;
    const valueNum = parseFloat(newContractValue) || 0;

    const newDoc: LegalDocument = {
      id: newId,
      title: newTitle,
      category: newCategory,
      counterparty: newCounterparty,
      signerEmail: newSignerEmail || 'client@example.com',
      contractValue: valueNum,
      effectiveDate: newEffectiveDate,
      expiryDate: newExpiryDate,
      status: 'Out for Signature',
      notes: newNotes || 'Dispatched for electronic signature via Bahi Documents.',
    };

    const newAudit: AuditEvent = {
      id: `ADT-${Date.now()}`,
      docId: newId,
      action: 'Document Created & Dispatched',
      actor: 'yash@bahi.app',
      ipAddress: '10.0.4.12',
      timestamp: 'Just now',
    };

    setDocs([newDoc, ...docs]);
    setAuditLogs([newAudit, ...auditLogs]);
    setIsNewDocOpen(false);

    // Reset Form
    setNewTitle('');
    setNewCounterparty('');
    setNewSignerEmail('');
    setNewContractValue('');
    setNewNotes('');
  };

  const handleExecuteSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signModalDoc || !signAgreeChecked || !signTypedName) return;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const hash = `sha256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const updated = {
      ...signModalDoc,
      status: 'Signed' as const,
      signedAt: timestamp,
      certificateHash: hash,
    };

    const auditEvent: AuditEvent = {
      id: `ADT-${Date.now()}`,
      docId: signModalDoc.id,
      action: `Legally Signed by ${signTypedName}`,
      actor: signTypedName,
      ipAddress: '10.0.4.12',
      timestamp,
    };

    setDocs((prev) => prev.map((d) => (d.id === signModalDoc.id ? updated : d)));
    setAuditLogs([auditEvent, ...auditLogs]);
    setSignModalDoc(null);
    setSignAgreeChecked(false);

    setNotificationMsg(`✓ Document ${updated.id} signed successfully and locked with cryptographic stamp.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleSendReminder = (docId: string, email: string) => {
    setNotificationMsg(`📧 Signature reminder email sent to ${email} for contract ${docId}.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Document ID',
      'Title',
      'Category',
      'Counterparty',
      'Signer Email',
      'Contract Value ($)',
      'Effective Date',
      'Expiry Date',
      'Status',
      'Signed At',
      'Certificate Hash',
      'Notes',
    ];

    const rows = filteredDocs.map((d) => [
      d.id,
      `"${d.title}"`,
      `"${d.category}"`,
      `"${d.counterparty}"`,
      d.signerEmail,
      d.contractValue.toFixed(2),
      d.effectiveDate,
      d.expiryDate,
      d.status,
      d.signedAt || 'N/A',
      d.certificateHash || 'Pending',
      `"${d.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_contracts_register_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30 font-mono">
              Documents
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Documents
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Store commercial agreements, manage electronic signatures, and maintain legal compliance records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-400" />
            Export Contracts
          </button>
          <button
            onClick={() => setIsNewDocOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Upload Contract
          </button>
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
        </div>
      </div>

      {/* Notification banner */}
      {notificationMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Active Contracts
            </span>
            <FileText className="w-4 h-4 text-[#6366F1]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.totalDocs}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Secure cloud repository
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Signed &amp; Enforceable
            </span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.signedCount}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Backed by cryptographic hash
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Awaiting Signature
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.pendingSignCount}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Pending client execution
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Total Contract Value
            </span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalValue.toLocaleString()}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Active annualized obligations
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'vault'
              ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Contracts Vault ({docs.length})
        </button>

        <button
          onClick={() => setActiveTab('signing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'signing'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <PenTool className="w-4 h-4" />
          E-Signature Dispatch
          {pendingSignDocs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
              {pendingSignDocs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-[#3E7FBF]/15 text-[#3E7FBF] border border-[#3E7FBF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Contract Templates ({TEMPLATES.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Cryptographic Audit Trail
        </button>
      </div>

      {/* ─── TAB 1: CONTRACTS VAULT ─── */}
      {activeTab === 'vault' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search contract, counterparty, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter documents by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Signed">Signed</option>
                <option value="Out for Signature">Out for Signature</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
              </select>

              <select
                aria-label="Filter documents by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Service Contract (MSA)">Service Contract</option>
                <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure (NDA)</option>
                <option value="Vendor Agreement">Vendor SLA</option>
                <option value="Employment Contract">Employment</option>
                <option value="Equipment Lease">Equipment Lease</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Contract Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Counterparty</th>
                  <th className="py-3 px-4">Term Dates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      No documents found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1]">
                        {doc.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-ink dark:text-white truncate">{doc.title}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400 truncate">{doc.notes}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-ink dark:text-neutral-200">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink dark:text-neutral-100">{doc.counterparty}</div>
                        <div className="text-[10px] font-mono text-ink-muted">{doc.signerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-ink-muted dark:text-neutral-400 text-[11px]">
                        {doc.effectiveDate} → {doc.expiryDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            doc.status === 'Signed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : doc.status === 'Out for Signature'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                        {doc.contractValue > 0 ? `$${doc.contractValue.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {doc.status === 'Out for Signature' && (
                            <button
                              onClick={() => setSignModalDoc(doc)}
                              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#6366F1] text-white hover:bg-[#4F46E5] transition-colors cursor-pointer"
                            >
                              Sign Now
                            </button>
                          )}
                          {doc.status === 'Signed' && (
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Verified
                            </span>
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

      {/* ─── TAB 2: E-SIGNATURE DISPATCH ─── */}
      {activeTab === 'signing' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink dark:text-white">Active Electronic Signatures Queue</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  {pendingSignDocs.length} contracts awaiting legal countersignature or client sign-off.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {pendingSignDocs.length} Pending Actions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSignDocs.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                All contracts are fully signed and executed!
              </div>
            ) : (
              pendingSignDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#6366F1]">{doc.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          {doc.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink dark:text-white">{doc.title}</h4>
                      <p className="text-xs text-ink-muted dark:text-neutral-400">
                        Signer: <strong className="text-ink dark:text-white">{doc.counterparty}</strong> ({doc.signerEmail})
                      </p>
                    </div>
                    {doc.contractValue > 0 && (
                      <div className="text-right">
                        <div className="text-base font-black font-mono text-ink dark:text-white">
                          ${doc.contractValue.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-ink-muted">Annualized</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] text-xs text-ink-muted dark:text-neutral-300">
                    {doc.notes}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border dark:border-[#2A2B27]">
                    <button
                      onClick={() => handleSendReminder(doc.id, doc.signerEmail)}
                      className="text-xs font-semibold text-ink-muted hover:text-ink dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Reminder
                    </button>
                    <button
                      onClick={() => setSignModalDoc(doc)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Sign Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: CONTRACT TEMPLATES ─── */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#6366F1] font-bold">{tpl.id} • {tpl.category}</span>
                  <h4 className="text-sm font-bold text-ink dark:text-white mt-0.5">{tpl.name}</h4>
                </div>
                <FileCheck className="w-4 h-4 text-neutral-400" />
              </div>

              <p className="text-xs text-ink-muted dark:text-neutral-300 leading-relaxed">
                {tpl.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border dark:border-[#2A2B27]">
                <span className="text-ink-muted">Default Validity: {tpl.defaultValidityMonths} Months</span>
                <button
                  onClick={() => {
                    setNewTitle(tpl.name);
                    setNewCategory(tpl.category === 'Service Contract' ? 'Service Contract (MSA)' : 'Non-Disclosure Agreement (NDA)');
                    setIsNewDocOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-ink dark:text-white font-semibold text-[11px] cursor-pointer"
                >
                  Use Template →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 4: CRYPTOGRAPHIC AUDIT LOGS ─── */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <h3 className="text-sm font-bold text-ink dark:text-white">Immutable Legal Audit Trail</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Cryptographically verified event signatures fulfilling eIDAS and UETA compliance requirements.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Event Ref</th>
                  <th className="py-3 px-4">Contract Ref</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Signer / Actor</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {auditLogs.map((ev) => (
                  <tr key={ev.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6366F1]">{ev.id}</td>
                    <td className="py-3.5 px-4 font-mono text-ink dark:text-white font-medium">{ev.docId}</td>
                    <td className="py-3.5 px-4 font-semibold text-ink dark:text-neutral-100">{ev.action}</td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300">{ev.actor}</td>
                    <td className="py-3.5 px-4 font-mono text-ink-muted">{ev.ipAddress}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-ink-muted">{ev.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL: UPLOAD CONTRACT ─── */}
      {isNewDocOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Add Legal Contract
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Register contract metadata and prepare e-signature dispatch.
                </p>
              </div>
              <button
                onClick={() => setIsNewDocOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Agreement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Logistics & Field Service Agreement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Document Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
                  >
                    <option value="Service Contract (MSA)">Service Contract (MSA)</option>
                    <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure (NDA)</option>
                    <option value="Vendor Agreement">Vendor Agreement</option>
                    <option value="Employment Contract">Employment Contract</option>
                    <option value="Equipment Lease">Equipment Lease</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Contract Value ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25000"
                    value={newContractValue}
                    onChange={(e) => setNewContractValue(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Counterparty / Signer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Logistics Hub"
                    value={newCounterparty}
                    onChange={(e) => setNewCounterparty(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Signatory Email
                  </label>
                  <input
                    type="email"
                    placeholder="signer@apexlogistics.io"
                    value={newSignerEmail}
                    onChange={(e) => setNewSignerEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Effective Start Date
                  </label>
                  <input
                    type="date"
                    value={newEffectiveDate}
                    onChange={(e) => setNewEffectiveDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Contract Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Agreement Details / Special Clauses
                </label>
                <textarea
                  rows={2}
                  placeholder="Key terms, warranty coverage, termination clauses..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewDocOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Save &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: E-SIGNATURE SIMULATOR ─── */}
      {signModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#6366F1]" />
                <h3 className="text-base font-black text-ink dark:text-white">
                  Execute Electronic Signature
                </h3>
              </div>
              <button
                onClick={() => setSignModalDoc(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Contract Ref:</span>
                <span className="font-mono font-bold text-ink dark:text-white">{signModalDoc.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Title:</span>
                <span className="font-semibold text-ink dark:text-white truncate max-w-[200px]">{signModalDoc.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Counterparty:</span>
                <span className="text-ink dark:text-white">{signModalDoc.counterparty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Value:</span>
                <span className="font-mono font-bold text-ink dark:text-white">
                  ${signModalDoc.contractValue.toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleExecuteSignature} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Adopt Signature Name
                </label>
                <input
                  type="text"
                  required
                  value={signTypedName}
                  onChange={(e) => setSignTypedName(e.target.value)}
                  className="w-full text-base font-serif italic p-3 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-white text-center"
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="signAgree"
                  required
                  checked={signAgreeChecked}
                  onChange={(e) => setSignAgreeChecked(e.target.checked)}
                  className="mt-0.5 rounded text-[#6366F1] focus:ring-[#6366F1] cursor-pointer"
                />
                <label htmlFor="signAgree" className="text-[11px] text-ink-muted dark:text-neutral-300 leading-tight select-none cursor-pointer">
                  I agree that my electronic signature is the legally binding equivalent to my handwritten signature on this contract.
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setSignModalDoc(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!signAgreeChecked}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 text-white transition-colors cursor-pointer shadow-sm"
                >
                  Execute Legal Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
