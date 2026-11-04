'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Phone,
  MapPin,
  DollarSign,
  ChevronRight,
  X,
  FileText,
  Check,
  Building2,
  Package,
  ShieldCheck,
  Scale,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export type POStatus = 'Draft' | 'Approved' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid';

export interface POLineItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  receivedQuantity: number;
  damagedQuantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  contactEmail: string;
  contactPhone: string;
  warehouse: string; // destination warehouse, e.g. WH-MAIN, WH-WEST, VAN-01
  orderDate: string;
  expectedDelivery: string;
  paymentTerms: 'Due on Receipt' | 'Net 15' | 'Net 30' | 'Net 60' | 'Advance Payment';
  status: POStatus;
  paymentStatus: PaymentStatus;
  freightCost: number;
  totalAmount: number;
  lineItems: POLineItem[];
  trackingNumber?: string;
  carrier?: string;
  receiverNotes?: string;
  inspectionPassed?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'Raw Materials & Metals' | 'HVAC & Refrigeration' | 'Electrical & Controls' | 'Hydraulic Parts' | 'Packaging & Paper' | 'Hardware & Fasteners';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  leadTimeDays: number;
  rating: number;
  activeOrdersCount: number;
  totalSpend: number;
  status: 'Active' | 'Under Review';
}

export interface GoodsReceipt {
  id: string;
  poId: string;
  supplierName: string;
  warehouse: string;
  receivedDate: string;
  carrier: string;
  trackingNumber: string;
  itemsReceived: number;
  itemsDamaged: number;
  status: 'Inspection Passed' | 'Discrepancy Reported' | 'Awaiting Inspection';
  inspectedBy: string;
}

export interface PriceComparisonItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  unit: string;
  supplierA: { name: string; price: number; leadTime: string };
  supplierB: { name: string; price: number; leadTime: string };
  bestPriceSupplier: string;
  savingsPercentage: number;
}

// ─── Initial Demo Data for Tenant Business ───────────────────────────────────

const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Apex Fluid Power Ltd',
    category: 'Hydraulic Parts',
    contactPerson: 'Dennis Vance',
    email: 'orders@apexfluidpower.com',
    phone: '+1 (555) 781-9920',
    address: '840 Hydraulics Way, Detroit, MI',
    paymentTerms: 'Net 30',
    leadTimeDays: 4,
    rating: 4.9,
    activeOrdersCount: 1,
    totalSpend: 24800,
    status: 'Active',
  },
  {
    id: 'sup-2',
    name: 'AirPure Filtration Systems',
    category: 'HVAC & Refrigeration',
    contactPerson: 'Cynthia Brooks',
    email: 'sales@airpurefilter.com',
    phone: '+1 (555) 342-1100',
    address: '120 Clean Air Blvd, Chicago, IL',
    paymentTerms: 'Net 30',
    leadTimeDays: 3,
    rating: 4.8,
    activeOrdersCount: 1,
    totalSpend: 18450,
    status: 'Active',
  },
  {
    id: 'sup-3',
    name: 'VoltTech Industrial Controls',
    category: 'Electrical & Controls',
    contactPerson: 'Rajesh Patel',
    email: 'orders@volttech.io',
    phone: '+1 (555) 890-4411',
    address: '500 Semiconductor Pkwy, Austin, TX',
    paymentTerms: 'Net 15',
    leadTimeDays: 5,
    rating: 5.0,
    activeOrdersCount: 1,
    totalSpend: 31200,
    status: 'Active',
  },
  {
    id: 'sup-4',
    name: 'EcoChill Gases & Refrigerants',
    category: 'HVAC & Refrigeration',
    contactPerson: 'Martin Cole',
    email: 'supply@ecochill.com',
    phone: '+1 (555) 670-3329',
    address: '90 Harbor Terminal, Newark, NJ',
    paymentTerms: 'Net 30',
    leadTimeDays: 2,
    rating: 4.7,
    activeOrdersCount: 1,
    totalSpend: 15600,
    status: 'Active',
  },
  {
    id: 'sup-5',
    name: 'Pacific Paper & Packaging Co',
    category: 'Packaging & Paper',
    contactPerson: 'Linda Zhao',
    email: 'orders@pacificpackaging.com',
    phone: '+1 (555) 431-8899',
    address: '1400 Bay Street, Seattle, WA',
    paymentTerms: 'Due on Receipt',
    leadTimeDays: 2,
    rating: 4.9,
    activeOrdersCount: 0,
    totalSpend: 6200,
    status: 'Active',
  },
  {
    id: 'sup-6',
    name: 'Titan Hardware & Fasteners',
    category: 'Hardware & Fasteners',
    contactPerson: 'Hank Morris',
    email: 'hank@titanfasteners.net',
    phone: '+1 (555) 902-7714',
    address: '320 Foundry Lane, Cleveland, OH',
    paymentTerms: 'Net 60',
    leadTimeDays: 6,
    rating: 4.6,
    activeOrdersCount: 0,
    totalSpend: 8900,
    status: 'Active',
  },
];

