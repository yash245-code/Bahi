'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Phone,
  Mail,
  X,
  FileText,
  CreditCard,
  Send,
  Copy,
  Paperclip,
  ExternalLink,
  Clock,
  AlertTriangle,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Void';
export type PaymentChannel = 'Stripe Card' | 'Bank Transfer (ACH)' | 'Check' | 'Wire Transfer';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRatePercent: number;
}

export interface CustomerInvoice {
  id: string;
  customerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: 'Due on Receipt' | 'Net 15' | 'Net 30' | 'Net 60';
  status: InvoiceStatus;
  paymentChannel: PaymentChannel;
  amountPaid: number;
  lineItems: InvoiceLineItem[];
  customerNotes?: string;
  paymentLink: string;
  attachedFilesCount: number;
}

export interface CustomerBillingFile {
  id: string;
  customerName: string;
  title: string;
  category: 'Signed Service Agreement' | 'Work Order Sign-Off' | 'Tax Exemption Certificate' | 'Proof of Delivery' | 'Rate Schedule';
  fileName: string;
  fileSize: string;
  uploadDate: string;
  linkedInvoiceId?: string;
}

// ─── Initial Demo Data for Tenant Business ───────────────────────────────────

const initialInvoices: CustomerInvoice[] = [
  {
    id: 'INV-2026-084',
    customerName: 'Green Garden Cafe',
    contactPerson: 'Leo Barnes (Owner)',
    email: 'billing@greengardencafe.com',
    phone: '+1 (555) 441-3991',
    billingAddress: '14 Elm Street, Downtown, NY 10012',
    issueDate: '2026-10-20',
    dueDate: '2026-11-04',
    paymentTerms: 'Net 15',
    status: 'Paid',
    paymentChannel: 'Stripe Card',
    amountPaid: 3200.0,
    paymentLink: 'https://pay.bahi.app/inv_849201',
    attachedFilesCount: 2,
    customerNotes: 'Quarterly espresso machine maintenance & boiler descaling.',
    lineItems: [
      { id: 'li-1', description: 'Commercial Espresso Boiler Descaling & Pressure Calibration', quantity: 1, unitPrice: 2800.0, taxRatePercent: 8.5 },
      { id: 'li-2', description: 'High-Temperature Seal & Gasket Replacements', quantity: 2, unitPrice: 200.0, taxRatePercent: 8.5 },
    ],
  },
  {
    id: 'INV-2026-085',
    customerName: 'Apex Logistics Hub',
    contactPerson: 'Sarah Jenkins (VP Logistics)',
    email: 'accounts@apexlogistics.com',
    phone: '+1 (555) 782-9400',
    billingAddress: '88 Industrial Blvd, Dock 4, Newark, NJ 07114',
    issueDate: '2026-10-21',
    dueDate: '2026-11-20',
    paymentTerms: 'Net 30',
    status: 'Sent',
    paymentChannel: 'Bank Transfer (ACH)',
    amountPaid: 0,
    paymentLink: 'https://pay.bahi.app/inv_849202',
    attachedFilesCount: 1,
    customerNotes: 'Forklift hydraulic calibration & emergency loading dock pump servicing.',
    lineItems: [
      { id: 'li-3', description: 'Hydraulic Valve Calibration & Pressure Test', quantity: 2, unitPrice: 1800.0, taxRatePercent: 0 },
      { id: 'li-4', description: 'Heavy Duty Fluid Replacements & Seals (Series 400)', quantity: 1, unitPrice: 1150.0, taxRatePercent: 0 },
    ],
  },
  {
    id: 'INV-2026-086',
    customerName: 'Nordic Warehouses',
    contactPerson: 'Erik Thorsen',
    email: 'finance@nordicstorage.com',
    phone: '+1 (555) 349-1100',
    billingAddress: '25 Harbor Road, Pier 7, Long Beach, CA 90802',
    issueDate: '2026-10-10',
    dueDate: '2026-10-25',
    paymentTerms: 'Net 15',
    status: 'Overdue',
    paymentChannel: 'Bank Transfer (ACH)',
    amountPaid: 0,
    paymentLink: 'https://pay.bahi.app/inv_849203',
    attachedFilesCount: 1,
    customerNotes: 'Refrigerated cold-room temperature sensor synchronization.',
    lineItems: [
      { id: 'li-5', description: 'Refrigerated Cold-Room VFD Telemetry Setup', quantity: 1, unitPrice: 1850.0, taxRatePercent: 0 },
    ],
  },
  {
    id: 'INV-2026-087',
    customerName: 'Summit Medical Clinic',
    contactPerson: 'Dr. Katherine Wells',
    email: 'katherine.wells@summithealth.org',
    phone: '+1 (555) 901-2244',
    billingAddress: '100 Medical Center Way, Austin, TX 78701',
    issueDate: '2026-10-23',
    dueDate: '2026-11-23',
    paymentTerms: 'Net 30',
    status: 'Partially Paid',
    paymentChannel: 'Bank Transfer (ACH)',
    amountPaid: 900.0,
    paymentLink: 'https://pay.bahi.app/inv_849204',
    attachedFilesCount: 3,
    customerNotes: 'Emergency backup generator annual safety load testing certificate.',
    lineItems: [
      { id: 'li-6', description: 'Annual Healthcare Backup Power Load Compliance Audit', quantity: 1, unitPrice: 1850.0, taxRatePercent: 0 },
    ],
  },
  {
    id: 'INV-2026-088',
    customerName: 'Highland Residency Club',
    contactPerson: 'Arthur Vance',
    email: 'management@highlandresidency.com',
    phone: '+1 (555) 231-9022',
    billingAddress: '420 Park Ave, New York, NY 10022',
    issueDate: '2026-10-18',
    dueDate: '2026-11-02',
    paymentTerms: 'Net 15',
    status: 'Paid',
    paymentChannel: 'Wire Transfer',
    amountPaid: 2150.0,
    paymentLink: 'https://pay.bahi.app/inv_849205',
    attachedFilesCount: 2,
    customerNotes: 'HVAC seasonal filter bank replacement and refrigerant balance.',
    lineItems: [
      { id: 'li-7', description: 'Quarterly Central Rooftop Chiller Maintenance', quantity: 1, unitPrice: 1700.0, taxRatePercent: 8.875 },
      { id: 'li-8', description: 'AirPure Filter Cartridges 24x24x2 (Pack of 8)', quantity: 1, unitPrice: 450.0, taxRatePercent: 8.875 },
    ],
  },
];

