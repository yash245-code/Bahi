'use client';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // against 1 USD
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.79, flag: '🇬🇧' },
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 83.45, flag: '🇮🇳' },
  AED: { code: 'AED', symbol: 'AED ', label: 'AED (AED)', rate: 3.67, flag: '🇦🇪' },
  JPY: { code: 'JPY', symbol: '¥', label: 'JPY (¥)', rate: 154.2, flag: '🇯🇵' },
};

export function convertAmount(amountInUSD: number, currency: CurrencyCode = 'USD'): number {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  return Math.round(amountInUSD * cfg.rate * 100) / 100;
}

export function formatCurrency(amountInUSD: number, currency: CurrencyCode = 'USD'): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountInUSD * cfg.rate;
  if (cfg.code === 'JPY') {
    return `${cfg.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }
  return `${cfg.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getExpiryStatus(validUntilStr: string): {
  label: string;
  daysLeft: number;
  isUrgent: boolean;
  isExpired: boolean;
  badgeClass: string;
} {
  const target = new Date(validUntilStr);
  const now = new Date('2026-10-27T12:00:00Z'); // normalized to current mocked system date
  const diffMs = target.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      label: `Expired ${Math.abs(daysLeft)}d ago`,
      daysLeft,
      isUrgent: false,
      isExpired: true,
      badgeClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    };
  } else if (daysLeft === 0) {
    return {
      label: 'Expires Today!',
      daysLeft,
      isUrgent: true,
      isExpired: false,
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse font-bold',
    };
  } else if (daysLeft <= 3) {
    return {
      label: `⏰ ${daysLeft}d left!`,
      daysLeft,
      isUrgent: true,
      isExpired: false,
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold',
    };
  } else {
    return {
      label: `${daysLeft}d validity`,
      daysLeft,
      isUrgent: false,
      isExpired: false,
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    };
  }
}

export interface QuoteLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  description?: string;
  isCustom?: boolean;
  quantity: number;
  unitPrice: number;
  unitCost?: number; // estimated cost per unit for margin calculation
  discountPercent: number;
  taxPercent?: number;
  total: number;
}

export interface QuoteRevision {
  version: number;
  date: string;
  author: string;
  amount: number;
  discountPercent: number;
  notes: string;
}

export interface QuoteSignature {
  signedBy: string;
  title: string;
  signedAt: string;
  signatureData?: string;
  ipAddress?: string;
}

export interface QuoteActivity {
  id: string;
  timestamp: string;
  type: 'created' | 'sent' | 'viewed' | 'revised' | 'approved' | 'signed' | 'converted' | 'invoiced' | 'note';
  author: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  badge: string;
  subject: string;
  body: string;
}

export interface CrmCustomerPreset {
  id: string;
  customer: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  tier: 'Standard' | 'Silver Partner' | 'Gold VIP';
  defaultDiscount: number;
  paymentTerms: string;
}

export interface Quote {
  id: string;
  customer: string;
  contact: string;
  email: string;
  phone: string;
  date: string;
  validUntil: string;
  amount: number;
  subtotal: number;
  tax: number;
  taxRate?: number; // percentage, e.g. 5, 8.5, 10
  shippingFee?: number;
  discountPercent: number;
  itemsCount: number;
  paymentTerms: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Converted' | 'Rejected' | 'Expired';
  notes?: string;
  lines: QuoteLine[];
  version?: number;
  revisions?: QuoteRevision[];
  winProbability?: number; // 0 - 100%
  tags?: string[];
  signature?: QuoteSignature;
  activities?: QuoteActivity[];
  portalViewedAt?: string;
}