const initialPOs: PurchaseOrder[] = [
  {
    id: 'PO-2026-041',
    supplierId: 'sup-3',
    supplierName: 'VoltTech Industrial Controls',
    contactEmail: 'orders@volttech.io',
    contactPhone: '+1 (555) 890-4411',
    warehouse: 'WH-MAIN',
    orderDate: '2026-10-24',
    expectedDelivery: '2026-11-06',
    paymentTerms: 'Net 15',
    status: 'Sent',
    paymentStatus: 'Unpaid',
    freightCost: 150.0,
    totalAmount: 6400.0,
    trackingNumber: '1Z9999999999999999',
    carrier: 'UPS Freight Express',
    lineItems: [
      { id: 'li-1', sku: 'PRD-003', name: 'Digital Multimeter Pro 1000V', quantity: 20, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 140.0 },
      { id: 'li-2', sku: 'PRD-006', name: 'Variable Frequency Drive 5HP', quantity: 8, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 420.0 },
    ],
  },
  {
    id: 'PO-2026-042',
    supplierId: 'sup-5',
    supplierName: 'Pacific Paper & Packaging Co',
    contactEmail: 'orders@pacificpackaging.com',
    contactPhone: '+1 (555) 431-8899',
    warehouse: 'WH-WEST',
    orderDate: '2026-10-26',
    expectedDelivery: '2026-11-05',
    paymentTerms: 'Due on Receipt',
    status: 'Approved',
    paymentStatus: 'Unpaid',
    freightCost: 75.0,
    totalAmount: 1850.0,
    trackingNumber: 'FX-8829104',
    carrier: 'FedEx Ground',
    lineItems: [
      { id: 'li-3', sku: 'PKG-101', name: 'Heavy Duty Corrugated Shipping Boxes (L)', quantity: 500, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 2.2 },
      { id: 'li-4', sku: 'PKG-102', name: 'Thermal Shipping Label Rolls (Pack of 6)', quantity: 50, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 13.5 },
    ],
  },
  {
    id: 'PO-2026-043',
    supplierId: 'sup-1',
    supplierName: 'Apex Fluid Power Ltd',
    contactEmail: 'orders@apexfluidpower.com',
    contactPhone: '+1 (555) 781-9920',
    warehouse: 'WH-MAIN',
    orderDate: '2026-10-18',
    expectedDelivery: '2026-10-28',
    paymentTerms: 'Net 30',
    status: 'Received',
    paymentStatus: 'Paid',
    freightCost: 200.0,
    totalAmount: 4200.0,
    trackingNumber: 'ODFL-449102',
    carrier: 'Old Dominion Freight',
    inspectionPassed: true,
    receiverNotes: 'All boxes checked on Dock 2. Seals intact with zero damage.',
    lineItems: [
      { id: 'li-5', sku: 'PRD-002', name: 'Hydraulic Seal Kit (Series 400)', quantity: 40, receivedQuantity: 40, damagedQuantity: 0, unitPrice: 85.0 },
      { id: 'li-6', sku: 'PRD-008', name: 'Brass Ball Valve 2-Inch Full Port', quantity: 25, receivedQuantity: 25, damagedQuantity: 0, unitPrice: 28.0 },
    ],
  },
  {
    id: 'PO-2026-044',
    supplierId: 'sup-2',
    supplierName: 'AirPure Filtration Systems',
    contactEmail: 'sales@airpurefilter.com',
    contactPhone: '+1 (555) 342-1100',
    warehouse: 'WH-MAIN',
    orderDate: '2026-11-01',
    expectedDelivery: '2026-11-08',
    paymentTerms: 'Net 30',
    status: 'Draft',
    paymentStatus: 'Unpaid',
    freightCost: 65.0,
    totalAmount: 1915.0,
    lineItems: [
      { id: 'li-7', sku: 'PRD-001', name: 'Industrial HVAC Filter 24x24x2', quantity: 100, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 18.5 },
    ],
  },
  {
    id: 'PO-2026-045',
    supplierId: 'sup-4',
    supplierName: 'EcoChill Gases & Refrigerants',
    contactEmail: 'supply@ecochill.com',
    contactPhone: '+1 (555) 670-3329',
    warehouse: 'WH-SOUTH',
    orderDate: '2026-10-30',
    expectedDelivery: '2026-11-04',
    paymentTerms: 'Net 30',
    status: 'Sent',
    paymentStatus: 'Unpaid',
    freightCost: 110.0,
    totalAmount: 3410.0,
    trackingNumber: 'R+L-55291',
    carrier: 'R+L Carriers',
    lineItems: [
      { id: 'li-8', sku: 'PRD-005', name: 'Refrigerant R410A Cylinder (25 lb)', quantity: 30, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 110.0 },
    ],
  },
];