const initialCustomerFiles: CustomerBillingFile[] = [
  {
    id: 'doc-1',
    customerName: 'Highland Residency Club',
    title: 'Executed Annual Chiller Maintenance Agreement 2026-2027',
    category: 'Signed Service Agreement',
    fileName: 'Highland_Signed_Master_Contract_2026.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-10-18',
    linkedInvoiceId: 'INV-2026-088',
  },
  {
    id: 'doc-2',
    customerName: 'Summit Medical Clinic',
    title: 'State Healthcare Backup Generator Compliance Certificate',
    category: 'Work Order Sign-Off',
    fileName: 'Summit_Generator_Load_Cert_signed.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-10-23',
    linkedInvoiceId: 'INV-2026-087',
  },
  {
    id: 'doc-3',
    customerName: 'Apex Logistics Hub',
    title: 'Federal Tax Exemption Certificate (Resale / Commercial Freight)',
    category: 'Tax Exemption Certificate',
    fileName: 'Apex_Tax_Exemption_Form_ST4.pdf',
    fileSize: '840 KB',
    uploadDate: '2026-09-12',
  },
  {
    id: 'doc-4',
    customerName: 'Green Garden Cafe',
    title: 'Work Order WO-4093 Customer Completion Acceptance Slip',
    category: 'Work Order Sign-Off',
    fileName: 'GreenGarden_WO_4093_Signed_Receipt.pdf',
    fileSize: '620 KB',
    uploadDate: '2026-10-20',
    linkedInvoiceId: 'INV-2026-084',
  },
  {
    id: 'doc-5',
    customerName: 'Nordic Warehouses',
    title: 'Pier 7 Cold-Room Telemetry Handover Protocol',
    category: 'Proof of Delivery',
    fileName: 'Nordic_Telemetry_Handover_Signed.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-10-11',
    linkedInvoiceId: 'INV-2026-086',
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

function calculateInvoiceTotal(inv: CustomerInvoice): number {
  return inv.lineItems.reduce((acc, li) => {
    const lineSubtotal = li.quantity * li.unitPrice;
    const lineTax = (lineSubtotal * (li.taxRatePercent || 0)) / 100;
    return acc + lineSubtotal + lineTax;
  }, 0);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvoicingPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState<'invoices' | 'files' | 'portal' | 'reminders'>('invoices');

  // Core State
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(initialInvoices);
  const [customerFiles, setCustomerFiles] = useState<CustomerBillingFile[]>(initialCustomerFiles);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  // Modals & Drawers
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUploadFileModalOpen, setIsUploadFileModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Invoice Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustContact, setNewCustContact] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newTerms, setNewTerms] = useState<CustomerInvoice['paymentTerms']>('Net 30');
  const [newDueDate, setNewDueDate] = useState('2026-12-05');
  const [newChannel, setNewChannel] = useState<PaymentChannel>('Bank Transfer (ACH)');
  const [newNotes, setNewNotes] = useState('Thank you for your business. Please remit payment by the due date.');
  const [lineItemsForm, setLineItemsForm] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Commercial Maintenance & Service Labor', quantity: 1, unitPrice: 650.0, taxRatePercent: 0 },
  ]);

  // Payment Recording State
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [paymentRef, setPaymentRef] = useState('');

  // Upload File State
  const [docCustomer, setDocCustomer] = useState(initialInvoices[0]?.customerName || '');
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<CustomerBillingFile['category']>('Signed Service Agreement');
  const [docFileName, setDocFileName] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Filtered Data ──────────────────────────────────────────────────────────

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
        inv.email.toLowerCase().includes(search.toLowerCase()) ||
        inv.lineItems.some((li) => li.description.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesChannel = channelFilter === 'all' || inv.paymentChannel.toLowerCase() === channelFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [invoices, search, statusFilter, channelFilter]);

  // ─── Financial Calculations ─────────────────────────────────────────────────

  const totalInvoicedAmount = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0);
  }, [invoices]);

  const totalCollectedAmount = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  }, [invoices]);

  const totalOutstandingBalance = useMemo(() => {
    return totalInvoicedAmount - totalCollectedAmount;
  }, [totalInvoicedAmount, totalCollectedAmount]);

  const overdueInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.status === 'Overdue');
  }, [invoices]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddLineItemRow = () => {
    const newItem: InvoiceLineItem = {
      id: `li-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 150.0,
      taxRatePercent: 0,
    };
    setLineItemsForm([...lineItemsForm, newItem]);
  };

  const handleRemoveLineItemRow = (id: string) => {
    if (lineItemsForm.length <= 1) return;
    setLineItemsForm(lineItemsForm.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLineItemsForm(
      lineItemsForm.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculatedSubtotal = useMemo(() => {
    return lineItemsForm.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [lineItemsForm]);

  const calculatedTaxTotal = useMemo(() => {
    return lineItemsForm.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.taxRatePercent || 0)) / 100, 0);
  }, [lineItemsForm]);

  const calculatedGrandTotal = useMemo(() => {
    return calculatedSubtotal + calculatedTaxTotal;
  }, [calculatedSubtotal, calculatedTaxTotal]);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const newInvId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: CustomerInvoice = {
      id: newInvId,
      customerName: newCustName.trim(),
      contactPerson: newCustContact.trim() || 'Purchasing Department',
      email: newCustEmail.trim() || 'billing@customer.com',
      phone: newCustPhone.trim() || '+1 (555) 000-0000',
      billingAddress: newCustAddress.trim() || 'Primary Business Address',
      issueDate: new Date().toISOString().split('T')[0] || '2026-11-05',
      dueDate: newDueDate || '2026-12-05',
      paymentTerms: newTerms,
      status: 'Sent',
      paymentChannel: newChannel,
      amountPaid: 0,
      paymentLink: `https://pay.bahi.app/inv_${Math.floor(100000 + Math.random() * 900000)}`,
      attachedFilesCount: 0,
      customerNotes: newNotes,
      lineItems: lineItemsForm.map((li) => ({
        ...li,
        description: li.description.trim() || 'Professional Services',
      })),
    };

    setInvoices([newInvoice, ...invoices]);
    setIsNewInvoiceModalOpen(false);

    // Reset Form
    setNewCustName('');
    setNewCustContact('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustAddress('');
    showToast(`Invoice ${newInvoice.id} generated for ${newInvoice.customerName}`);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const paymentNum = Number(paymentAmount);
    if (paymentNum <= 0) return;

    const totalInvoice = calculateInvoiceTotal(selectedInvoice);
    const newAmountPaid = Math.min(totalInvoice, selectedInvoice.amountPaid + paymentNum);
    const newStatus: InvoiceStatus = newAmountPaid >= totalInvoice ? 'Paid' : 'Partially Paid';

    const updated = invoices.map((inv) =>
      inv.id === selectedInvoice.id
        ? {
            ...inv,
            amountPaid: newAmountPaid,
            status: newStatus,
          }
        : inv
    );

    setInvoices(updated);
    setSelectedInvoice({
      ...selectedInvoice,
      amountPaid: newAmountPaid,
      status: newStatus,
    });

    setIsPaymentModalOpen(false);
    setPaymentAmount(500);
    setPaymentRef('');
    showToast(`Recorded payment of ${formatCurrency(paymentNum)} for ${selectedInvoice.id}`);
  };

  const handleCreateCustomerFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docCustomer.trim()) return;

    const newFile: CustomerBillingFile = {
      id: `doc-${Date.now()}`,
      customerName: docCustomer.trim(),
      title: docTitle.trim(),
      category: docCategory,
      fileName: docFileName.trim() || `${docTitle.trim().replace(/\s+/g, '_')}.pdf`,
      fileSize: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0] || '2026-11-05',
    };

    setCustomerFiles([newFile, ...customerFiles]);
    setIsUploadFileModalOpen(false);
    setDocTitle('');
    setDocFileName('');
    showToast(`File "${newFile.fileName}" attached to ${newFile.customerName}`);
  };

  const handleCopyPaymentLink = (link: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showToast('Customer payment portal link copied to clipboard');
    } else {
      showToast('Payment link: ' + link);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Invoice #,Customer,Contact,Email,Issue Date,Due Date,Terms,Status,Channel,Amount Invoiced,Amount Paid,Balance Due'];
    const rows = invoices.map((inv) => {
      const total = calculateInvoiceTotal(inv);
      const balance = total - inv.amountPaid;
      return `"${inv.id}","${inv.customerName}","${inv.contactPerson}","${inv.email}","${inv.issueDate}","${inv.dueDate}","${inv.paymentTerms}","${inv.status}","${inv.paymentChannel}",${total},${inv.amountPaid},${balance}`;
    });
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bahi_customer_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Accounts Receivable invoices exported as CSV');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-ink dark:text-neutral-100">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141513] text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669] dark:text-[#34D399] border border-[#10B981]/30 font-mono">
              Invoices &amp; Customer Files
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Accounts Receivable
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Customer Invoices &amp; Billing
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Issue branded customer invoices, share instant payment links, attach client billing files, and manage collections.
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
            title="Download full CSV of all invoices"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] border-[#10B981]/40 cursor-pointer font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Customer Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Invoiced</span>
            <Receipt className="w-4 h-4 text-[#10B981] dark:text-[#34D399]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{formatCurrency(totalInvoicedAmount)}</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Across {invoices.length} issued invoices</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Collected Payments</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(totalCollectedAmount)}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {((totalCollectedAmount / (totalInvoicedAmount || 1)) * 100).toFixed(1)}% realization rate
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Awaiting Payment</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {formatCurrency(totalOutstandingBalance)}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Pending customer settlement</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overdue Bills</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {overdueInvoices.length} <span className="text-xs font-normal text-ink-muted dark:text-neutral-400">overdue</span>
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Automatic reminders active</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27]">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'invoices'
                ? 'border-[#10B981] text-[#059669] dark:text-[#34D399] dark:border-[#34D399]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Customer Invoices</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {invoices.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'files'
                ? 'border-[#10B981] text-[#059669] dark:text-[#34D399] dark:border-[#34D399]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Paperclip className="w-4 h-4" />
            <span>Customer Billing Files &amp; Contracts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {customerFiles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portal')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'portal'
                ? 'border-[#10B981] text-[#059669] dark:text-[#34D399] dark:border-[#34D399]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Payment Links &amp; Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reminders')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'reminders'
                ? 'border-[#10B981] text-[#059669] dark:text-[#34D399] dark:border-[#34D399]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Collections &amp; Reminders</span>
            {overdueInvoices.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-mono font-bold">
                {overdueInvoices.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── TAB 1: INVOICES LIST ──────────────────────────────────────────── */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#1A1B18] p-3.5 rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['all', 'sent', 'paid', 'partially paid', 'overdue', 'draft'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] border border-[#10B981]/30 font-bold'
                      : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {st}
                </button>
              ))}

              <span className="text-border dark:text-neutral-700 px-1">|</span>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="all">All Payment Channels</option>
                <option value="stripe card">Stripe Card</option>
                <option value="bank transfer (ach)">Bank Transfer (ACH)</option>
                <option value="wire transfer">Wire Transfer</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search invoice #, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#10B981]"
              />
              <Search className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2" />
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">Invoice # &amp; Date</th>
                    <th className="py-3 px-4">Client &amp; Contact</th>
                    <th className="py-3 px-4">Payment Terms &amp; Due</th>
                    <th className="py-3 px-4">Payment Channel</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Invoiced / Paid</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-400">
                        No customer invoices found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => {
                      const total = calculateInvoiceTotal(inv);
                      const balanceDue = total - inv.amountPaid;
                      return (
                        <tr
                          key={inv.id}
                          onClick={() => setSelectedInvoice(inv)}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#059669] dark:text-[#34D399]">
                            <div>{inv.id}</div>
                            <span className="text-[10px] text-ink-muted dark:text-neutral-400 font-sans font-normal">
                              {inv.issueDate}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-ink dark:text-white">{inv.customerName}</div>
                            <div className="text-[10px] text-ink-muted dark:text-neutral-400 flex items-center gap-1">
                              <span>{inv.contactPerson}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-ink dark:text-neutral-300">
                            <span className="font-semibold">{inv.dueDate}</span>
                            <div className="text-[10px] text-ink-muted dark:text-neutral-400">{inv.paymentTerms}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium text-ink dark:text-neutral-200">
                              {inv.paymentChannel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : inv.status === 'Partially Paid'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : inv.status === 'Sent'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : inv.status === 'Overdue'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : 'bg-neutral-500/10 text-neutral-500'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs">
                            <div className="font-bold text-ink dark:text-white">{formatCurrency(total)}</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                              Paid: {formatCurrency(inv.amountPaid)}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                            <span className={balanceDue > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                              {formatCurrency(balanceDue)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(inv);
                              }}
                              className="text-xs font-semibold text-[#059669] dark:text-[#34D399] hover:underline px-2 py-1"
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: CUSTOMER BILLING FILES & ATTACHMENTS ────────────────────── */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ink dark:text-white">Customer Billing Files &amp; Contract Documents</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Centralized cloud repository for client service agreements, signed work orders, and tax exemption filings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadFileModalOpen(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Upload Customer File</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerFiles.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] dark:text-[#34D399]">
                      {doc.category}
                    </span>
                    <h4 className="font-bold text-sm text-ink dark:text-white mt-1 line-clamp-1">{doc.title}</h4>
                    <p className="text-xs text-ink-muted dark:text-neutral-400">{doc.customerName}</p>
                  </div>
                  <FileText className="w-5 h-5 text-ink-muted dark:text-neutral-400 flex-shrink-0" />
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] flex items-center justify-between text-xs">
                  <div className="truncate max-w-[180px]">
                    <span className="font-mono text-ink dark:text-white font-medium">{doc.fileName}</span>
                  </div>
                  <span className="text-ink-muted dark:text-neutral-400 font-mono">{doc.fileSize}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border dark:border-[#2A2B27]">
                  <span className="text-ink-muted dark:text-neutral-400 text-[11px]">Uploaded: {doc.uploadDate}</span>
                  <button
                    type="button"
                    onClick={() => showToast(`Downloading ${doc.fileName}...`)}
                    className="text-xs font-semibold text-[#059669] dark:text-[#34D399] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Download</span>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: PAYMENT LINKS & PORTAL ──────────────────────────────────── */}
      {activeTab === 'portal' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-ink dark:text-white">Active Customer Payment Links</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Share one-click checkout URLs with clients to collect payment via Credit Card, Apple Pay, or direct Bank ACH.
              </p>
            </div>

            <div className="space-y-3">
              {invoices
                .filter((inv) => inv.status !== 'Paid')
                .map((inv) => {
                  const balanceDue = calculateInvoiceTotal(inv) - inv.amountPaid;
                  return (
                    <div
                      key={inv.id}
                      className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#059669] dark:text-[#34D399]">{inv.id}</span>
                          <span className="font-bold text-sm text-ink dark:text-white">{inv.customerName}</span>
                        </div>
                        <p className="text-xs text-ink-muted dark:text-neutral-400">
                          Balance Due: <strong className="font-mono text-ink dark:text-white">{formatCurrency(balanceDue)}</strong> • Due Date: {inv.dueDate}
                        </p>
                        <div className="font-mono text-[11px] text-ink-muted dark:text-neutral-400 select-all">
                          {inv.paymentLink}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleCopyPaymentLink(inv.paymentLink)}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsPaymentModalOpen(true);
                          }}
                          className="btn-primary text-xs py-1.5 px-3 bg-[#10B981] hover:bg-[#059669] flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Record Payment</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: REMINDERS & COLLECTIONS ─────────────────────────────────── */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-rose-900 dark:text-rose-300">
                Collections Center: {overdueInvoices.length} invoices require payment follow-up
              </h3>
              <p className="text-xs text-rose-800 dark:text-rose-400 mt-0.5">
                Send professional email reminders with embedded payment links to recover past-due customer balances.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer &amp; Contact</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Overdue Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Follow-up Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {overdueInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        All invoices are up to date! Zero past-due accounts.
                      </td>
                    </tr>
                  ) : (
                    overdueInvoices.map((inv) => {
                      const balance = calculateInvoiceTotal(inv) - inv.amountPaid;
                      return (
                        <tr key={inv.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                          <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">{inv.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-ink dark:text-white">{inv.customerName}</div>
                            <div className="text-[10px] text-ink-muted dark:text-neutral-400">{inv.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">{inv.dueDate}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white text-sm">
                            {formatCurrency(balance)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Past Due
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`Sent payment reminder email to ${inv.email}`)}
                              className="btn-primary text-xs py-1 px-3 bg-rose-600 hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer ml-auto font-semibold"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Send Reminder</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: CREATE INVOICE ────────────────────────────────────────── */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Create Customer Invoice</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">Generate an invoice and payment link for your client.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Supplies"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Arthur Vance"
                    value={newCustContact}
                    onChange={(e) => setNewCustContact(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Billing Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="billing@customer.com"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Billing Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Billing Address</label>
                <input
                  type="text"
                  placeholder="e.g. 100 Commercial Blvd, Dock 4"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Payment Terms</label>
                  <select
                    value={newTerms}
                    onChange={(e) => setNewTerms(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Preferred Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  >
                    <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                    <option value="Stripe Card">Stripe Card</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 pt-2 border-t border-border dark:border-[#2A2B27]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink dark:text-white uppercase tracking-wider text-[11px]">
                    Itemized Billing Rows
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItemRow}
                    className="text-xs font-semibold text-[#059669] dark:text-[#34D399] hover:underline"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItemsForm.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-neutral-50 dark:bg-neutral-900/60 p-2 rounded-lg border border-border dark:border-[#2A2B27]">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Service / Product Description"
                          value={item.description}
                          onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                          className="w-full p-1.5 rounded border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full p-1.5 rounded border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-mono text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full p-1.5 rounded border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-mono text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        {lineItemsForm.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItemRow(item.id)}
                            className="text-ink-muted hover:text-rose-500"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-ink-muted dark:text-neutral-400">
                    Subtotal: <strong className="text-ink dark:text-white font-mono">{formatCurrency(calculatedSubtotal)}</strong>
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-ink-muted uppercase">Grand Total: </span>
                    <span className="font-mono font-black text-sm text-[#059669] dark:text-[#34D399]">
                      {formatCurrency(calculatedGrandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Customer Memo / Payment Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#10B981] hover:bg-[#059669] font-semibold"
                >
                  Send Invoice to Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: RECORD PAYMENT ────────────────────────────────────────── */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Record Customer Payment</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Log payment received for {selectedInvoice.id} ({selectedInvoice.customerName})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Total Invoice Amount</span>
                  <span className="font-mono font-bold text-ink dark:text-white">
                    {formatCurrency(calculateInvoiceTotal(selectedInvoice))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Previously Paid</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatCurrency(selectedInvoice.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-ink dark:text-white">Current Balance Due</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {formatCurrency(calculateInvoiceTotal(selectedInvoice) - selectedInvoice.amountPaid)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Payment Amount ($) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Transaction Ref / Check Number</label>
                <input
                  type="text"
                  placeholder="e.g. Wire Ref #WR-9941 or Check #402"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#10B981] hover:bg-[#059669] font-semibold"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: UPLOAD CUSTOMER BILLING FILE ──────────────────────────── */}
      {isUploadFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Upload Customer Billing Document</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">Attach client signed contracts, work orders, or tax forms.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadFileModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerFile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Customer / Client Account *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Highland Residency Club"
                  value={docCustomer}
                  onChange={(e) => setDocCustomer(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Service Agreement 2026-2027"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Document Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                >
                  <option value="Signed Service Agreement">Signed Service Agreement</option>
                  <option value="Work Order Sign-Off">Work Order Sign-Off</option>
                  <option value="Tax Exemption Certificate">Tax Exemption Certificate</option>
                  <option value="Proof of Delivery">Proof of Delivery</option>
                  <option value="Rate Schedule">Rate Schedule</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master_Agreement_signed.pdf"
                  value={docFileName}
                  onChange={(e) => setDocFileName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsUploadFileModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#10B981] hover:bg-[#059669]"
                >
                  Upload &amp; Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DRAWER 4: INVOICE INSPECTOR & PREVIEW ─────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border-l border-border dark:border-[#2A2B27] h-full max-w-lg w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#059669] dark:text-[#34D399]">
                    {selectedInvoice.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedInvoice.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : selectedInvoice.status === 'Partially Paid'
                        ? 'bg-blue-500/10 text-blue-600'
                        : selectedInvoice.status === 'Overdue'
                        ? 'bg-rose-500/10 text-rose-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-black text-ink dark:text-white">{selectedInvoice.customerName}</h2>
                <div className="text-xs text-ink-muted dark:text-neutral-400 mt-1 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedInvoice.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedInvoice.phone}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] text-xs">
                <div>
                  <span className="text-ink-muted dark:text-neutral-400 text-[10px] uppercase">Issue Date</span>
                  <div className="font-mono font-bold text-ink dark:text-white">{selectedInvoice.issueDate}</div>
                </div>
                <div>
                  <span className="text-ink-muted dark:text-neutral-400 text-[10px] uppercase">Payment Due</span>
                  <div className="font-mono font-bold text-ink dark:text-white">{selectedInvoice.dueDate}</div>
                </div>
                <div>
                  <span className="text-ink-muted dark:text-neutral-400 text-[10px] uppercase">Terms</span>
                  <div className="font-semibold text-ink dark:text-white">{selectedInvoice.paymentTerms}</div>
                </div>
                <div>
                  <span className="text-ink-muted dark:text-neutral-400 text-[10px] uppercase">Channel</span>
                  <div className="font-semibold text-ink dark:text-white">{selectedInvoice.paymentChannel}</div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-white block">
                  Billed Products &amp; Services
                </span>
                <div className="space-y-1.5">
                  {selectedInvoice.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-ink dark:text-white">{item.description}</div>
                        <span className="text-[10px] text-ink-muted dark:text-neutral-400 font-mono">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-ink dark:text-white text-right">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Total Invoice Amount</span>
                  <span className="font-mono font-bold text-ink dark:text-white">
                    {formatCurrency(calculateInvoiceTotal(selectedInvoice))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted dark:text-neutral-400">Amount Paid</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(selectedInvoice.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border dark:border-[#2A2B27] font-bold text-sm">
                  <span className="text-ink dark:text-white">Balance Due</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {formatCurrency(calculateInvoiceTotal(selectedInvoice) - selectedInvoice.amountPaid)}
                  </span>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div className="p-3 rounded-xl border border-dashed border-[#10B981]/50 bg-[#10B981]/5 space-y-1.5 text-xs">
                <span className="font-bold text-ink dark:text-white flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                  <span>Client Checkout Portal</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedInvoice.paymentLink}
                    className="flex-1 p-1.5 rounded border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white text-[11px] font-mono select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyPaymentLink(selectedInvoice.paymentLink)}
                    className="btn-secondary py-1.5 px-2.5 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border dark:border-[#2A2B27] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="btn-primary py-2 px-4 text-xs bg-[#10B981] hover:bg-[#059669] flex items-center gap-1.5 font-bold"
              >
                <CreditCard className="w-4 h-4" />
                <span>Record Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
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