export interface SalesOrderLine {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SalesOrderNote {
  id: string;
  timestamp: string;
  author: string;
  text: string;
}

export interface SalesOrder {
  id: string;
  quoteRef?: string;
  customer: string;
  contact: string;
  date: string;
  deliveryDate: string;
  amount: number;
  subtotal: number;
  tax: number;
  status: 'Confirmed' | 'Processing' | 'Fulfilled' | 'Invoiced' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  shippingAddress: string;
  carrier?: string;
  trackingNumber?: string;
  notes?: string;
  orderNotes?: SalesOrderNote[];
  itemsCount: number;
  lines: SalesOrderLine[];
}

export interface DiscountRule {
  id: string;
  name: string;
  type: 'Volume Discount' | 'Partner Tier' | 'Promotional' | 'Margin Floor' | 'Customer Specific';
  discountRate: string;
  minUnits: number;
  targetCategory: string;
  isActive: boolean;
  effectiveUntil: string;
  usageCount: number;
  description: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  unitCost: number;
  category: string;
  description: string;
}

export const catalogProducts: CatalogProduct[] = [
  { id: 'PROD-01', name: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', unitPrice: 450.00, unitCost: 180.00, category: 'Software', description: 'Enterprise multitenant platform license with continuous compliance updates.' },
  { id: 'PROD-02', name: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', unitPrice: 280.00, unitCost: 155.00, category: 'Hardware', description: 'Ruggedized Android industrial handheld terminal with 2D imager.' },
  { id: 'PROD-03', name: 'Technician Field Dispatch App Add-On', sku: 'SVC-DISP-03', unitPrice: 120.00, unitCost: 45.00, category: 'Services', description: 'Mobile technician routing, digital signatures, and offline task sync.' },
  { id: 'PROD-04', name: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', unitPrice: 195.00, unitCost: 110.00, category: 'Hardware', description: 'Fast 250mm/sec direct thermal network receipt printer with auto-cutter.' },
  { id: 'PROD-05', name: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', unitPrice: 850.00, unitCost: 320.00, category: 'Services', description: 'Turnkey database sync, ETL pipeline migration, and cutover testing.' },
  { id: 'PROD-06', name: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', unitPrice: 1200.00, unitCost: 450.00, category: 'Services', description: 'SOC2 and ISO 27001 vulnerability inspection, pen-test report, and signoff.' },
];

export const crmCustomerPresets: CrmCustomerPreset[] = [
  {
    id: 'CRM-CUST-01',
    customer: 'Apex Logistics Hub',
    contact: 'Devon Vance',
    email: 'devon@apexlogistics.com',
    phone: '+1 (555) 819-2041',
    address: 'Dock 12, Pacific Container Terminal, Seattle, WA',
    tier: 'Gold VIP',
    defaultDiscount: 10,
    paymentTerms: 'Net 15',
  },
  {
    id: 'CRM-CUST-02',
    customer: 'Green Garden Cafe',
    contact: 'Maya Lin',
    email: 'maya@greengarden.com',
    phone: '+1 (555) 234-5678',
    address: '14 Elm Street, Downtown Square, Portland, OR',
    tier: 'Silver Partner',
    defaultDiscount: 5,
    paymentTerms: 'Net 30',
  },
  {
    id: 'CRM-CUST-03',
    customer: 'Nordic Warehouses',
    contact: 'Erik Solberg',
    email: 'erik@nordicwh.no',
    phone: '+47 982 12 345',
    address: 'Strandgata 14, Oslo Distribution Yard, Norway',
    tier: 'Gold VIP',
    defaultDiscount: 8,
    paymentTerms: 'Net 30',
  },
  {
    id: 'CRM-CUST-04',
    customer: 'Summit Medical Clinic',
    contact: 'Dr. Sarah Chen',
    email: 'sarah.chen@summitmed.org',
    phone: '+1 (555) 732-9012',
    address: '420 Health Sciences Blvd, Boston, MA',
    tier: 'Standard',
    defaultDiscount: 0,
    paymentTerms: 'Due on Receipt',
  },
  {
    id: 'CRM-CUST-05',
    customer: 'Highland Residency Club',
    contact: 'Carlos Mendez',
    email: 'carlos@highlandresidency.com',
    phone: '+1 (555) 329-8471',
    address: '88 Pinnacle Way, Aspen, CO',
    tier: 'Silver Partner',
    defaultDiscount: 7,
    paymentTerms: 'Net 30',
  },
  {
    id: 'CRM-CUST-06',
    customer: 'Vortex Global Accounting',
    contact: 'Alicia Patel',
    email: 'alicia@vortexglobal.com',
    phone: '+1 (555) 443-8812',
    address: '100 Financial Plaza, Floor 18, Chicago, IL',
    tier: 'Gold VIP',
    defaultDiscount: 12,
    paymentTerms: 'Net 60',
  },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'initial_quote',
    name: 'Initial Proposal Delivery',
    badge: 'Recommended for Drafts',
    subject: 'Commercial Quotation {{quoteId}} from Bahi Solutions for {{customer}}',
    body: `Dear {{contact}},

Thank you for your interest in partnering with Bahi Solutions.

We are pleased to present quotation {{quoteId}} for {{customer}}, detailing the software licenses, hardware devices, and deployment services discussed during our commercial discovery session.

• Quotation ID: {{quoteId}}
• Total Amount: {{amount}}
• Validity: {{validUntil}}
• Payment Terms: {{paymentTerms}}

You can review the full formal proposal document and complete secure digital acceptance via our client portal at:
https://bahi.app/portal/quotes/{{quoteId}}

Please do not hesitate to contact our team if you need any adjustments or technical clarifications.

Best regards,
Commercial Sales & Accounts
Bahi Enterprise Systems`,
  },
  {
    id: 'followup',
    name: 'Follow-up on Open Proposal',
    badge: 'Gentle Reminder',
    subject: 'Follow-up regarding Quotation {{quoteId}} for {{customer}}',
    body: `Hi {{contact}},

I hope you're having a productive week!

I'm following up regarding quotation {{quoteId}} (Amount: {{amount}}) sent to {{customer}}. Our engineering team has reserved the deployment schedule and implementation slots for your organization.

Proposal link: https://bahi.app/portal/quotes/{{quoteId}}

Are there any questions from your finance or legal review team that we can address to help move this forward?

Looking forward to your thoughts.

Warm regards,
Commercial Sales & Accounts
Bahi Enterprise Systems`,
  },
  {
    id: 'revised',
    name: 'Revised Terms with Special Pricing',
    badge: 'Updated Revision',
    subject: 'Updated Quotation {{quoteId}} (v{{version}}) for {{customer}} - Revised Terms',
    body: `Dear {{contact}},

Following our recent conversation, we have updated quotation {{quoteId}} to reflect our agreed pricing terms and promotional discounts.

• Updated Total: {{amount}} (Inclusive of all agreed line-item discounts)
• Proposal Version: v{{version}}
• Valid Through: {{validUntil}}

Please review the revised proposal at your convenience:
https://bahi.app/portal/quotes/{{quoteId}}

We look forward to partnering with {{customer}} on this initiative.

Best regards,
Commercial Sales & Accounts
Bahi Enterprise Systems`,
  },
  {
    id: 'urgency',
    name: 'Proposal Expiration Alert',
    badge: 'Expires Soon',
    subject: 'Action Required: Quotation {{quoteId}} is expiring soon ({{validUntil}})',
    body: `Dear {{contact}},

This is a friendly reminder that quotation {{quoteId}} for {{customer}} is scheduled to expire on {{validUntil}}.

Current lock-in price: {{amount}}

To ensure that the promotional pricing and hardware allocations remain locked without price adjustments, please review and approve the proposal via our digital portal before the validity period ends:
https://bahi.app/portal/quotes/{{quoteId}}

If you require an extension, please reply directly to this message.

Sincerely,
Commercial Sales & Accounts
Bahi Enterprise Systems`,
  },
];

export function calculateQuoteMargin(
  lines: QuoteLine[],
  _shippingFee: number = 0
): {
  subtotal: number;
  totalCost: number;
  grossProfit: number;
  marginPercent: number;
  status: 'healthy' | 'moderate' | 'warning';
} {
  let subtotal = 0;
  let totalCost = 0;

  lines.forEach((line) => {
    subtotal += line.total;
    const unitCost =
      line.unitCost !== undefined
        ? line.unitCost
        : catalogProducts.find((p) => p.id === line.productId)?.unitCost ?? line.unitPrice * 0.55;
    totalCost += unitCost * line.quantity;
  });

  const grossProfit = Math.round((subtotal - totalCost) * 100) / 100;
  const marginPercent = subtotal > 0 ? Math.round((grossProfit / subtotal) * 1000) / 10 : 0;

  let status: 'healthy' | 'moderate' | 'warning' = 'healthy';
  if (marginPercent < 20) {
    status = 'warning';
  } else if (marginPercent < 35) {
    status = 'moderate';
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    grossProfit,
    marginPercent,
    status,
  };
}

export const catalogProductsOld = catalogProducts;

export const initialQuotes: Quote[] = [
  {
    id: 'QT-2026-091',
    customer: 'Green Garden Cafe',
    contact: 'Maya Lin',
    email: 'maya@greengarden.com',
    phone: '+1 (555) 234-5678',
    date: 'Oct 23, 2026',
    validUntil: 'Nov 06, 2026',
    subtotal: 1350.00,
    tax: 100.00,
    taxRate: 7.5,
    shippingFee: 0,
    amount: 1450.00,
    discountPercent: 5,
    itemsCount: 4,
    paymentTerms: 'Net 30',
    status: 'Approved',
    notes: 'Includes seasonal discount for cafeteria POS deployment.',
    version: 2,
    winProbability: 95,
    tags: ['Retail POS', 'Seasonal Promo'],
    portalViewedAt: 'Oct 23, 2026 14:10',
    activities: [
      { id: 'act-91-1', timestamp: 'Oct 20, 2026 09:30 AM', type: 'created', author: 'Alex Morgan', message: 'Initial quotation generated with 2 licenses and 3 thermal receipt printers.' },
      { id: 'act-91-2', timestamp: 'Oct 20, 2026 11:15 AM', type: 'sent', author: 'Alex Morgan', message: 'Emailed official proposal to maya@greengarden.com.' },
      { id: 'act-91-3', timestamp: 'Oct 21, 2026 03:45 PM', type: 'viewed', author: 'Client Portal', message: 'Maya Lin viewed the interactive digital proposal via client link.' },
      { id: 'act-91-4', timestamp: 'Oct 23, 2026 09:00 AM', type: 'revised', author: 'Alex Morgan', message: 'Applied 5% seasonal discount and regenerated Revision v2.' },
      { id: 'act-91-5', timestamp: 'Oct 23, 2026 02:20 PM', type: 'approved', author: 'Maya Lin', message: 'Client approved proposal terms and accepted commercial conditions.' },
      { id: 'act-91-6', timestamp: 'Oct 23, 2026 04:00 PM', type: 'note', author: 'Alex Morgan', message: 'Called Maya: Hardware dispatch scheduled for early November installation.' },
    ],
    revisions: [
      { version: 1, date: 'Oct 20, 2026', author: 'Alex Morgan', amount: 1520.00, discountPercent: 0, notes: 'Initial proposal generated.' },
      { version: 2, date: 'Oct 23, 2026', author: 'Alex Morgan', amount: 1450.00, discountPercent: 5, notes: 'Applied 5% seasonal discount after client pricing review.' }
    ],
    lines: [
      { id: 'QL-1', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 2, unitPrice: 450.00, unitCost: 180.00, discountPercent: 5, total: 855.00 },
      { id: 'QL-2', productId: 'PROD-04', productName: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', quantity: 3, unitPrice: 195.00, unitCost: 110.00, discountPercent: 0, total: 585.00 },
    ],
  },
  {
    id: 'QT-2026-092',
    customer: 'Apex Logistics Hub',
    contact: 'Devon Vance',
    email: 'devon@apexlogistics.com',
    phone: '+1 (555) 819-2041',
    date: 'Oct 22, 2026',
    validUntil: 'Nov 12, 2026',
    subtotal: 3500.00,
    tax: 320.00,
    taxRate: 9.0,
    shippingFee: 50.00,
    amount: 3820.00,
    discountPercent: 10,
    itemsCount: 8,
    paymentTerms: 'Net 15',
    status: 'Sent',
    notes: 'Multi-dock scanner setup for western distribution hub.',
    version: 1,
    winProbability: 78,
    tags: ['Logistics', 'Enterprise Hardware'],
    portalViewedAt: 'Oct 22, 2026 16:30',
    activities: [
      { id: 'act-92-1', timestamp: 'Oct 22, 2026 02:15 PM', type: 'created', author: 'Devon Miller', message: 'Created draft proposal with 10 barcode scanners & DB migration package.' },
      { id: 'act-92-2', timestamp: 'Oct 22, 2026 03:00 PM', type: 'sent', author: 'Devon Miller', message: 'Proposal dispatched to devon@apexlogistics.com with Net 15 terms.' },
      { id: 'act-92-3', timestamp: 'Oct 22, 2026 04:30 PM', type: 'viewed', author: 'Client Portal', message: 'Proposal viewed from Seattle, WA IP address.' },
      { id: 'act-92-4', timestamp: 'Oct 24, 2026 11:10 AM', type: 'note', author: 'Devon Miller', message: 'Spoke with IT operations manager: scanning accuracy benchmark approved.' },
    ],
    revisions: [
      { version: 1, date: 'Oct 22, 2026', author: 'Devon Miller', amount: 3820.00, discountPercent: 10, notes: 'Volume tier discount applied.' }
    ],
    lines: [
      { id: 'QL-3', productId: 'PROD-02', productName: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', quantity: 10, unitPrice: 280.00, unitCost: 155.00, discountPercent: 10, total: 2520.00 },
      { id: 'QL-4', productId: 'PROD-05', productName: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', quantity: 1, unitPrice: 850.00, unitCost: 320.00, discountPercent: 0, total: 850.00 },
    ],
  },
  {
    id: 'QT-2026-093',
    customer: 'Nordic Warehouses',
    contact: 'Erik Solberg',
    email: 'erik@nordicwh.no',
    phone: '+47 982 12 345',
    date: 'Oct 21, 2026',
    validUntil: 'Nov 04, 2026',
    subtotal: 5100.00,
    tax: 500.00,
    taxRate: 10.0,
    shippingFee: 120.00,
    amount: 5600.00,
    discountPercent: 8,
    itemsCount: 12,
    paymentTerms: 'Net 30',
    status: 'Converted',
    notes: 'Converted to Sales Order #SO-2026-103.',
    version: 1,
    winProbability: 100,
    tags: ['Global', 'Warehouse'],
    portalViewedAt: 'Oct 21, 2026 13:00',
    activities: [
      { id: 'act-93-1', timestamp: 'Oct 21, 2026 11:00 AM', type: 'created', author: 'Current User', message: 'Proposal created for Scandinavian hub deployment.' },
      { id: 'act-93-2', timestamp: 'Oct 21, 2026 11:30 AM', type: 'sent', author: 'Current User', message: 'Proposal sent to erik@nordicwh.no.' },
      { id: 'act-93-3', timestamp: 'Oct 22, 2026 02:15 PM', type: 'signed', author: 'Erik Solberg', message: 'Digitally signed by Erik Solberg (VP Operations).' },
      { id: 'act-93-4', timestamp: 'Oct 22, 2026 02:16 PM', type: 'converted', author: 'System Automation', message: 'Automatically converted to confirmed Sales Order SO-2026-103.' },
    ],
    signature: {
      signedBy: 'Erik Solberg',
      title: 'VP Operations',
      signedAt: 'Oct 22, 2026 14:15 CET',
    },
    lines: [
      { id: 'QL-5', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 6, unitPrice: 450.00, unitCost: 180.00, discountPercent: 8, total: 2484.00 },
      { id: 'QL-6', productId: 'PROD-02', productName: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', quantity: 10, unitPrice: 280.00, unitCost: 155.00, discountPercent: 5, total: 2660.00 },
    ],
  },
  {
    id: 'QT-2026-094',
    customer: 'Summit Medical Clinic',
    contact: 'Dr. Sarah Chen',
    email: 'sarah.chen@summitmed.org',
    phone: '+1 (555) 732-9012',
    date: 'Oct 20, 2026',
    validUntil: 'Oct 29, 2026', // within 2 days to trigger urgency radar!
    subtotal: 850.00,
    tax: 70.00,
    taxRate: 8.2,
    shippingFee: 0,
    amount: 920.00,
    discountPercent: 0,
    itemsCount: 2,
    paymentTerms: 'Due on Receipt',
    status: 'Draft',
    notes: 'Awaiting Dr. Chen confirmation on add-on requirements.',
    version: 1,
    winProbability: 62,
    tags: ['Healthcare', 'Clinical Add-on'],
    activities: [
      { id: 'act-94-1', timestamp: 'Oct 20, 2026 10:00 AM', type: 'created', author: 'Sarah Lin', message: 'Generated draft quotation for clinic outpatient department.' },
      { id: 'act-94-2', timestamp: 'Oct 22, 2026 03:10 PM', type: 'note', author: 'Sarah Lin', message: 'Internal review: Clinic requested technician field dispatch module demonstration.' },
    ],
    lines: [
      { id: 'QL-7', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 1, unitPrice: 450.00, unitCost: 180.00, discountPercent: 0, total: 450.00 },
      { id: 'QL-8', productId: 'PROD-03', productName: 'Technician Field Dispatch App Add-On', sku: 'SVC-DISP-03', quantity: 3, unitPrice: 120.00, unitCost: 45.00, discountPercent: 0, total: 360.00 },
    ],
  },
  {
    id: 'QT-2026-095',
    customer: 'Highland Residency Club',
    contact: 'Carlos Mendez',
    email: 'carlos@highlandresidency.com',
    phone: '+1 (555) 329-8471',
    date: 'Oct 19, 2026',
    validUntil: 'Nov 02, 2026',
    subtotal: 1980.00,
    tax: 170.00,
    taxRate: 8.5,
    shippingFee: 0,
    amount: 2150.00,
    discountPercent: 7,
    itemsCount: 5,
    paymentTerms: 'Net 30',
    status: 'Approved',
    notes: 'Member management and accounting billing integration.',
    version: 2,
    winProbability: 91,
    tags: ['Hospitality', 'Audit Verified'],
    portalViewedAt: 'Oct 19, 2026 15:30',
    activities: [
      { id: 'act-95-1', timestamp: 'Oct 15, 2026 09:15 AM', type: 'created', author: 'Sarah Lin', message: 'Quotation v1 generated.' },
      { id: 'act-95-2', timestamp: 'Oct 15, 2026 10:30 AM', type: 'sent', author: 'Sarah Lin', message: 'Sent proposal to carlos@highlandresidency.com.' },
      { id: 'act-95-3', timestamp: 'Oct 19, 2026 02:00 PM', type: 'revised', author: 'Sarah Lin', message: 'Board approved multi-year agreement discount. Revision v2 created.' },
      { id: 'act-95-4', timestamp: 'Oct 19, 2026 04:45 PM', type: 'approved', author: 'Carlos Mendez', message: 'Carlos Mendez approved commercial quotation.' },
    ],
    revisions: [
      { version: 1, date: 'Oct 15, 2026', author: 'Sarah Lin', amount: 2310.00, discountPercent: 0, notes: 'Standard quote.' },
      { version: 2, date: 'Oct 19, 2026', author: 'Sarah Lin', amount: 2150.00, discountPercent: 7, notes: 'Board approved multi-year agreement discount.' }
    ],
    lines: [
      { id: 'QL-9', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 3, unitPrice: 450.00, unitCost: 180.00, discountPercent: 7, total: 1255.50 },
      { id: 'QL-10', productId: 'PROD-06', productName: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', quantity: 1, unitPrice: 1200.00, unitCost: 450.00, discountPercent: 10, total: 1080.00 },
    ],
  },
  {
    id: 'QT-2026-096',
    customer: 'Vortex Global Accounting',
    contact: 'Alicia Patel',
    email: 'alicia@vortexglobal.com',
    phone: '+1 (555) 443-8812',
    date: 'Oct 18, 2026',
    validUntil: 'Oct 25, 2026',
    subtotal: 7800.00,
    tax: 650.00,
    taxRate: 8.3,
    shippingFee: 0,
    amount: 8450.00,
    discountPercent: 12,
    itemsCount: 15,
    paymentTerms: 'Net 60',
    status: 'Expired',
    notes: 'Quote expired without acceptance. Rep requested re-engagement.',
    version: 1,
    winProbability: 38,
    tags: ['Finance Enterprise', 'Re-quote Target'],
    activities: [
      { id: 'act-96-1', timestamp: 'Oct 18, 2026 11:30 AM', type: 'created', author: 'Devon Miller', message: 'Initial enterprise quotation drafted.' },
      { id: 'act-96-2', timestamp: 'Oct 18, 2026 12:15 PM', type: 'sent', author: 'Devon Miller', message: 'Dispatched to alicia@vortexglobal.com with Net 60 terms.' },
      { id: 'act-96-3', timestamp: 'Oct 26, 2026 09:00 AM', type: 'note', author: 'System Automation', message: 'Quote lapsed past validity expiration date (Oct 25, 2026).' },
    ],
    lines: [
      { id: 'QL-11', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 10, unitPrice: 450.00, unitCost: 180.00, discountPercent: 12, total: 3960.00 },
      { id: 'QL-12', productId: 'PROD-06', productName: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', quantity: 3, unitPrice: 1200.00, unitCost: 450.00, discountPercent: 10, total: 3240.00 },
    ],
  },
];

export const initialOrders: SalesOrder[] = [
  {
    id: 'SO-2026-101',
    quoteRef: 'QT-2026-088',
    customer: 'Beacon Medical Supply',
    contact: 'Rachel Adams',
    date: 'Oct 24, 2026',
    deliveryDate: 'Oct 29, 2026',
    subtotal: 4200.00,
    tax: 380.00,
    amount: 4580.00,
    status: 'Processing',
    paymentStatus: 'Paid',
    shippingAddress: '742 Evergreen Terrace, Medical Park, WA',
    carrier: 'FedEx Express Freight',
    trackingNumber: 'FDX-9941-8823',
    itemsCount: 6,
    lines: [
      { id: 'SOL-1', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 5, unitPrice: 450.00, total: 2250.00 },
      { id: 'SOL-2', productName: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', quantity: 1, unitPrice: 1200.00, total: 1200.00 },
    ],
  },
  {
    id: 'SO-2026-102',
    quoteRef: 'QT-2026-089',
    customer: 'Pacific Freight Express',
    contact: 'Kenji Sato',
    date: 'Oct 23, 2026',
    deliveryDate: 'Oct 28, 2026',
    subtotal: 6800.00,
    tax: 600.00,
    amount: 7400.00,
    status: 'Confirmed',
    paymentStatus: 'Pending',
    shippingAddress: 'Dock 12, Pacific Container Terminal, CA',
    carrier: 'DHL Global Logistics',
    trackingNumber: 'DHL-8820-1120',
    itemsCount: 14,
    lines: [
      { id: 'SOL-3', productName: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', quantity: 20, unitPrice: 280.00, total: 5600.00 },
      { id: 'SOL-4', productName: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', quantity: 5, unitPrice: 195.00, total: 975.00 },
    ],
  },
  {
    id: 'SO-2026-103',
    quoteRef: 'QT-2026-093',
    customer: 'Nordic Warehouses',
    contact: 'Erik Solberg',
    date: 'Oct 22, 2026',
    deliveryDate: 'Oct 27, 2026',
    subtotal: 5100.00,
    tax: 500.00,
    amount: 5600.00,
    status: 'Fulfilled',
    paymentStatus: 'Paid',
    shippingAddress: 'Strandgata 14, Oslo Distribution Yard, Norway',
    itemsCount: 12,
    lines: [
      { id: 'SOL-5', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 6, unitPrice: 450.00, total: 2700.00 },
      { id: 'SOL-6', productName: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', quantity: 10, unitPrice: 280.00, total: 2800.00 },
    ],
  },
  {
    id: 'SO-2026-104',
    quoteRef: 'Direct Booking',
    customer: 'Green Garden Cafe',
    contact: 'Maya Lin',
    date: 'Oct 21, 2026',
    deliveryDate: 'Oct 26, 2026',
    subtotal: 1200.00,
    tax: 95.00,
    amount: 1295.00,
    status: 'Invoiced',
    paymentStatus: 'Paid',
    shippingAddress: '14 Elm Street, Downtown Square, OR',
    itemsCount: 3,
    lines: [
      { id: 'SOL-7', productName: 'Technician Field Dispatch App Add-On', sku: 'SVC-DISP-03', quantity: 4, unitPrice: 120.00, total: 480.00 },
      { id: 'SOL-8', productName: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', quantity: 2, unitPrice: 195.00, total: 390.00 },
    ],
  },
  {
    id: 'SO-2026-105',
    quoteRef: 'QT-2026-085',
    customer: 'Metro Steel Fabricators',
    contact: 'David Miller',
    date: 'Oct 19, 2026',
    deliveryDate: 'Nov 02, 2026',
    subtotal: 9200.00,
    tax: 820.00,
    amount: 10020.00,
    status: 'Processing',
    paymentStatus: 'Pending',
    shippingAddress: '300 Heavy Industry Way, Yard 4, IL',
    itemsCount: 18,
    lines: [
      { id: 'SOL-9', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 12, unitPrice: 450.00, total: 5400.00 },
      { id: 'SOL-10', productName: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', quantity: 2, unitPrice: 850.00, total: 1700.00 },
    ],
  },
];

export const initialDiscountRules: DiscountRule[] = [
  {
    id: 'RULE-101',
    name: 'Wholesale Volume Break (10+ Units)',
    type: 'Volume Discount',
    discountRate: '15%',
    minUnits: 10,
    targetCategory: 'Hardware & Devices',
    isActive: true,
    effectiveUntil: 'Dec 31, 2026',
    usageCount: 24,
    description: 'Automatically applies 15% discount for bulk terminal scanner and printer orders exceeding 10 units.',
  },
  {
    id: 'RULE-102',
    name: 'Gold Certified Partner Tier',
    type: 'Partner Tier',
    discountRate: '20%',
    minUnits: 1,
    targetCategory: 'All Product Lines',
    isActive: true,
    effectiveUntil: 'Ongoing',
    usageCount: 42,
    description: 'Preferred distributor pricing across software licenses and professional onboarding services.',
  },
  {
    id: 'RULE-103',
    name: 'Q4 Enterprise Migration Promo',
    type: 'Promotional',
    discountRate: '10%',
    minUnits: 5,
    targetCategory: 'Cloud ERP Licenses',
    isActive: true,
    effectiveUntil: 'Nov 30, 2026',
    usageCount: 18,
    description: 'Year-end commercial incentive for mid-market clients migrating from legacy ERP installations.',
  },
  {
    id: 'RULE-104',
    name: 'Commercial Margin Floor Safeguard',
    type: 'Margin Floor',
    discountRate: 'Max 25%',
    minUnits: 1,
    targetCategory: 'Global Rule',
    isActive: true,
    effectiveUntil: 'Indefinite',
    usageCount: 89,
    description: 'Hard governance ceiling. Rejects discretionary sales quote discounts exceeding 25% without VP Finance approval.',
  },
  {
    id: 'RULE-105',
    name: 'Startups & Non-Profit Grant Rate',
    type: 'Customer Specific',
    discountRate: '25%',
    minUnits: 1,
    targetCategory: 'Core Software',
    isActive: false,
    effectiveUntil: 'Dec 15, 2026',
    usageCount: 6,
    description: 'Special pricing for seed-stage startups and certified 501(c)(3) registered non-profit organizations.',
  },
];