const initialReceipts: GoodsReceipt[] = [
  {
    id: 'GRN-108',
    poId: 'PO-2026-043',
    supplierName: 'Apex Fluid Power Ltd',
    warehouse: 'WH-MAIN',
    receivedDate: '2026-10-28',
    carrier: 'Old Dominion Freight',
    trackingNumber: 'ODFL-449102',
    itemsReceived: 65,
    itemsDamaged: 0,
    status: 'Inspection Passed',
    inspectedBy: 'Marcus Sterling',
  },
  {
    id: 'GRN-107',
    poId: 'PO-2026-039',
    supplierName: 'Pacific Paper & Packaging Co',
    warehouse: 'WH-WEST',
    receivedDate: '2026-10-15',
    carrier: 'FedEx Freight',
    trackingNumber: 'FX-339102',
    itemsReceived: 490,
    itemsDamaged: 10,
    status: 'Discrepancy Reported',
    inspectedBy: 'Elena Rostova',
  },
  {
    id: 'GRN-109',
    poId: 'PO-2026-045',
    supplierName: 'EcoChill Gases & Refrigerants',
    warehouse: 'WH-SOUTH',
    receivedDate: '2026-11-04 (Today)',
    carrier: 'R+L Carriers',
    trackingNumber: 'R+L-55291',
    itemsReceived: 30,
    itemsDamaged: 0,
    status: 'Awaiting Inspection',
    inspectedBy: 'Javier Garza',
  },
];

