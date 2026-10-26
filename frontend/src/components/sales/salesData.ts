'use client';

export interface QuoteLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  total: number;
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
  discountPercent: number;
  itemsCount: number;
  paymentTerms: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Converted' | 'Rejected' | 'Expired';
  notes?: string;
  lines: QuoteLine[];
}

export interface SalesOrderLine {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
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

export const catalogProducts = [
  { id: 'PROD-01', name: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', unitPrice: 450.00, category: 'Software' },
  { id: 'PROD-02', name: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', unitPrice: 280.00, category: 'Hardware' },
  { id: 'PROD-03', name: 'Technician Field Dispatch App Add-On', sku: 'SVC-DISP-03', unitPrice: 120.00, category: 'Services' },
  { id: 'PROD-04', name: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', unitPrice: 195.00, category: 'Hardware' },
  { id: 'PROD-05', name: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', unitPrice: 850.00, category: 'Services' },
  { id: 'PROD-06', name: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', unitPrice: 1200.00, category: 'Services' },
];

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
    amount: 1450.00,
    discountPercent: 5,
    itemsCount: 4,
    paymentTerms: 'Net 30',
    status: 'Approved',
    notes: 'Includes seasonal discount for cafeteria POS deployment.',
    lines: [
      { id: 'QL-1', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 2, unitPrice: 450.00, discountPercent: 5, total: 855.00 },
      { id: 'QL-2', productId: 'PROD-04', productName: 'High-Speed Thermal Receipt Printer', sku: 'HW-PRN-04', quantity: 3, unitPrice: 195.00, discountPercent: 0, total: 585.00 },
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
    amount: 3820.00,
    discountPercent: 10,
    itemsCount: 8,
    paymentTerms: 'Net 15',
    status: 'Sent',
    notes: 'Multi-dock scanner setup for western distribution hub.',
    lines: [
      { id: 'QL-3', productId: 'PROD-02', productName: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', quantity: 10, unitPrice: 280.00, discountPercent: 10, total: 2520.00 },
      { id: 'QL-4', productId: 'PROD-05', productName: 'Dedicated Database Replica Migration', sku: 'SVC-MIG-05', quantity: 1, unitPrice: 850.00, discountPercent: 0, total: 850.00 },
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
    amount: 5600.00,
    discountPercent: 8,
    itemsCount: 12,
    paymentTerms: 'Net 30',
    status: 'Converted',
    notes: 'Converted to Sales Order #SO-2026-103.',
    lines: [
      { id: 'QL-5', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 6, unitPrice: 450.00, discountPercent: 8, total: 2484.00 },
      { id: 'QL-6', productId: 'PROD-02', productName: 'Warehouse IoT Barcode Scanner Terminal', sku: 'HW-SCAN-80', quantity: 10, unitPrice: 280.00, discountPercent: 5, total: 2660.00 },
    ],
  },
  {
    id: 'QT-2026-094',
    customer: 'Summit Medical Clinic',
    contact: 'Dr. Sarah Chen',
    email: 'sarah.chen@summitmed.org',
    phone: '+1 (555) 732-9012',
    date: 'Oct 20, 2026',
    validUntil: 'Nov 03, 2026',
    subtotal: 850.00,
    tax: 70.00,
    amount: 920.00,
    discountPercent: 0,
    itemsCount: 2,
    paymentTerms: 'Due on Receipt',
    status: 'Draft',
    notes: 'Awaiting Dr. Chen confirmation on add-on requirements.',
    lines: [
      { id: 'QL-7', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 1, unitPrice: 450.00, discountPercent: 0, total: 450.00 },
      { id: 'QL-8', productId: 'PROD-03', productName: 'Technician Field Dispatch App Add-On', sku: 'SVC-DISP-03', quantity: 3, unitPrice: 120.00, discountPercent: 0, total: 360.00 },
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
    amount: 2150.00,
    discountPercent: 7,
    itemsCount: 5,
    paymentTerms: 'Net 30',
    status: 'Approved',
    notes: 'Member management and accounting billing integration.',
    lines: [
      { id: 'QL-9', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 3, unitPrice: 450.00, discountPercent: 7, total: 1255.50 },
      { id: 'QL-10', productId: 'PROD-06', productName: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', quantity: 1, unitPrice: 1200.00, discountPercent: 10, total: 1080.00 },
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
    amount: 8450.00,
    discountPercent: 12,
    itemsCount: 15,
    paymentTerms: 'Net 60',
    status: 'Expired',
    notes: 'Quote expired without acceptance. Rep requested re-engagement.',
    lines: [
      { id: 'QL-11', productId: 'PROD-01', productName: 'Cloud ERP Core Tenant License', sku: 'ERP-CORE-01', quantity: 10, unitPrice: 450.00, discountPercent: 12, total: 3960.00 },
      { id: 'QL-12', productId: 'PROD-06', productName: 'Multi-Tenant Security & Compliance Audit', sku: 'SEC-AUD-06', quantity: 3, unitPrice: 1200.00, discountPercent: 10, total: 3240.00 },
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
