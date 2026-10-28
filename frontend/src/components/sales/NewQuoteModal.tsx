'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  Building,
  TrendingUp,
  PackagePlus,
} from 'lucide-react';
import {
  catalogProducts,
  crmCustomerPresets,
  calculateQuoteMargin,
  Quote,
  QuoteLine,
  CurrencyCode,
  formatCurrency,
  CrmCustomerPreset,
} from './salesData';

interface NewQuoteModalProps {
  isOpen: boolean;
  currency?: CurrencyCode;
  quoteToEdit?: Quote | null;
  onClose: () => void;
  onCreateQuote: (quote: Quote) => void;
  onUpdateQuote?: (quote: Quote) => void;
}

export function NewQuoteModal({
  isOpen,
  currency = 'USD',
  quoteToEdit = null,
  onClose,
  onCreateQuote,
  onUpdateQuote,
}: NewQuoteModalProps) {
  const isEditMode = !!quoteToEdit;

  const [customer, setCustomer] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [validDays, setValidDays] = useState(14);
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState<number>(8.0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [lines, setLines] = useState<QuoteLine[]>([]);

  const firstProd = catalogProducts[0] || {
    id: 'PROD-01',
    name: 'Cloud ERP Core Tenant License',
    sku: 'ERP-CORE-01',
    unitPrice: 450.0,
    unitCost: 180.0,
    category: 'Software',
  };

  // Sync state on open or quoteToEdit change
  useEffect(() => {
    if (isOpen) {
      if (quoteToEdit) {
        setCustomer(quoteToEdit.customer);
        setContact(quoteToEdit.contact);
        setEmail(quoteToEdit.email);
        setPhone(quoteToEdit.phone);
        setPaymentTerms(quoteToEdit.paymentTerms || 'Net 30');
        setNotes(quoteToEdit.notes || '');
        setTaxRate(quoteToEdit.taxRate ?? (quoteToEdit.subtotal > 0 ? Math.round((quoteToEdit.tax / quoteToEdit.subtotal) * 1000) / 10 : 8.0));
        setShippingFee(quoteToEdit.shippingFee || 0);
        setLines(
          quoteToEdit.lines.map((l) => ({
            ...l,
            unitCost: l.unitCost ?? catalogProducts.find((p) => p.id === l.productId)?.unitCost ?? l.unitPrice * 0.55,
          }))
        );
      } else {
        // Reset to initial new quote defaults
        setCustomer('');
        setContact('');
        setEmail('');
        setPhone('+1 (555) 234-5678');
        setPaymentTerms('Net 30');
        setValidDays(14);
        setNotes('');
        setTaxRate(8.0);
        setShippingFee(0);
        setLines([
          {
            id: `QL-init-${Date.now()}`,
            productId: firstProd.id,
            productName: firstProd.name,
            sku: firstProd.sku,
            quantity: 2,
            unitPrice: firstProd.unitPrice,
            unitCost: firstProd.unitCost,
            discountPercent: 0,
            total: firstProd.unitPrice * 2,
          },
        ]);
      }
    }
  }, [isOpen, quoteToEdit]);

  if (!isOpen) return null;

  // CRM preset selection handler
  const handleSelectCrmCustomer = (preset: CrmCustomerPreset) => {
    setCustomer(preset.customer);
    setContact(preset.contact);
    setEmail(preset.email);
    setPhone(preset.phone);
    setPaymentTerms(preset.paymentTerms);

    // Apply customer's default tier discount to lines if lines have 0 discount
    if (preset.defaultDiscount > 0) {
      setLines((prev) =>
        prev.map((l) => {
          const disc = l.discountPercent > 0 ? l.discountPercent : preset.defaultDiscount;
          const total = l.quantity * l.unitPrice * (1 - disc / 100);
          return {
            ...l,
            discountPercent: disc,
            total: Math.round(total * 100) / 100,
          };
        })
      );
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    if (productId === '__custom__') {
      // Switch line to custom non-catalog item
      setLines((prev) => {
        const next = [...prev];
        const current = next[index];
        if (!current) return prev;
        next[index] = {
          ...current,
          productId: `PROD-CUST-${Date.now()}`,
          productName: 'Custom Solution / Ad-hoc Service',
          sku: 'CUST-SVC',
          isCustom: true,
          unitPrice: 500.0,
          unitCost: 200.0,
          total: current.quantity * 500.0 * (1 - current.discountPercent / 100),
        };
        return next;
      });
      return;
    }

    const selected = catalogProducts.find((p) => p.id === productId);
    if (!selected) return;

    setLines((prev) => {
      const next = [...prev];
      const current = next[index];
      if (!current) return prev;
      const qty = current.quantity;
      const disc = current.discountPercent;
      const total = qty * selected.unitPrice * (1 - disc / 100);

      next[index] = {
        id: current.id,
        productId: selected.id,
        productName: selected.name,
        sku: selected.sku,
        isCustom: false,
        quantity: qty,
        unitPrice: selected.unitPrice,
        unitCost: selected.unitCost,
        discountPercent: disc,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleCustomNameChange = (index: number, name: string) => {
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      next[index] = { ...item, productName: name };
      return next;
    });
  };

  const handleCustomSkuChange = (index: number, sku: string) => {
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      next[index] = { ...item, sku };
      return next;
    });
  };

  const handleUnitPriceChange = (index: number, price: number) => {
    const p = Math.max(0, price);
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      const total = item.quantity * p * (1 - item.discountPercent / 100);
      next[index] = {
        ...item,
        unitPrice: p,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const q = Math.max(1, quantity);
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      const total = q * item.unitPrice * (1 - item.discountPercent / 100);
      next[index] = {
        ...item,
        quantity: q,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleDiscountChange = (index: number, discount: number) => {
    const d = Math.min(50, Math.max(0, discount));
    setLines((prev) => {
      const next = [...prev];
      const item = next[index];
      if (!item) return prev;
      const total = item.quantity * item.unitPrice * (1 - d / 100);
      next[index] = {
        ...item,
        discountPercent: d,
        total: Math.round(total * 100) / 100,
      };
      return next;
    });
  };

  const handleApplyGlobalDiscount = (percent: number) => {
    setLines((prev) =>
      prev.map((l) => {
        const total = l.quantity * l.unitPrice * (1 - percent / 100);
        return {
          ...l,
          discountPercent: percent,
          total: Math.round(total * 100) / 100,
        };
      })
    );
  };

  const handleAddLine = (custom: boolean = false) => {
    if (custom) {
      setLines((prev) => [
        ...prev,
        {
          id: `QL-cust-${Date.now()}`,
          productId: `PROD-CUST-${Date.now()}`,
          productName: 'Custom Engineering / Consulting',
          sku: 'CUST-ENG',
          isCustom: true,
          quantity: 1,
          unitPrice: 650.0,
          unitCost: 260.0,
          discountPercent: 0,
          total: 650.0,
        },
      ]);
      return;
    }

    const prod = catalogProducts[lines.length % catalogProducts.length] || firstProd;
    setLines((prev) => [
      ...prev,
      {
        id: `QL-new-${Date.now()}`,
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        isCustom: false,
        quantity: 1,
        unitPrice: prod.unitPrice,
        unitCost: prod.unitCost,
        discountPercent: 0,
        total: prod.unitPrice,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  // AI Copilot Actions
  const applyAIPricingOptimization = () => {
    setLines((prev) =>
      prev.map((l) => {
        const optDisc = l.quantity >= 2 ? 8 : 5;
        const total = l.quantity * l.unitPrice * (1 - optDisc / 100);
        return {
          ...l,
          discountPercent: optDisc,
          total: Math.round(total * 100) / 100,
        };
      })
    );
    setPaymentTerms('Net 30');
    setNotes(
      (prev) =>
        prev ||
        'Optimized commercial terms: Includes complimentary deployment SLA and 30-day onboarding guarantee.'
    );
  };

  const addUpsellAuditService = () => {
    const auditProd = catalogProducts.find((p) => p.id === 'PROD-06') || {
      id: 'PROD-06',
      name: 'Multi-Tenant Security & Compliance Audit',
      sku: 'SEC-AUD-06',
      unitPrice: 1200.0,
      unitCost: 450.0,
      category: 'Services',
    };

    if (lines.some((l) => l.productId === auditProd.id)) return;

    setLines((prev) => [
      ...prev,
      {
        id: `QL-upsell-${Date.now()}`,
        productId: auditProd.id,
        productName: auditProd.name,
        sku: auditProd.sku,
        isCustom: false,
        quantity: 1,
        unitPrice: auditProd.unitPrice,
        unitCost: auditProd.unitCost,
        discountPercent: 10,
        total: auditProd.unitPrice * 0.9,
      },
    ]);
  };

  // Calculations
  const subtotal = lines.reduce((acc, l) => acc + l.total, 0);
  const tax = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.round((subtotal + tax + shippingFee) * 100) / 100;

  // Margin Analysis Barometer
  const marginStats = calculateQuoteMargin(lines, shippingFee);

  // Policy Safeguard
  const maxDiscountInQuote = Math.max(...lines.map((l) => l.discountPercent), 0);
  const marginFloorBreached = maxDiscountInQuote > 25;

  // AI Win probability estimation
  const avgDiscount = lines.length ? lines.reduce((sum, l) => sum + l.discountPercent, 0) / lines.length : 0;
  let estimatedWinOdds = 65;
  if (avgDiscount >= 5 && avgDiscount <= 15) estimatedWinOdds = 88;
  if (avgDiscount > 15) estimatedWinOdds = 94;
  if (lines.length >= 3) estimatedWinOdds += 4;
  if (paymentTerms === 'Net 60') estimatedWinOdds -= 8;
  estimatedWinOdds = Math.min(98, Math.max(45, estimatedWinOdds));

  const handleSubmit = (status: 'Draft' | 'Sent') => {
    if (!customer.trim()) return;

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + validDays);

    if (isEditMode && quoteToEdit && onUpdateQuote) {
      const updated: Quote = {
        ...quoteToEdit,
        customer: customer.trim(),
        contact: contact.trim() || 'Primary Procurement',
        email: email.trim() || 'procurement@client.com',
        phone: phone.trim() || '+1 (555) 000-0000',
        amount: grandTotal,
        subtotal,
        tax,
        taxRate,
        shippingFee,
        discountPercent: Math.round(avgDiscount),
        itemsCount: lines.reduce((acc, l) => acc + l.quantity, 0),
        paymentTerms,
        status: status === 'Sent' ? 'Sent' : quoteToEdit.status,
        winProbability: estimatedWinOdds,
        notes: notes.trim() || undefined,
        lines,
      };
      onUpdateQuote(updated);
      onClose();
      return;
    }

    const newQuote: Quote = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customer: customer.trim(),
      contact: contact.trim() || 'Primary Procurement',
      email: email.trim() || 'procurement@client.com',
      phone: phone.trim() || '+1 (555) 000-0000',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      validUntil: expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: grandTotal,
      subtotal,
      tax,
      taxRate,
      shippingFee,
      discountPercent: Math.round(avgDiscount),
      itemsCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      paymentTerms,
      status,
      version: 1,
      winProbability: estimatedWinOdds,
      tags: ['New Opportunity', ...(lines.length > 2 ? ['Multi-Line Bundle'] : [])],
      notes: notes.trim() || undefined,
      lines,
    };

    onCreateQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80 dark:border-[#2A2B27]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#A8462F]/10 dark:bg-[#A8462F]/20 text-[#A8462F] flex items-center justify-center border border-[#A8462F]/25">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-ink dark:text-neutral-100 tracking-tight">
                  {isEditMode ? `Edit Quotation ${quoteToEdit?.id}` : 'New Commercial Quotation'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold">
                  {currency} Currency
                </span>
                {isEditMode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                    Editing Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                {isEditMode
                  ? 'Update line items, pricing, custom ad-hoc charges, and client terms'
                  : 'Generate itemized pricing proposal with automated CRM auto-fill, custom items, and margin safeguards.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CRM Quick Picker Bar */}
        {!isEditMode && (
          <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-[#141513] border border-border/80 dark:border-[#2A2B27] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-white">
                <Building className="w-3.5 h-3.5 text-accent" />
                <span>Auto-fill from CRM Customer Accounts:</span>
              </div>
              <span className="text-[10px] text-ink-muted dark:text-neutral-500">
                Click any company to pre-populate contact details &amp; tier discount
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {crmCustomerPresets.map((crm) => (
                <button
                  key={crm.id}
                  type="button"
                  onClick={() => handleSelectCrmCustomer(crm)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    customer === crm.customer
                      ? 'border-accent bg-accent/10 text-accent font-bold shadow-2xs'
                      : 'border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink-muted dark:text-neutral-300 hover:border-accent/40'
                  }`}
                >
                  <span>{crm.customer}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-neutral-200/60 dark:bg-neutral-800 font-mono text-ink-muted dark:text-neutral-400">
                    {crm.tier}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Quote Copilot Bar */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-accent/10 via-purple-500/10 to-blue-500/10 border border-accent/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-ink dark:text-white">
                <span>AI Quotation Copilot</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  Win Probability: {estimatedWinOdds}%
                </span>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-neutral-400">
                Optimal price bundle detected. Win odds peak around 8-10% discount.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={applyAIPricingOptimization}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimize Pricing</span>
            </button>
            <button
              type="button"
              onClick={addUpsellAuditService}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-neutral-200 hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
              title="Add Security & Compliance Audit add-on"
            >
              <Plus className="w-3 h-3" />
              <span>+Audit Upsell</span>
            </button>
          </div>
        </div>

        {/* Customer Information Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Client / Account Company <span className="text-[#A8462F]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Logistics Hub"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              placeholder="e.g. Devon Vance"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              placeholder="devon@apex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Payment Terms
            </label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            >
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Net 15">Net 15 Days</option>
              <option value="Net 30">Net 30 Days (Standard)</option>
              <option value="Net 60">Net 60 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Validity Duration
            </label>
            <select
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days (Standard)</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
              Sales Tax Rate (%)
            </label>
            <select
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
            >
              <option value={0}>0% (Tax Exempt)</option>
              <option value={5}>5.0% (Reduced Tax)</option>
              <option value={8}>8.0% (Standard US Tax)</option>
              <option value={10}>10.0% (GST / VAT)</option>
              <option value={18}>18.0% (Standard GST)</option>
            </select>
          </div>
        </div>

        {/* Line Items Editor */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-neutral-300">
                Quotation Line Items &amp; Pricing
              </h3>
              <p className="text-[11px] text-ink-muted dark:text-neutral-500">
                Pick standard items from catalog or add bespoke / custom services
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick discount chips */}
              <div className="hidden md:flex items-center gap-1 text-[11px] text-ink-muted dark:text-neutral-400 mr-2">
                <span>Set All:</span>
                {[0, 5, 10, 15, 20].map((disc) => (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => handleApplyGlobalDiscount(disc)}
                    className="px-2 py-0.5 rounded-md border border-border dark:border-[#2A2B27] hover:border-accent hover:text-accent font-mono text-[10px] cursor-pointer"
                  >
                    {disc}%
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleAddLine(false)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#141513] text-ink dark:text-neutral-200 hover:border-accent hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+Catalog Item</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddLine(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-accent/40 bg-accent/5 text-accent hover:bg-accent/15 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>+Custom Item</span>
              </button>
            </div>
          </div>

          <div className="border border-border dark:border-[#2A2B27] rounded-2xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-neutral-50 dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-2.5 px-3">Item Details</th>
                  <th className="py-2.5 px-3 text-center w-20">Qty</th>
                  <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                  <th className="py-2.5 px-3 text-center w-24">Disc %</th>
                  <th className="py-2.5 px-3 text-right w-28">Total ({currency})</th>
                  <th className="py-2.5 px-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 dark:divide-[#2A2B27]">
                {lines.map((line, idx) => (
                  <tr key={line.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                    <td className="py-2.5 px-3">
                      {line.isCustom ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={line.productName}
                            onChange={(e) => handleCustomNameChange(idx, e.target.value)}
                            placeholder="Custom Service / Hardware Title"
                            className="w-full p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-semibold text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={line.sku}
                              onChange={(e) => handleCustomSkuChange(idx, e.target.value)}
                              placeholder="SKU"
                              className="w-28 p-1 rounded-md border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-[10px] font-mono text-ink-muted"
                            />
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/10 text-accent font-semibold">
                              Ad-hoc Item
                            </span>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={line.productId}
                          onChange={(e) => handleProductChange(idx, e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-medium"
                        >
                          {catalogProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku}) - {formatCurrency(p.unitPrice, currency)}
                            </option>
                          ))}
                          <option value="__custom__">★ Convert to Custom Bespoke Item...</option>
                        </select>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                        className="w-full text-center p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {line.isCustom ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.unitPrice}
                          onChange={(e) => handleUnitPriceChange(idx, parseFloat(e.target.value) || 0)}
                          className="w-24 text-right p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-mono"
                        />
                      ) : (
                        <span className="font-mono text-ink-muted dark:text-neutral-400">
                          {formatCurrency(line.unitPrice, currency)}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={line.discountPercent}
                        onChange={(e) => handleDiscountChange(idx, parseFloat(e.target.value) || 0)}
                        className={`w-full text-center p-1.5 rounded-lg border bg-white dark:bg-[#1A1B18] font-mono ${
                          line.discountPercent > 25
                            ? 'border-red-500 text-red-600 font-bold'
                            : 'border-border dark:border-[#2A2B27] text-ink dark:text-neutral-100'
                        }`}
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-ink dark:text-white">
                      {formatCurrency(line.total, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        disabled={lines.length <= 1}
                        onClick={() => handleRemoveLine(idx)}
                        className={`p-1 rounded-md text-ink-muted hover:text-red-500 cursor-pointer ${
                          lines.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Profit Margin & Health Barometer Card */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#141513] border border-border dark:border-[#2A2B27] space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-ink dark:text-white flex items-center gap-2">
                  <span>Gross Margin Barometer</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider font-mono ${
                      marginStats.status === 'healthy'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : marginStats.status === 'moderate'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                    }`}
                  >
                    {marginStats.marginPercent}% Gross Margin ({marginStats.status})
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted dark:text-neutral-400">
                  Estimated cost of delivery: {formatCurrency(marginStats.totalCost, currency)} • Gross Profit: {formatCurrency(marginStats.grossProfit, currency)}
                </p>
              </div>
            </div>

            {/* Shipping & Handling */}
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-ink-muted dark:text-neutral-400 font-semibold">
                Shipping / Logistics Fee:
              </span>
              <div className="relative w-28">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                  className="w-full text-right p-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] font-mono text-ink dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Pricing Summary Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27] text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27]">
              <span className="text-ink-muted dark:text-neutral-400 block text-[10px] uppercase font-bold">
                Items Subtotal
              </span>
              <span className="font-mono font-bold text-sm text-ink dark:text-white">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27]">
              <span className="text-ink-muted dark:text-neutral-400 block text-[10px] uppercase font-bold">
                Sales Tax ({taxRate}%)
              </span>
              <span className="font-mono font-bold text-sm text-ink dark:text-white">
                {formatCurrency(tax, currency)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27]">
              <span className="text-ink-muted dark:text-neutral-400 block text-[10px] uppercase font-bold">
                Delivery / Freight
              </span>
              <span className="font-mono font-bold text-sm text-ink dark:text-white">
                {formatCurrency(shippingFee, currency)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-accent/5 dark:bg-accent/10 border border-accent/30">
              <span className="text-accent block text-[10px] uppercase font-bold">
                Grand Total ({currency})
              </span>
              <span className="font-mono font-black text-base text-accent">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Margin Safeguard Warning */}
        {marginFloorBreached && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Margin Floor Safeguard Breach:</strong> One or more discounts exceed the standard 25% policy ceiling (RULE-104). VP Finance sign-off required prior to client dispatch.
            </span>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-ink dark:text-neutral-200 mb-1">
            Commercial Notes &amp; Special Conditions
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Price includes standard 1-year hardware warranty and cloud updates."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-[#141513] text-ink dark:text-white focus:outline-hidden focus:border-[#A8462F]"
          />
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80 dark:border-[#2A2B27]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!customer.trim()}
            onClick={() => handleSubmit('Draft')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1E1F1C] text-ink dark:text-neutral-200 hover:border-[#A8462F] transition-colors cursor-pointer ${
              !customer.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {isEditMode ? 'Save Changes' : 'Save as Draft'}
          </button>
          <button
            type="button"
            disabled={!customer.trim()}
            onClick={() => handleSubmit('Sent')}
            className={`px-5 py-2 text-xs font-bold rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-xs cursor-pointer ${
              !customer.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {isEditMode ? 'Save & Send to Client' : 'Generate & Send to Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