const initialComparisons: PriceComparisonItem[] = [
  {
    id: 'pc-1',
    sku: 'PRD-001',
    productName: 'Industrial HVAC Filter 24x24x2',
    category: 'HVAC & Refrigeration',
    unit: 'pcs',
    supplierA: { name: 'AirPure Filtration Systems', price: 18.5, leadTime: '3 days' },
    supplierB: { name: 'FilterPro Distribution', price: 21.0, leadTime: '5 days' },
    bestPriceSupplier: 'AirPure Filtration Systems',
    savingsPercentage: 11.9,
  },
  {
    id: 'pc-2',
    sku: 'PRD-002',
    productName: 'Hydraulic Seal Kit (Series 400)',
    category: 'Hydraulic Parts',
    unit: 'kits',
    supplierA: { name: 'Apex Fluid Power Ltd', price: 85.0, leadTime: '4 days' },
    supplierB: { name: 'PowerSeal Fluidics', price: 98.0, leadTime: '7 days' },
    bestPriceSupplier: 'Apex Fluid Power Ltd',
    savingsPercentage: 13.2,
  },
  {
    id: 'pc-3',
    sku: 'PRD-005',
    productName: 'Refrigerant R410A Cylinder (25 lb)',
    category: 'HVAC & Refrigeration',
    unit: 'cylinders',
    supplierA: { name: 'EcoChill Gases & Refrigerants', price: 110.0, leadTime: '2 days' },
    supplierB: { name: 'National Coolant Wholesale', price: 125.0, leadTime: '4 days' },
    bestPriceSupplier: 'EcoChill Gases & Refrigerants',
    savingsPercentage: 12.0,
  },
  {
    id: 'pc-4',
    sku: 'PRD-008',
    productName: 'Brass Ball Valve 2-Inch Full Port',
    category: 'Hardware & Fasteners',
    unit: 'pcs',
    supplierA: { name: 'Apex Fluid Power Ltd', price: 28.0, leadTime: '4 days' },
    supplierB: { name: 'Titan Hardware & Fasteners', price: 34.5, leadTime: '6 days' },
    bestPriceSupplier: 'Apex Fluid Power Ltd',
    savingsPercentage: 18.8,
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

export default function ProcurementPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers' | 'receiving' | 'pricing'>('orders');

  // State
  const [pos, setPos] = useState<PurchaseOrder[]>(initialPOs);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [receipts, setReceipts] = useState<GoodsReceipt[]>(initialReceipts);
  const [comparisons] = useState<PriceComparisonItem[]>(initialComparisons);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Modals & Drawers
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New PO Form State
  const [selectedSupplierId, setSelectedSupplierId] = useState(initialSuppliers[0]?.id || '');
  const [destinationWarehouse, setDestinationWarehouse] = useState('WH-MAIN');
  const [expectedDate, setExpectedDate] = useState('2026-11-12');
  const [paymentTerms, setPaymentTerms] = useState<PurchaseOrder['paymentTerms']>('Net 30');
  const [carrierInput, setCarrierInput] = useState('Standard Freight Carrier');
  const [freightCostInput, setFreightCostInput] = useState<number>(100);
  const [lineItemsForm, setLineItemsForm] = useState<POLineItem[]>([
    { id: '1', sku: 'ITEM-01', name: 'Raw Stock Supplies', quantity: 20, receivedQuantity: 0, damagedQuantity: 0, unitPrice: 45.0 },
  ]);

  // New Supplier Form State
  const [newSupName, setNewSupName] = useState('');
  const [newSupCategory, setNewSupCategory] = useState<Supplier['category']>('Hydraulic Parts');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupAddress, setNewSupAddress] = useState('');
  const [newSupTerms, setNewSupTerms] = useState('Net 30');
  const [newSupLeadTime, setNewSupLeadTime] = useState<number>(4);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Filtered Data ──────────────────────────────────────────────────────────

  const filteredPOs = useMemo(() => {
    return pos.filter((po) => {
      const matchesSearch =
        po.id.toLowerCase().includes(search.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        po.warehouse.toLowerCase().includes(search.toLowerCase()) ||
        po.lineItems.some((li) => li.name.toLowerCase().includes(search.toLowerCase()) || li.sku.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || po.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPayment = paymentFilter === 'all' || po.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [pos, search, statusFilter, paymentFilter]);

  // ─── KPI Calculations ───────────────────────────────────────────────────────

  const totalSpent = useMemo(() => {
    return pos.reduce((sum, po) => sum + po.totalAmount, 0);
  }, [pos]);

  const openOrdersCount = useMemo(() => {
    return pos.filter((po) => po.status === 'Sent' || po.status === 'Approved' || po.status === 'Partially Received').length;
  }, [pos]);

  const itemsOnTheWay = useMemo(() => {
    return pos
      .filter((po) => po.status === 'Sent' || po.status === 'Partially Received')
      .reduce((sum, po) => sum + po.lineItems.reduce((acc, li) => acc + (li.quantity - li.receivedQuantity), 0), 0);
  }, [pos]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddLineItemRow = () => {
    const newItem: POLineItem = {
      id: `li-${Date.now()}`,
      sku: `MAT-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      quantity: 10,
      receivedQuantity: 0,
      damagedQuantity: 0,
      unitPrice: 25.0,
    };
    setLineItemsForm([...lineItemsForm, newItem]);
  };

  const handleRemoveLineItemRow = (id: string) => {
    if (lineItemsForm.length <= 1) return;
    setLineItemsForm(lineItemsForm.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof POLineItem, value: any) => {
    setLineItemsForm(
      lineItemsForm.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculatedSubtotal = useMemo(() => {
    return lineItemsForm.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }, [lineItemsForm]);

  const calculatedGrandTotal = useMemo(() => {
    return calculatedSubtotal + Number(freightCostInput || 0);
  }, [calculatedSubtotal, freightCostInput]);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
    if (!supplier) return;

    const newPO: PurchaseOrder = {
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      contactEmail: supplier.email,
      contactPhone: supplier.phone,
      warehouse: destinationWarehouse,
      orderDate: new Date().toISOString().split('T')[0] || '2026-11-04',
      expectedDelivery: expectedDate || '2026-11-15',
      paymentTerms: paymentTerms,
      status: 'Approved',
      paymentStatus: 'Unpaid',
      freightCost: Number(freightCostInput),
      totalAmount: calculatedGrandTotal,
      carrier: carrierInput,
      lineItems: lineItemsForm.map((li) => ({
        ...li,
        name: li.name.trim() || 'Supplied Materials',
      })),
    };

    setPos([newPO, ...pos]);
    setIsNewPOModalOpen(false);

    // Update supplier count
    setSuppliers(
      suppliers.map((s) =>
        s.id === supplier.id ? { ...s, activeOrdersCount: s.activeOrdersCount + 1 } : s
      )
    );

    showToast(`Purchase order ${newPO.id} generated and ready to send to ${supplier.name}`);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newSup: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupName.trim(),
      category: newSupCategory,
      contactPerson: newSupContact.trim() || 'Purchasing Contact',
      email: newSupEmail.trim() || 'contact@supplier.com',
      phone: newSupPhone.trim() || '+1 (555) 000-0000',
      address: newSupAddress.trim() || 'Primary Supplier Facility',
      paymentTerms: newSupTerms,
      leadTimeDays: Number(newSupLeadTime),
      rating: 5.0,
      activeOrdersCount: 0,
      totalSpend: 0,
      status: 'Active',
    };

    setSuppliers([...suppliers, newSup]);
    setIsSupplierModalOpen(false);
    setNewSupName('');
    setNewSupContact('');
    setNewSupEmail('');
    setNewSupPhone('');
    setNewSupAddress('');
    showToast(`Supplier ${newSup.name} added to vendor roster`);
  };

  const handleUpdatePOStatus = (poId: string, newStatus: POStatus) => {
    const updated = pos.map((p) => {
      if (p.id === poId) {
        return {
          ...p,
          status: newStatus,
          inspectionPassed: newStatus === 'Received' ? true : p.inspectionPassed,
        };
      }
      return p;
    });

    setPos(updated);
    if (selectedPO && selectedPO.id === poId) {
      setSelectedPO({
        ...selectedPO,
        status: newStatus,
        inspectionPassed: newStatus === 'Received' ? true : selectedPO.inspectionPassed,
      });
    }

    // If marked received, add to GRN list
    if (newStatus === 'Received') {
      const target = pos.find((p) => p.id === poId);
      if (target) {
        const totalUnits = target.lineItems.reduce((acc, li) => acc + li.quantity, 0);
        const newGRN: GoodsReceipt = {
          id: `GRN-${Math.floor(100 + Math.random() * 900)}`,
          poId: target.id,
          supplierName: target.supplierName,
          warehouse: target.warehouse,
          receivedDate: 'Today, Just Now',
          carrier: target.carrier || 'Direct Supplier Freight',
          trackingNumber: target.trackingNumber || 'LOCAL-DIRECT',
          itemsReceived: totalUnits,
          itemsDamaged: 0,
          status: 'Inspection Passed',
          inspectedBy: 'Current Receiver',
        };
        setReceipts([newGRN, ...receipts]);
      }
    }

    showToast(`Order ${poId} status changed to ${newStatus}`);
  };

  const handleTogglePayment = (poId: string) => {
    const updated = pos.map((p) => {
      if (p.id === poId) {
        const newPay = p.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
        return { ...p, paymentStatus: newPay as PaymentStatus };
      }
      return p;
    });

    setPos(updated);
    if (selectedPO && selectedPO.id === poId) {
      const newPay = selectedPO.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
      setSelectedPO({ ...selectedPO, paymentStatus: newPay as PaymentStatus });
    }
    showToast(`Updated payment status for ${poId}`);
  };

  const handleExportCSV = () => {
    const headers = ['PO Number,Supplier,Warehouse,Order Date,Expected Date,Status,Payment Status,Items Count,Freight,Total'];
    const rows = pos.map((p) =>
      `"${p.id}","${p.supplierName}","${p.warehouse}","${p.orderDate}","${p.expectedDelivery}","${p.status}","${p.paymentStatus}",${p.lineItems.length},${p.freightCost},${p.totalAmount}`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bahi_purchases_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Purchase orders report exported as CSV');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-ink dark:text-neutral-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141513] text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0284C7]/15 text-[#0284C7] dark:text-[#38BDF8] border border-[#0284C7]/30 font-mono">
              Purchases &amp; Suppliers
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Procurement &amp; Inbound
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Purchases &amp; Suppliers
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Order supplies from vendors, compare item prices, and inspect shipments when they arrive at your loading dock.
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
            title="Export all purchase order records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewPOModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] border-[#0284C7]/40 cursor-pointer font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Spent on Supplies</span>
            <DollarSign className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Under monthly operating budget</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Open Orders</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{openOrdersCount}</div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Awaiting vendor shipment or arrival</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Suppliers</span>
            <Building2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">{suppliers.length}</div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Trusted supplier directory</p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted dark:text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Items on the Way</span>
            <Truck className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-black text-[#0284C7] dark:text-[#38BDF8] font-mono">
            {itemsOnTheWay} <span className="text-xs font-normal text-ink-muted dark:text-neutral-400">units</span>
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">Scheduled for loading dock check</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27]">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'orders'
                ? 'border-[#0284C7] text-[#0284C7] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Purchase Orders</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {pos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suppliers')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'suppliers'
                ? 'border-[#0284C7] text-[#0284C7] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Supplier Directory</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {suppliers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('receiving')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'receiving'
                ? 'border-[#0284C7] text-[#0284C7] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Shipment Receiving &amp; Check</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
              {receipts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'pricing'
                ? 'border-[#0284C7] text-[#0284C7] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                : 'border-transparent text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Vendor Price Comparison</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: PURCHASE ORDERS ────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#1A1B18] p-3.5 rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['all', 'draft', 'approved', 'sent', 'received'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#0284C7]/20 text-[#0284C7] dark:text-[#38BDF8] border border-[#0284C7]/30'
                      : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {st}
                </button>
              ))}

              <span className="text-border dark:text-neutral-700 px-1">|</span>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
              >
                <option value="all">All Payment Statuses</option>
                <option value="unpaid">Unpaid Invoices</option>
                <option value="paid">Paid Invoices</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search PO #, vendor, item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#0284C7]"
              />
              <Search className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-500 absolute left-2.5 top-2" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">PO Ref &amp; Date</th>
                    <th className="py-3 px-4">Supplier &amp; Payment Terms</th>
                    <th className="py-3 px-4">Destination Storage</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Expected Delivery</th>
                    <th className="py-3 px-4 text-center">Order Status</th>
                    <th className="py-3 px-4 text-right">Total ($)</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {filteredPOs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-400">
                        No purchase orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredPOs.map((po) => (
                      <tr
                        key={po.id}
                        onClick={() => setSelectedPO(po)}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">
                          <div>{po.id}</div>
                          <span className="text-[10px] text-ink-muted dark:text-neutral-400 font-sans font-normal">
                            {po.orderDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-ink dark:text-white">{po.supplierName}</div>
                          <div className="text-[10px] text-ink-muted dark:text-neutral-400">{po.paymentTerms}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] font-semibold text-ink dark:text-neutral-200">
                            {po.warehouse}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-ink dark:text-white">
                            {po.lineItems.reduce((acc, li) => acc + li.quantity, 0)} units
                          </div>
                          <div className="text-[10px] text-ink-muted dark:text-neutral-400 truncate max-w-[150px]">
                            {po.lineItems.map((li) => li.name).join(', ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-ink dark:text-neutral-300 font-medium">
                          {po.expectedDelivery}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              po.status === 'Received'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : po.status === 'Sent'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                : po.status === 'Approved'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-neutral-500/10 text-neutral-500'
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white text-sm">
                          {formatCurrency(po.totalAmount)}
                          <div className="text-[10px] font-normal font-sans">
                            {po.paymentStatus === 'Paid' ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Paid</span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">○ Unpaid</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPO(po);
                            }}
                            className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:underline px-2 py-1"
                          >
                            Inspect / Manage →
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

      {/* ─── TAB 2: SUPPLIERS DIRECTORY ────────────────────────────────────── */}
      {activeTab === 'suppliers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ink dark:text-white">Supplier &amp; Vendor Catalog</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Track your vendor contracts, typical lead times, payment terms, and lifetime spending.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] dark:text-[#38BDF8]">
                      {sup.category}
                    </span>
                    <h4 className="font-bold text-base text-ink dark:text-white mt-0.5">{sup.name}</h4>
                    <p className="text-xs text-ink-muted dark:text-neutral-400">{sup.contactPerson}</p>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-500">
                    ★ {sup.rating}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-border dark:border-[#2A2B27] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase">Lead Time</span>
                    <div className="font-mono font-bold text-ink dark:text-white">{sup.leadTimeDays} days</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase">Terms</span>
                    <div className="font-mono font-bold text-ink dark:text-white">{sup.paymentTerms}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase">Spend</span>
                    <div className="font-mono font-bold text-ink dark:text-white">{formatCurrency(sup.totalSpend)}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-ink-muted dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-ink dark:text-neutral-300 flex-shrink-0" />
                    <span className="font-mono">{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-ink dark:text-neutral-300 flex-shrink-0" />
                    <span className="truncate">{sup.address}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSupplierId(sup.id);
                      setIsNewPOModalOpen(true);
                    }}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <span>Order Supplies</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: SHIPMENT RECEIVING & INSPECTION ─────────────────────────── */}
      {activeTab === 'receiving' && (
        <div className="space-y-4">
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-4 flex items-start gap-3">
            <Truck className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-sky-900 dark:text-sky-300">
                Inbound Freight Receiving &amp; Quality Inspection
              </h3>
              <p className="text-xs text-sky-800 dark:text-sky-400 mt-0.5">
                Verify delivered parcel quantities against your issued Purchase Orders before moving stock to shelves or storage rooms.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">Receipt Ref (GRN)</th>
                    <th className="py-3 px-4">Linked PO</th>
                    <th className="py-3 px-4">Vendor &amp; Destination</th>
                    <th className="py-3 px-4">Freight Carrier &amp; Tracking</th>
                    <th className="py-3 px-4 text-center">Units Checked</th>
                    <th className="py-3 px-4">Inspection Date</th>
                    <th className="py-3 px-4 text-center">Quality Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {receipts.map((grn) => (
                    <tr key={grn.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">{grn.id}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-ink dark:text-white">{grn.poId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-ink dark:text-white">{grn.supplierName}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">Warehouse: {grn.warehouse}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink dark:text-white">{grn.carrier}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400 font-mono">{grn.trackingNumber}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {grn.itemsReceived} received
                        </span>
                        {grn.itemsDamaged > 0 && (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                            {grn.itemsDamaged} damaged
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">
                        <div>{grn.receivedDate}</div>
                        <div className="text-[10px]">By {grn.inspectedBy}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            grn.status === 'Inspection Passed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : grn.status === 'Discrepancy Reported'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {grn.status}
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

      {/* ─── TAB 4: VENDOR PRICE COMPARISON & RFQ ───────────────────────────── */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border dark:border-[#2A2B27]">
              <h3 className="font-bold text-sm text-ink dark:text-white">Supply Price Comparison Matrix</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Compare negotiated unit rates, lead times, and potential bulk procurement savings across competing suppliers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                  <tr>
                    <th className="py-3 px-4">Product SKU &amp; Name</th>
                    <th className="py-3 px-4">Primary Vendor Rate</th>
                    <th className="py-3 px-4">Alternative Vendor Rate</th>
                    <th className="py-3 px-4">Recommended Source</th>
                    <th className="py-3 px-4 text-right">Unit Price Savings</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                  {comparisons.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-bold text-ink dark:text-white">
                        <div>{c.productName}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400 font-mono">{c.sku} ({c.unit})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-ink dark:text-white">{formatCurrency(c.supplierA.price)}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">{c.supplierA.name} ({c.supplierA.leadTime})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-ink dark:text-white">{formatCurrency(c.supplierB.price)}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">{c.supplierB.name} ({c.supplierB.leadTime})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ✓ {c.bestPriceSupplier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Save {c.savingsPercentage}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const found = suppliers.find((s) => s.name === c.bestPriceSupplier);
                            setSelectedSupplierId(found ? found.id : (suppliers[0]?.id || ''));
                            setIsNewPOModalOpen(true);
                          }}
                          className="btn-primary text-xs py-1 px-3 cursor-pointer bg-[#0284C7] hover:bg-[#0369A1]"
                        >
                          Order via Best Rate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: CREATE NEW PURCHASE ORDER ────────────────────────────── */}
      {isNewPOModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Create Purchase Order (PO)</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">Draft an order to restock supplies from your vendor.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPOModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Select Supplier *</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden font-medium"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.paymentTerms})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Delivery Destination Storage</label>
                  <select
                    value={destinationWarehouse}
                    onChange={(e) => setDestinationWarehouse(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden"
                  >
                    <option value="WH-MAIN">WH-MAIN (Central Distribution Center)</option>
                    <option value="WH-WEST">WH-WEST (Pacific Regional Depot)</option>
                    <option value="WH-SOUTH">WH-SOUTH (Southern Logistics Facility)</option>
                    <option value="VAN-01">VAN-01 (Field Crew Mobile Van 1)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Advance Payment">Advance Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Estimated Freight ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={freightCostInput}
                    onChange={(e) => setFreightCostInput(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Dynamic Line Items Table */}
              <div className="space-y-2 pt-2 border-t border-border dark:border-[#2A2B27]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink dark:text-white uppercase tracking-wider text-[11px]">
                    Order Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItemRow}
                    className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItemsForm.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-neutral-50 dark:bg-neutral-900/60 p-2 rounded-lg border border-border dark:border-[#2A2B27]">
                      <div className="col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Item Name / Description"
                          value={item.name}
                          onChange={(e) => handleLineItemChange(item.id, 'name', e.target.value)}
                          className="w-full p-1.5 rounded border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="SKU"
                          value={item.sku}
                          onChange={(e) => handleLineItemChange(item.id, 'sku', e.target.value)}
                          className="w-full p-1.5 rounded border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white font-mono text-xs"
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
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
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

                {/* Subtotal Calculation */}
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="text-ink-muted dark:text-neutral-400">
                    Subtotal: <span className="font-mono font-bold text-ink dark:text-white">{formatCurrency(calculatedSubtotal)}</span> + Freight: <span className="font-mono font-bold text-ink dark:text-white">{formatCurrency(freightCostInput)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-ink-muted uppercase">Grand Total: </span>
                    <span className="font-mono font-black text-sm text-[#0284C7] dark:text-[#38BDF8]">
                      {formatCurrency(calculatedGrandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Carrier / Delivery Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Deliver to Dock 2, call receiving manager prior to arrival"
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewPOModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#0284C7] hover:bg-[#0369A1] font-semibold"
                >
                  Generate &amp; Approve Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD NEW SUPPLIER ─────────────────────────────────────── */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border dark:border-[#2A2B27] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">Add New Supplier</h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">Onboard a vendor to your procurement directory.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Supplies"
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Supply Category</label>
                <select
                  value={newSupCategory}
                  onChange={(e) => setNewSupCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                >
                  <option value="Hydraulic Parts">Hydraulic Parts</option>
                  <option value="HVAC & Refrigeration">HVAC &amp; Refrigeration</option>
                  <option value="Electrical & Controls">Electrical &amp; Controls</option>
                  <option value="Raw Materials & Metals">Raw Materials &amp; Metals</option>
                  <option value="Packaging & Paper">Packaging &amp; Paper</option>
                  <option value="Hardware & Fasteners">Hardware &amp; Fasteners</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Contact Representative</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={newSupContact}
                    onChange={(e) => setNewSupContact(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Representative Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Official Orders Email</label>
                <input
                  type="email"
                  placeholder="orders@supplier.com"
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Payment Terms</label>
                  <select
                    value={newSupTerms}
                    onChange={(e) => setNewSupTerms(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink dark:text-white mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newSupLeadTime}
                    onChange={(e) => setNewSupLeadTime(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink dark:text-white mb-1">Facility Address</label>
                <input
                  type="text"
                  placeholder="e.g. 102 Logistics Park, Chicago, IL"
                  value={newSupAddress}
                  onChange={(e) => setNewSupAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#0284C7] hover:bg-[#0369A1]"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DRAWER 3: PURCHASE ORDER DETAILS & RECEIVING INSPECTOR ────────── */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border-l border-border dark:border-[#2A2B27] h-full max-w-lg w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border dark:border-[#2A2B27]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#0284C7] dark:text-[#38BDF8]">
                    {selectedPO.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedPO.status === 'Received'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : selectedPO.status === 'Sent'
                        ? 'bg-blue-500/10 text-blue-600'
                        : selectedPO.status === 'Approved'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-neutral-500/10 text-neutral-500'
                    }`}
                  >
                    {selectedPO.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPO(null)}
                  className="text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Supplier Info */}
              <div>
                <h2 className="text-xl font-black text-ink dark:text-white">{selectedPO.supplierName}</h2>
                <div className="text-xs text-ink-muted dark:text-neutral-400 mt-1 space-y-1">
                  <div>Destination: <span className="font-mono font-bold text-ink dark:text-white">{selectedPO.warehouse}</span></div>
                  <div>Terms: {selectedPO.paymentTerms} • Order Date: {selectedPO.orderDate}</div>
                  <div>Expected Delivery: <span className="font-bold text-ink dark:text-white">{selectedPO.expectedDelivery}</span></div>
                </div>
              </div>

              {/* Status Progression Controls */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border dark:border-[#2A2B27] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
                    Order Lifecycle Status
                  </span>
                  <span className="font-bold text-xs text-[#0284C7] dark:text-[#38BDF8]">
                    Current: {selectedPO.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {(['Draft', 'Approved', 'Sent', 'Received'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdatePOStatus(selectedPO.id, st)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
                        selectedPO.status === st
                          ? 'border-[#0284C7] bg-[#0284C7]/20 text-[#0284C7] dark:text-[#38BDF8]'
                          : 'border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-400 hover:text-ink'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordered Line Items Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-white block">
                  Items on Purchase Order
                </span>

                <div className="space-y-1.5">
                  {selectedPO.lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-ink dark:text-white">{item.name}</div>
                        <span className="text-[10px] font-mono text-ink-muted dark:text-neutral-400">
                          SKU: {item.sku}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-ink dark:text-white">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                        <span className="text-[10px] text-ink-muted dark:text-neutral-400 font-mono">
                          {item.quantity} units × {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carrier & Tracking */}
              {selectedPO.carrier && (
                <div className="p-3.5 rounded-xl border border-border dark:border-[#2A2B27] text-xs space-y-1 bg-neutral-50/50 dark:bg-neutral-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-muted dark:text-neutral-400">Carrier Service</span>
                    <span className="font-semibold text-ink dark:text-white">{selectedPO.carrier}</span>
                  </div>
                  {selectedPO.trackingNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted dark:text-neutral-400">Tracking Number</span>
                      <span className="font-mono font-bold text-[#0284C7] dark:text-[#38BDF8]">{selectedPO.trackingNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Financials & Invoicing */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted dark:text-neutral-400 uppercase">Total Invoice Amount</span>
                  <div className="text-xl font-black text-ink dark:text-white font-mono">
                    {formatCurrency(selectedPO.totalAmount)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePayment(selectedPO.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPO.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedPO.paymentStatus === 'Paid' ? 'Paid to Supplier' : 'Mark as Paid'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border dark:border-[#2A2B27] flex items-center justify-between gap-2">
              {selectedPO.status !== 'Received' ? (
                <button
                  type="button"
                  onClick={() => handleUpdatePOStatus(selectedPO.id, 'Received')}
                  className="btn-primary py-2 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dock Intake (Received)</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> In Stock at {selectedPO.warehouse}
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedPO(null)}
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
