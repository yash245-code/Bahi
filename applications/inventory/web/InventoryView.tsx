'use client';

import React, { useState, useMemo } from 'react';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ProductItem {
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  binLocation: string;
  unit: string;
  stock: number;
  reserved: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  lastRestocked: string;
  status: StockStatus;
}

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  type: 'Central Depot' | 'Regional Hub' | 'Mobile Van Stock' | 'Workshop Staging';
  location: string;
  manager: string;
  productsCount: number;
  totalUnits: number;
  utilization: number;
  status: 'active' | 'warning' | 'full';
}

export interface StockMovement {
  ref: string;
  type: 'Receipt' | 'Shipment' | 'Transfer' | 'Adjustment' | 'Job Usage';
  sku: string;
  productName: string;
  qty: number;
  fromLocation: string;
  toLocation: string;
  date: string;
  reason: string;
  operator: string;
}

// ─── Initial Demo Data for Tenant Company ────────────────────────────────────

const initialProducts: ProductItem[] = [
  {
    sku: 'PRD-001',
    name: 'Industrial HVAC Filter 24x24x2',
    category: 'Consumables',
    warehouse: 'WH-MAIN',
    binLocation: 'Aisle 3, Bin B-12',
    unit: 'pcs',
    stock: 142,
    reserved: 12,
    reorderPoint: 40,
    costPrice: 18.5,
    sellingPrice: 42.0,
    supplier: 'AirPure filtration Co.',
    lastRestocked: '2026-10-24',
    status: 'In Stock',
  },
  {
    sku: 'PRD-002',
    name: 'Hydraulic Seal Kit (Series 400)',
    category: 'Spare Parts',
    warehouse: 'WH-WEST',
    binLocation: 'Aisle 1, Bin D-04',
    unit: 'kits',
    stock: 6,
    reserved: 2,
    reorderPoint: 15,
    costPrice: 85.0,
    sellingPrice: 175.0,
    supplier: 'Apex Fluid Power',
    lastRestocked: '2026-09-18',
    status: 'Low Stock',
  },
  {
    sku: 'PRD-003',
    name: 'Digital Multimeter Pro 1000V',
    category: 'Tools & Equipment',
    warehouse: 'WH-MAIN',
    binLocation: 'Secured Tool Cage 2',
    unit: 'units',
    stock: 28,
    reserved: 4,
    reorderPoint: 10,
    costPrice: 140.0,
    sellingPrice: 280.0,
    supplier: 'VoltTech Instruments',
    lastRestocked: '2026-10-12',
    status: 'In Stock',
  },
  {
    sku: 'PRD-004',
    name: 'High-Temp Thermal Coupling 1/2"',
    category: 'Spare Parts',
    warehouse: 'WH-SOUTH',
    binLocation: 'Aisle 2, Bin C-08',
    unit: 'pcs',
    stock: 0,
    reserved: 0,
    reorderPoint: 25,
    costPrice: 32.0,
    sellingPrice: 68.0,
    supplier: 'ThermoFlow Ltd',
    lastRestocked: '2026-08-30',
    status: 'Out of Stock',
  },
  {
    sku: 'PRD-005',
    name: 'Refrigerant R410A Cylinder (25 lb)',
    category: 'Consumables',
    warehouse: 'WH-MAIN',
    binLocation: 'Hazmat Bay 1',
    unit: 'cylinders',
    stock: 35,
    reserved: 6,
    reorderPoint: 12,
    costPrice: 110.0,
    sellingPrice: 240.0,
    supplier: 'EcoChill Gases',
    lastRestocked: '2026-10-28',
    status: 'In Stock',
  },
  {
    sku: 'PRD-006',
    name: 'Variable Frequency Drive 5HP',
    category: 'Electronics',
    warehouse: 'WH-WEST',
    binLocation: 'Aisle 4, Bin A-02',
    unit: 'units',
    stock: 4,
    reserved: 1,
    reorderPoint: 8,
    costPrice: 420.0,
    sellingPrice: 890.0,
    supplier: 'Omicron Motor Controls',
    lastRestocked: '2026-09-05',
    status: 'Low Stock',
  },
  {
    sku: 'PRD-007',
    name: 'Industrial Heavy Duty Lubricant (5L)',
    category: 'Consumables',
    warehouse: 'VAN-01',
    binLocation: 'Service Van Rack #2',
    unit: 'cans',
    stock: 18,
    reserved: 3,
    reorderPoint: 10,
    costPrice: 24.0,
    sellingPrice: 55.0,
    supplier: 'PetroLube Global',
    lastRestocked: '2026-10-30',
    status: 'In Stock',
  },
  {
    sku: 'PRD-008',
    name: 'Brass Ball Valve 2-Inch Full Port',
    category: 'Spare Parts',
    warehouse: 'WH-SOUTH',
    binLocation: 'Aisle 2, Bin A-10',
    unit: 'pcs',
    stock: 54,
    reserved: 8,
    reorderPoint: 20,
    costPrice: 28.0,
    sellingPrice: 62.0,
    supplier: 'Apex Fluid Power',
    lastRestocked: '2026-10-15',
    status: 'In Stock',
  },
];

const initialWarehouses: WarehouseLocation[] = [
  {
    id: 'wh-1',
    code: 'WH-MAIN',
    name: 'Central Distribution Center',
    type: 'Central Depot',
    location: '480 Industrial Pkwy, Newark, NJ',
    manager: 'Marcus Sterling',
    productsCount: 156,
    totalUnits: 4820,
    utilization: 78,
    status: 'active',
  },
  {
    id: 'wh-2',
    code: 'WH-WEST',
    name: 'Pacific Regional Depot',
    type: 'Regional Hub',
    location: '1200 Harbor Blvd, Long Beach, CA',
    manager: 'Elena Rostova',
    productsCount: 89,
    totalUnits: 2190,
    utilization: 45,
    status: 'active',
  },
  {
    id: 'wh-3',
    code: 'WH-SOUTH',
    name: 'Southern Logistics Facility',
    type: 'Regional Hub',
    location: '750 Commerce Dr, Austin, TX',
    manager: 'Javier Garza',
    productsCount: 64,
    totalUnits: 3410,
    utilization: 92,
    status: 'warning',
  },
  {
    id: 'wh-4',
    code: 'VAN-01',
    name: 'Field Crew Mobile Inventory (Van 1)',
    type: 'Mobile Van Stock',
    location: 'Mobile Field Unit - Metro Area',
    manager: 'Carlos Mendez (Tech Lead)',
    productsCount: 32,
    totalUnits: 145,
    utilization: 62,
    status: 'active',
  },
];

const initialMoves: StockMovement[] = [
  {
    ref: 'SM-1049',
    type: 'Receipt',
    sku: 'PRD-001',
    productName: 'Industrial HVAC Filter 24x24x2',
    qty: 100,
    fromLocation: 'Supplier (AirPure filtration)',
    toLocation: 'WH-MAIN',
    date: 'Today, 11:20 AM',
    reason: 'Restock Purchase Order PO-8821',
    operator: 'Marcus Sterling',
  },
  {
    ref: 'SM-1048',
    type: 'Transfer',
    sku: 'PRD-007',
    productName: 'Industrial Heavy Duty Lubricant (5L)',
    qty: 6,
    fromLocation: 'WH-MAIN',
    toLocation: 'VAN-01',
    date: 'Today, 08:45 AM',
    reason: 'Field Van Weekly Replenishment',
    operator: 'Carlos Mendez',
  },
  {
    ref: 'SM-1047',
    type: 'Job Usage',
    sku: 'PRD-005',
    productName: 'Refrigerant R410A Cylinder (25 lb)',
    qty: 2,
    fromLocation: 'VAN-01',
    toLocation: 'Job Site (WO-4091)',
    date: 'Yesterday, 3:15 PM',
    reason: 'HVAC Recharge for Highland Residency',
    operator: 'Carlos Mendez',
  },
  {
    ref: 'SM-1046',
    type: 'Adjustment',
    sku: 'PRD-002',
    productName: 'Hydraulic Seal Kit (Series 400)',
    qty: -2,
    fromLocation: 'WH-WEST',
    toLocation: 'Scrap & Damage',
    date: 'Nov 01, 2026',
    reason: 'Damaged packaging during forklift move',
    operator: 'Elena Rostova',
  },
  {
    ref: 'SM-1045',
    type: 'Shipment',
    sku: 'PRD-008',
    productName: 'Brass Ball Valve 2-Inch Full Port',
    qty: 12,
    fromLocation: 'WH-SOUTH',
    toLocation: 'Customer Site (SO-3109)',
    date: 'Oct 30, 2026',
    reason: 'Dispatched for Apex Logistics install',
    operator: 'Javier Garza',
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function InventoryView() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'warehouses' | 'moves' | 'alerts'>('catalog');

  // Core state
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [warehouses] = useState<WarehouseLocation[]>(initialWarehouses);
  const [moves, setMoves] = useState<StockMovement[]>(initialMoves);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals & Drawers
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for New Product
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Spare Parts');
  const [newWarehouse, setNewWarehouse] = useState('WH-MAIN');
  const [newBin, setNewBin] = useState('');
  const [newUnit, setNewUnit] = useState('pcs');
  const [newStock, setNewStock] = useState<number>(10);
  const [newReorder, setNewReorder] = useState<number>(5);
  const [newCostPrice, setNewCostPrice] = useState<number>(25);
  const [newSellingPrice, setNewSellingPrice] = useState<number>(55);
  const [newSupplier, setNewSupplier] = useState('');

  // Form states for Stock Movement
  const [moveType, setMoveType] = useState<StockMovement['type']>('Receipt');
  const [moveProductSku, setMoveProductSku] = useState(initialProducts[0]?.sku || '');
  const [moveQty, setMoveQty] = useState<number>(10);
  const [moveFrom, setMoveFrom] = useState('WH-MAIN');
  const [moveTo, setMoveTo] = useState('WH-SOUTH');
  const [moveReason, setMoveReason] = useState('');

  // Quick adjust inside product drawer
  const [quickAdjustAmount, setQuickAdjustAmount] = useState<number>(0);
  const [quickAdjustReason, setQuickAdjustReason] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Filtered Data ──────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.binLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesWh = selectedWarehouse === 'all' || p.warehouse === selectedWarehouse;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesCat && matchesWh && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedWarehouse, selectedStatus]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= p.reorderPoint);
  }, [products]);

  // ─── Calculations ──────────────────────────────────────────────────────────

  const totalInventoryValue = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
  }, [products]);

  const totalRetailPotential = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock * p.sellingPrice, 0);
  }, [products]);

  const totalUnitsOnHand = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock, 0);
  }, [products]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const generatedSku = newSku.trim() ? newSku.toUpperCase() : `PRD-${Math.floor(100 + Math.random() * 900)}`;
    const status: StockStatus =
      newStock === 0 ? 'Out of Stock' : newStock <= newReorder ? 'Low Stock' : 'In Stock';

    const todayStr = new Date().toISOString().split('T')[0] || '2026-11-03';
    const item: ProductItem = {
      sku: generatedSku,
      name: newName,
      category: newCategory,
      warehouse: newWarehouse,
      binLocation: newBin || 'Receiving Bay',
      unit: newUnit,
      stock: Number(newStock),
      reserved: 0,
      reorderPoint: Number(newReorder),
      costPrice: Number(newCostPrice),
      sellingPrice: Number(newSellingPrice),
      supplier: newSupplier || 'Local Wholesale Dist.',
      lastRestocked: todayStr,
      status,
    };

    setProducts([item, ...products]);

    // Also record movement
    if (newStock > 0) {
      const newMove: StockMovement = {
        ref: `SM-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Receipt',
        sku: item.sku,
        productName: item.name,
        qty: item.stock,
        fromLocation: item.supplier,
        toLocation: item.warehouse,
        date: 'Today, Just Now',
        reason: 'Initial stock intake upon product creation',
        operator: 'Store Manager',
      };
      setMoves([newMove, ...moves]);
    }

    setIsNewProductModalOpen(false);
    // Reset inputs
    setNewSku('');
    setNewName('');
    setNewBin('');
    setNewStock(10);
    setNewReorder(5);
    setNewCostPrice(25);
    setNewSellingPrice(55);
    setNewSupplier('');
    showToast(`Product ${item.name} (${item.sku}) added successfully`);
  };

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProduct = products.find((p) => p.sku === moveProductSku);
    if (!targetProduct) return;

    const qtyNumber = Number(moveQty);
    if (qtyNumber === 0) return;

    let updatedStock = targetProduct.stock;
    if (moveType === 'Receipt') {
      updatedStock += qtyNumber;
    } else if (moveType === 'Shipment' || moveType === 'Job Usage') {
      updatedStock = Math.max(0, updatedStock - qtyNumber);
    } else if (moveType === 'Adjustment') {
      updatedStock = Math.max(0, updatedStock + qtyNumber); // qty can be negative or positive
    }

    const newStatus: StockStatus =
      updatedStock === 0 ? 'Out of Stock' : updatedStock <= targetProduct.reorderPoint ? 'Low Stock' : 'In Stock';

    const todayStr = new Date().toISOString().split('T')[0] || '2026-11-03';
    setProducts(
      products.map((p) =>
        p.sku === moveProductSku
          ? {
              ...p,
              stock: updatedStock,
              status: newStatus,
              lastRestocked: moveType === 'Receipt' ? todayStr : p.lastRestocked,
            }
          : p
      )
    );

    const movement: StockMovement = {
      ref: `SM-${Math.floor(1000 + Math.random() * 9000)}`,
      type: moveType,
      sku: targetProduct.sku,
      productName: targetProduct.name,
      qty: moveType === 'Shipment' || moveType === 'Job Usage' ? -Math.abs(qtyNumber) : qtyNumber,
      fromLocation: moveType === 'Receipt' ? 'Supplier Direct' : moveFrom,
      toLocation: moveType === 'Transfer' ? moveTo : moveType === 'Receipt' ? moveFrom : 'Customer / Destination',
      date: 'Today, Just Now',
      reason: moveReason || `Operational ${moveType.toLowerCase()} entry`,
      operator: 'Current User',
    };

    setMoves([movement, ...moves]);
    setIsMovementModalOpen(false);
    setMoveReason('');
    showToast(`Recorded ${moveType} of ${Math.abs(qtyNumber)} units for ${targetProduct.name}`);
  };

  const handleQuickAdjustStock = () => {
    if (!selectedProduct || quickAdjustAmount === 0) return;

    const newStockCount = Math.max(0, selectedProduct.stock + quickAdjustAmount);
    const newStatus: StockStatus =
      newStockCount === 0 ? 'Out of Stock' : newStockCount <= selectedProduct.reorderPoint ? 'Low Stock' : 'In Stock';

    const updated = {
      ...selectedProduct,
      stock: newStockCount,
      status: newStatus,
    };

    setProducts(products.map((p) => (p.sku === selectedProduct.sku ? updated : p)));
    setSelectedProduct(updated);

    const movement: StockMovement = {
      ref: `SM-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Adjustment',
      sku: selectedProduct.sku,
      productName: selectedProduct.name,
      qty: quickAdjustAmount,
      fromLocation: selectedProduct.warehouse,
      toLocation: quickAdjustAmount > 0 ? 'Cycle Count Addition' : 'Loss / Damage Write-Off',
      date: 'Today, Just Now',
      reason: quickAdjustReason || 'Manual inventory quantity adjustment',
      operator: 'Current User',
    };

    setMoves([movement, ...moves]);
    setQuickAdjustAmount(0);
    setQuickAdjustReason('');
    showToast(`Updated stock for ${selectedProduct.name} to ${newStockCount} units`);
  };

  const handleExportCSV = () => {
    const headers = ['SKU,Name,Category,Warehouse,Bin Location,Stock,Reserved,Reorder Point,Unit,Cost Price,Selling Price,Status,Supplier'];
    const rows = products.map((p) =>
      `"${p.sku}","${p.name}","${p.category}","${p.warehouse}","${p.binLocation}",${p.stock},${p.reserved},${p.reorderPoint},"${p.unit}",${p.costPrice},${p.sellingPrice},"${p.status}","${p.supplier}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bahi_company_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventory report exported as CSV');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141513] text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
              Stock &amp; Inventory Management
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Company Assets
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink tracking-tight">
            Stock &amp; Inventory
          </h1>
          <p className="text-xs md:text-sm text-ink-muted mt-0.5">
            Manage your company’s physical products, storage rooms, reorder alerts, and supplier receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
            title="Download full CSV report of current stock levels"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMovementModalOpen(true)}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            <span>Record Movement / Transfer</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewProductModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-4 md:p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inventory Asset Value</span>
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-xs">Cost</span>
          </div>
          <div className="text-2xl font-black text-ink font-mono">{formatCurrency(totalInventoryValue)}</div>
          <p className="text-xs text-ink-muted">
            Retail potential: <span className="font-semibold text-ink">{formatCurrency(totalRetailPotential)}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-4 md:p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Units on Hand</span>
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-xs">Stock</span>
          </div>
          <div className="text-2xl font-black text-ink font-mono">{totalUnitsOnHand} <span className="text-xs font-normal text-ink-muted">units</span></div>
          <p className="text-xs text-ink-muted">Across {warehouses.length} storage locations &amp; vans</p>
        </div>

        <div
          onClick={() => setActiveTab('alerts')}
          className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-4 md:p-5 border border-border shadow-2xs space-y-1 cursor-pointer hover:border-amber-400/50 transition-colors"
        >
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Low Stock Reorders</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {lowStockProducts.length} <span className="text-xs font-normal text-ink-muted">items</span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Click to view items needing reorder</p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-4 md:p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Storage Capacity</span>
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-600 text-xs font-bold">Healthy</span>
          </div>
          <div className="text-2xl font-black text-ink font-mono">72.4% <span className="text-xs font-normal text-ink-muted">avg</span></div>
          <p className="text-xs text-ink-muted">Primary warehouse WH-MAIN at 78%</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'catalog'
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <span>Stock Items &amp; Catalog</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-ink">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('warehouses')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'warehouses'
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <span>Rooms &amp; Warehouses</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-ink">
              {warehouses.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('moves')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'moves'
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <span>Movement History &amp; Audits</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-ink">
              {moves.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'alerts'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <span>Low Stock Alerts</span>
            {lowStockProducts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                {lowStockProducts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── TAB 1: PRODUCT CATALOG ────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-[#1C1D1A] p-3.5 rounded-2xl border border-border shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search SKU, name, bin..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                />
                <svg className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="Spare Parts">Spare Parts</option>
                <option value="Consumables">Consumables</option>
                <option value="Tools & Equipment">Tools &amp; Equipment</option>
                <option value="Electronics">Electronics</option>
              </select>

              {/* Warehouse Filter */}
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:outline-hidden"
              >
                <option value="all">All Locations</option>
                {warehouses.map((wh) => (
                  <option key={wh.code} value={wh.code}>
                    {wh.code} - {wh.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:outline-hidden"
              >
                <option value="all">All Stock Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="text-xs text-ink-muted self-end md:self-center">
              Showing <span className="font-bold text-ink">{filteredProducts.length}</span> of {products.length} items
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl border border-border shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted font-bold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">SKU / Code</th>
                    <th className="py-3 px-4">Product &amp; Category</th>
                    <th className="py-3 px-4">Storage Location &amp; Bin</th>
                    <th className="py-3 px-4 text-right">Available / Reserved</th>
                    <th className="py-3 px-4 text-right">Cost / Sell Price</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-ink-muted">
                        No products match your active search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr
                        key={p.sku}
                        onClick={() => setSelectedProduct(p)}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-accent">
                          {p.sku}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-ink">{p.name}</div>
                          <div className="text-[11px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                            <span>{p.category}</span>
                            <span>•</span>
                            <span className="font-mono">{p.unit}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-ink flex items-center gap-1">
                            <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono">
                              {p.warehouse}
                            </span>
                          </div>
                          <div className="text-[11px] text-ink-muted mt-0.5">{p.binLocation}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-black text-ink text-sm font-mono">
                            {p.stock}{' '}
                            <span className="text-[10px] font-normal text-ink-muted">{p.unit}</span>
                          </div>
                          {p.reserved > 0 && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                              {p.reserved} reserved for jobs
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          <div className="font-bold text-ink">{formatCurrency(p.sellingPrice)}</div>
                          <div className="text-[10px] text-ink-muted">Cost: {formatCurrency(p.costPrice)}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              p.status === 'In Stock'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : p.status === 'Low Stock'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.status === 'In Stock'
                                  ? 'bg-emerald-500'
                                  : p.status === 'Low Stock'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(p);
                            }}
                            className="text-xs font-semibold text-accent hover:underline px-2 py-1"
                          >
                            Adjust / View →
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

      {/* ─── TAB 2: WAREHOUSES & STORAGE ROOMS ────────────────────────────── */}
      {activeTab === 'warehouses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                        {wh.code}
                      </span>
                      <h3 className="font-bold text-base text-ink">{wh.name}</h3>
                    </div>
                    <p className="text-xs text-ink-muted mt-1">{wh.location}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
                      Type: {wh.type}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      wh.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {wh.status === 'active' ? 'Operational' : 'Near Full (High Load)'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-border text-center">
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Active SKUs</span>
                    <div className="font-mono font-bold text-sm text-ink">{wh.productsCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Total Units</span>
                    <div className="font-mono font-bold text-sm text-ink">{wh.totalUnits}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Facility Manager</span>
                    <div className="text-xs font-semibold text-ink truncate">{wh.manager}</div>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-muted font-medium">Capacity Utilization</span>
                    <span className="font-mono font-bold text-ink">{wh.utilization}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        wh.utilization > 85 ? 'bg-amber-500' : 'bg-accent'
                      }`}
                      style={{ width: `${wh.utilization}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWarehouse(wh.code);
                      setActiveTab('catalog');
                    }}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <span>View Stored Items</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: STOCK MOVEMENTS LEDGER ─────────────────────────────────── */}
      {activeTab === 'moves' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl border border-border shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-ink">Stock Movement Audit Trail</h3>
                <p className="text-xs text-ink-muted">
                  Immutable operational log of all product receipts, inter-room transfers, and job allocations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(true)}
                className="btn-primary text-xs py-1.5 px-3 self-start sm:self-auto cursor-pointer"
              >
                + New Transfer / Entry
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted font-bold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4">From → To</th>
                    <th className="py-3 px-4">Reason / Authorization</th>
                    <th className="py-3 px-4">Logged By / Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {moves.map((m) => (
                    <tr key={m.ref} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-accent">{m.ref}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.type === 'Receipt'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : m.type === 'Transfer'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                              : m.type === 'Job Usage'
                              ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                              : m.type === 'Adjustment'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-neutral-500/10 text-neutral-600'
                          }`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-ink">
                        <div>{m.productName}</div>
                        <div className="text-[10px] font-mono text-ink-muted">{m.sku}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                        <span className={m.qty > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {m.qty > 0 ? `+${m.qty}` : m.qty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ink">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span>{m.fromLocation}</span>
                          <span className="text-ink-muted">→</span>
                          <span>{m.toLocation}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ink-muted max-w-xs">{m.reason}</td>
                      <td className="py-3 px-4 text-ink-muted">
                        <div className="font-semibold text-ink">{m.operator}</div>
                        <div className="text-[10px]">{m.date}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: LOW STOCK & REORDER ALERTS ──────────────────────────────── */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div>
              <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300">
                Low Stock Warning: {lowStockProducts.length} items require replenishment
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                These materials have fallen at or below their minimum reorder thresholds. Order replenishment shipments from vendors to prevent service job delays.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl border border-border shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted font-bold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Item SKU</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4 text-right">Current Stock</th>
                    <th className="py-3 px-4 text-right">Reorder Point</th>
                    <th className="py-3 px-4 text-right">Suggested Order</th>
                    <th className="py-3 px-4">Preferred Supplier</th>
                    <th className="py-3 px-4 text-right">Est. Cost</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b border-border">
                  {lowStockProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        All items are healthy and above their reorder points. No alerts active.
                      </td>
                    </tr>
                  ) : (
                    lowStockProducts.map((p) => {
                      const suggestedOrder = Math.max(10, p.reorderPoint * 2 - p.stock);
                      const estCost = suggestedOrder * p.costPrice;
                      return (
                        <tr key={p.sku} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                          <td className="py-3.5 px-4 font-mono font-bold text-accent">{p.sku}</td>
                          <td className="py-3.5 px-4 font-bold text-ink">
                            {p.name}
                            <span className="block text-[10px] text-ink-muted font-normal">
                              Located in {p.warehouse} ({p.binLocation})
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                            {p.stock} {p.unit}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-ink-muted">
                            {p.reorderPoint} {p.unit}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                            +{suggestedOrder} {p.unit}
                          </td>
                          <td className="py-3.5 px-4 text-ink-muted font-medium">{p.supplier}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-ink">
                            {formatCurrency(estCost)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setMoveProductSku(p.sku);
                                setMoveType('Receipt');
                                setMoveQty(suggestedOrder);
                                setMoveFrom(p.supplier);
                                setMoveTo(p.warehouse);
                                setMoveReason(`Vendor replenishment order for low stock`);
                                setIsMovementModalOpen(true);
                              }}
                              className="btn-primary text-xs py-1 px-2.5 cursor-pointer"
                            >
                              Receive Order
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

      {/* ─── MODAL 1: ADD NEW PRODUCT ──────────────────────────────────────── */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-ink">Add New Product / Stock Item</h3>
                <p className="text-xs text-ink-muted">Register a new physical product in your company inventory catalog.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProductModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink mb-1">Product SKU / Barcode</label>
                  <input
                    type="text"
                    placeholder="e.g. PRD-8801 (Auto if blank)"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Product Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                  >
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Consumables">Consumables</option>
                    <option value="Tools & Equipment">Tools &amp; Equipment</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Product Name &amp; Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper Pipe Fitting 3/4-inch"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink mb-1">Primary Warehouse</label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                  >
                    {warehouses.map((wh) => (
                      <option key={wh.code} value={wh.code}>
                        {wh.code} ({wh.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Bin / Shelf Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Aisle 2, Bin C-04"
                    value={newBin}
                    onChange={(e) => setNewBin(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Unit Type</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                  >
                    <option value="pcs">pcs</option>
                    <option value="units">units</option>
                    <option value="boxes">boxes</option>
                    <option value="cylinders">cylinders</option>
                    <option value="kits">kits</option>
                    <option value="cans">cans</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Reorder Point</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newReorder}
                    onChange={(e) => setNewReorder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink mb-1">Cost Price (What you buy it for)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Selling Price (What you charge clients)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newSellingPrice}
                    onChange={(e) => setNewSellingPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Primary Supplier / Vendor</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Fluid Supplies Co."
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs font-semibold"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: RECORD MOVEMENT / TRANSFER ─────────────────────────── */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-ink">Record Stock Movement / Transfer</h3>
                <p className="text-xs text-ink-muted">Log supplier receipt, van transfer, job deduction, or scrap adjustment.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordMovement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Movement Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Receipt', 'Transfer', 'Job Usage', 'Adjustment'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMoveType(t)}
                      className={`py-2 px-2 rounded-lg font-bold text-center border transition-all cursor-pointer ${
                        moveType === t
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border text-ink-muted hover:text-ink'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Select Product *</label>
                <select
                  value={moveProductSku}
                  onChange={(e) => setMoveProductSku(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-medium"
                >
                  {products.map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.sku} - {p.name} (Current: {p.stock} {p.unit} in {p.warehouse})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {moveType === 'Adjustment' ? 'Quantity (+/-)' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    required
                    value={moveQty}
                    onChange={(e) => setMoveQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Source Location</label>
                  <input
                    type="text"
                    value={moveFrom}
                    onChange={(e) => setMoveFrom(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
              </div>

              {moveType === 'Transfer' && (
                <div>
                  <label className="block font-bold text-ink mb-1">Destination Location / Room / Van</label>
                  <input
                    type="text"
                    value={moveTo}
                    onChange={(e) => setMoveTo(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-ink mb-1">Reason / Notes / PO Reference</label>
                <input
                  type="text"
                  placeholder="e.g. PO-9481 or Reallocating to Van 1 for tomorrow's job"
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-accent focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs font-semibold"
                >
                  Commit Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DRAWER / MODAL 3: PRODUCT DETAILS & QUICK ADJUST ──────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border-l border-border h-full max-w-md w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">
                    {selectedProduct.sku}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedProduct.status === 'In Stock'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : selectedProduct.status === 'Low Stock'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-ink-muted hover:text-ink cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <h2 className="text-xl font-black text-ink">{selectedProduct.name}</h2>
                <p className="text-xs text-ink-muted mt-1">{selectedProduct.category} • Supplier: {selectedProduct.supplier}</p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase">On Hand Stock</span>
                  <div className="text-xl font-black text-ink font-mono">
                    {selectedProduct.stock} <span className="text-xs font-normal text-ink-muted">{selectedProduct.unit}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase">Reorder Point</span>
                  <div className="text-xl font-black text-ink font-mono">
                    {selectedProduct.reorderPoint} <span className="text-xs font-normal text-ink-muted">{selectedProduct.unit}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase">Unit Cost</span>
                  <div className="text-sm font-bold text-ink font-mono">{formatCurrency(selectedProduct.costPrice)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase">Selling Price</span>
                  <div className="text-sm font-bold text-ink font-mono">{formatCurrency(selectedProduct.sellingPrice)}</div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-ink uppercase tracking-wider text-[10px]">Location Breakdown</h4>
                <div className="p-3 rounded-lg border border-border bg-white dark:bg-[#1A1B18] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Warehouse / Depot</span>
                    <span className="font-semibold text-ink font-mono">{selectedProduct.warehouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Bin / Shelf Coordinate</span>
                    <span className="font-medium text-ink">{selectedProduct.binLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Last Restocked</span>
                    <span className="font-mono text-ink">{selectedProduct.lastRestocked}</span>
                  </div>
                </div>
              </div>

              {/* Quick Adjustment Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="font-bold text-ink uppercase tracking-wider text-[10px]">Quick Physical Count Adjustment</h4>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-ink-muted mb-1">Adjust Quantity (+ to add, - to deduct)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuickAdjustAmount(quickAdjustAmount - 1)}
                        className="btn-secondary py-1.5 px-3 font-mono font-bold"
                      >
                        -1
                      </button>
                      <input
                        type="number"
                        value={quickAdjustAmount}
                        onChange={(e) => setQuickAdjustAmount(Number(e.target.value))}
                        className="flex-1 p-2 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink text-center font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setQuickAdjustAmount(quickAdjustAmount + 1)}
                        className="btn-secondary py-1.5 px-3 font-mono font-bold"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-ink-muted mb-1">Audit / Correction Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. Cycle count discrepancy or damaged unit"
                      value={quickAdjustReason}
                      onChange={(e) => setQuickAdjustReason(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={quickAdjustAmount === 0}
                    onClick={handleQuickAdjustStock}
                    className="w-full btn-primary py-2 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Apply Stock Adjustment ({quickAdjustAmount > 0 ? `+${quickAdjustAmount}` : quickAdjustAmount})
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
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
