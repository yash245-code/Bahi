'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Plus,
  Search,
  Download,
  CheckCircle2,
  Phone,
  MapPin,
  Truck,
  DollarSign,
  ChevronRight,
  X,
  FileText,
  UserCheck,
  Check,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export type JobPriority = 'Standard' | 'High' | 'Urgent';
export type JobStatus = 'Scheduled' | 'En Route' | 'In Progress' | 'Completed' | 'Cancelled';

export interface JobPartItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface WorkOrder {
  id: string;
  client: string;
  contactPerson?: string;
  phone: string;
  address: string;
  category: 'Repair & Troubleshooting' | 'Preventive Maintenance' | 'Installation' | 'Inspection & Audit';
  serviceType: string;
  technicianId: string;
  technician: {
    name: string;
    avatar: string;
    phone: string;
    role: string;
  };
  scheduledDate: string;
  timeSlot: 'Morning (08:00 - 12:00)' | 'Afternoon (12:00 - 16:00)' | 'Evening (16:00 - 20:00)';
  priority: JobPriority;
  status: JobStatus;
  amount: number;
  partsUsed: JobPartItem[];
  technicianNotes?: string;
  completedAt?: string;
  customerSigned?: boolean;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  email: string;
  status: 'Available' | 'On Job' | 'En Route' | 'Off Duty';
  activeJobsCount: number;
  completedJobsCount: number;
  rating: number;
  vehicle: string;
}

export interface ServiceContract {
  id: string;
  customer: string;
  equipment: string;
  frequency: 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Annual';
  slaHours: number; // e.g. 2 hours response
  annualValue: number;
  lastVisit: string;
  nextScheduledVisit: string;
  status: 'Active' | 'Pending Renewal';
}

// ─── Initial Data for Tenant Business ────────────────────────────────────────

const initialTechnicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'Carlos Mendez',
    avatar: 'CM',
    role: 'Lead HVAC & Refrigeration Specialist',
    phone: '+1 (555) 329-8471',
    email: 'carlos.m@company.com',
    status: 'On Job',
    activeJobsCount: 2,
    completedJobsCount: 148,
    rating: 4.9,
    vehicle: 'Van #01 (Ford Transit)',
  },
  {
    id: 'tech-2',
    name: 'Devon Vance',
    avatar: 'DV',
    role: 'Hydraulic Systems & Heavy Machinery Tech',
    phone: '+1 (555) 819-2041',
    email: 'devon.v@company.com',
    status: 'En Route',
    activeJobsCount: 1,
    completedJobsCount: 94,
    rating: 4.8,
    vehicle: 'Van #03 (RAM ProMaster)',
  },
  {
    id: 'tech-3',
    name: 'Maya Lin',
    avatar: 'ML',
    role: 'Commercial Electrical & Motor Controls',
    phone: '+1 (555) 441-9082',
    email: 'maya.l@company.com',
    status: 'Available',
    activeJobsCount: 0,
    completedJobsCount: 122,
    rating: 5.0,
    vehicle: 'Van #02 (Mercedes Sprinter)',
  },
  {
    id: 'tech-4',
    name: 'Samuel O’Connor',
    avatar: 'SO',
    role: 'Piping & Fluid Dynamics Engineer',
    phone: '+1 (555) 602-1193',
    email: 'samuel.o@company.com',
    status: 'Available',
    activeJobsCount: 0,
    completedJobsCount: 78,
    rating: 4.7,
    vehicle: 'Van #04 (Chevy Express)',
  },
];

const initialWorkOrders: WorkOrder[] = [
  {
    id: 'WO-4091',
    client: 'Highland Residency Club',
    contactPerson: 'Arthur Vance (Property Manager)',
    phone: '+1 (555) 231-9022',
    address: '420 Park Ave, Penthouse Mechanical Room',
    category: 'Preventive Maintenance',
    serviceType: 'HVAC Seasonal Inspection & Filter Replacement',
    technicianId: 'tech-1',
    technician: {
      name: 'Carlos Mendez',
      avatar: 'CM',
      phone: '+1 (555) 329-8471',
      role: 'Lead HVAC Specialist',
    },
    scheduledDate: 'Today',
    timeSlot: 'Afternoon (12:00 - 16:00)',
    priority: 'High',
    status: 'In Progress',
    amount: 450,
    partsUsed: [
      { id: 'p1', name: 'Industrial HVAC Filter 24x24x2', sku: 'PRD-001', quantity: 4, unitPrice: 42.0 },
      { id: 'p2', name: 'Refrigerant R410A (5 lbs)', sku: 'PRD-005', quantity: 1, unitPrice: 85.0 },
    ],
    technicianNotes: 'Compressor head pressure verified within normal tolerances. Filter bank replaced.',
  },
  {
    id: 'WO-4092',
    client: 'Apex Logistics Hub',
    contactPerson: 'Sarah Jenkins (Logistics Director)',
    phone: '+1 (555) 782-9400',
    address: '88 Industrial Blvd, Dock 4',
    category: 'Repair & Troubleshooting',
    serviceType: 'Forklift Hydraulic Valve Calibration & Leak Repair',
    technicianId: 'tech-2',
    technician: {
      name: 'Devon Vance',
      avatar: 'DV',
      phone: '+1 (555) 819-2041',
      role: 'Hydraulic Systems Tech',
    },
    scheduledDate: 'Today',
    timeSlot: 'Afternoon (12:00 - 16:00)',
    priority: 'Urgent',
    status: 'En Route',
    amount: 1200,
    partsUsed: [
      { id: 'p3', name: 'Hydraulic Seal Kit (Series 400)', sku: 'PRD-002', quantity: 1, unitPrice: 175.0 },
    ],
    technicianNotes: 'Emergency call: dock forklift pressure dropping under load.',
  },
  {
    id: 'WO-4093',
    client: 'Green Garden Cafe',
    contactPerson: 'Leo Barnes (Store Owner)',
    phone: '+1 (555) 441-3991',
    address: '14 Elm Street, Downtown',
    category: 'Preventive Maintenance',
    serviceType: 'Commercial Espresso Boiler Descaling & Pressure Check',
    technicianId: 'tech-3',
    technician: {
      name: 'Maya Lin',
      avatar: 'ML',
      phone: '+1 (555) 441-9082',
      role: 'Commercial Electrical Tech',
    },
    scheduledDate: 'Today',
    timeSlot: 'Evening (16:00 - 20:00)',
    priority: 'Standard',
    status: 'Scheduled',
    amount: 320,
    partsUsed: [],
    technicianNotes: 'Scheduled after closing hours at 5:00 PM.',
  },
  {
    id: 'WO-4089',
    client: 'Summit Medical Clinic',
    contactPerson: 'Dr. Katherine Wells',
    phone: '+1 (555) 901-2244',
    address: '100 Medical Center Way, Building B',
    category: 'Inspection & Audit',
    serviceType: 'Backup Generator Annual Load Test & Safety Certificate',
    technicianId: 'tech-1',
    technician: {
      name: 'Carlos Mendez',
      avatar: 'CM',
      phone: '+1 (555) 329-8471',
      role: 'Lead HVAC Specialist',
    },
    scheduledDate: 'Today',
    timeSlot: 'Morning (08:00 - 12:00)',
    priority: 'High',
    status: 'Completed',
    amount: 1850,
    partsUsed: [],
    technicianNotes: 'Full 2-hour 100% load test executed. Complies with state healthcare backup power code.',
    completedAt: 'Today, 11:45 AM',
    customerSigned: true,
  },
  {
    id: 'WO-4088',
    client: 'Nordic Warehouses',
    contactPerson: 'Erik Thorsen',
    phone: '+1 (555) 349-1100',
    address: '25 Harbor Road, Pier 7',
    category: 'Repair & Troubleshooting',
    serviceType: 'Refrigerated Cold-Room Temp Sensor & VFD Sync',
    technicianId: 'tech-3',
    technician: {
      name: 'Maya Lin',
      avatar: 'ML',
      phone: '+1 (555) 441-9082',
      role: 'Commercial Electrical Tech',
    },
    scheduledDate: 'Yesterday',
    timeSlot: 'Morning (08:00 - 12:00)',
    priority: 'Standard',
    status: 'Completed',
    amount: 680,
    partsUsed: [
      { id: 'p4', name: 'Digital Sensor Module', sku: 'PRD-006', quantity: 2, unitPrice: 110.0 },
    ],
    technicianNotes: 'Temperature alarms cleared and telemetry synced with dispatch dashboard.',
    completedAt: 'Yesterday, 3:30 PM',
    customerSigned: true,
  },
];

const initialContracts: ServiceContract[] = [
  {
    id: 'SC-801',
    customer: 'Highland Residency Club',
    equipment: '3x Central Rooftop Chillers & Air Handlers',
    frequency: 'Monthly',
    slaHours: 4,
    annualValue: 5400,
    lastVisit: 'Oct 14, 2026',
    nextScheduledVisit: 'Nov 14, 2026',
    status: 'Active',
  },
  {
    id: 'SC-802',
    customer: 'Apex Logistics Hub',
    equipment: 'Hydraulic Freight Elevators & Dock Levelers',
    frequency: 'Quarterly',
    slaHours: 2,
    annualValue: 9600,
    lastVisit: 'Aug 22, 2026',
    nextScheduledVisit: 'Nov 22, 2026',
    status: 'Active',
  },
  {
    id: 'SC-803',
    customer: 'Summit Medical Clinic',
    equipment: 'Emergency Generator & Uninterruptible Power Supply',
    frequency: 'Bi-Annual',
    slaHours: 2,
    annualValue: 7200,
    lastVisit: 'May 10, 2026',
    nextScheduledVisit: 'Nov 10, 2026',
    status: 'Active',
  },
  {
    id: 'SC-804',
    customer: 'Green Garden Cafe Chain',
    equipment: 'Commercial Espresso Machines (3 Branches)',
    frequency: 'Monthly',
    slaHours: 6,
    annualValue: 3840,
    lastVisit: 'Oct 02, 2026',
    nextScheduledVisit: 'Nov 02, 2026',
    status: 'Pending Renewal',
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

export default function ServicesPage() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'schedule' | 'technicians' | 'contracts'>('orders');

  // Core state
  const [orders, setOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [contracts] = useState<ServiceContract[]>(initialContracts);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modals & Drawers
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [techModalOpen, setTechModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form states for New Work Order
  const [newClient, setNewClient] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCategory, setNewCategory] = useState<WorkOrder['category']>('Repair & Troubleshooting');
  const [newService, setNewService] = useState('');
  const [newTechId, setNewTechId] = useState(initialTechnicians[0]?.id || '');
  const [newTimeSlot, setNewTimeSlot] = useState<WorkOrder['timeSlot']>('Afternoon (12:00 - 16:00)');
  const [newPriority, setNewPriority] = useState<JobPriority>('Standard');
  const [newAmount, setNewAmount] = useState<number>(350);

  // Form states for New Technician
  const [newTechName, setNewTechName] = useState('');
  const [newTechRole, setNewTechRole] = useState('');
  const [newTechPhone, setNewTechPhone] = useState('');
  const [newTechEmail, setNewTechEmail] = useState('');
  const [newTechVehicle, setNewTechVehicle] = useState('Service Van');

  // Form states for adding parts inside Work Order Drawer
  const [partName, setPartName] = useState('');
  const [partQty, setPartQty] = useState<number>(1);
  const [partPrice, setPartPrice] = useState<number>(45);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ─── Filtered Data ──────────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = filter === 'all' || o.status.toLowerCase() === filter.toLowerCase();
      const matchesPriority = priorityFilter === 'all' || o.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchesSearch =
        o.client.toLowerCase().includes(search.toLowerCase()) ||
        o.serviceType.toLowerCase().includes(search.toLowerCase()) ||
        o.address.toLowerCase().includes(search.toLowerCase()) ||
        o.technician.name.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesPriority && matchesSearch;
    });
  }, [orders, filter, priorityFilter, search]);

  // ─── KPI Calculations ───────────────────────────────────────────────────────

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const activeJobsCount = useMemo(() => {
    return orders.filter((o) => o.status === 'In Progress' || o.status === 'En Route' || o.status === 'Scheduled').length;
  }, [orders]);

  const availableTechsCount = useMemo(() => {
    return technicians.filter((t) => t.status === 'Available').length;
  }, [technicians]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newService.trim()) return;

    const assignedTech = technicians.find((t) => t.id === newTechId) || technicians[0];
    if (!assignedTech) return;

    const newOrder: WorkOrder = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newClient.trim(),
      contactPerson: newContactPerson.trim() || undefined,
      phone: newPhone.trim() || '+1 (555) 000-0000',
      address: newAddress.trim() || 'Client Commercial Site',
      category: newCategory,
      serviceType: newService.trim(),
      technicianId: assignedTech.id,
      technician: {
        name: assignedTech.name,
        avatar: assignedTech.avatar,
        phone: assignedTech.phone,
        role: assignedTech.role,
      },
      scheduledDate: 'Today',
      timeSlot: newTimeSlot,
      priority: newPriority,
      status: 'Scheduled',
      amount: Number(newAmount),
      partsUsed: [],
    };

    setOrders([newOrder, ...orders]);

    // Update technician's active count
    setTechnicians(
      technicians.map((t) =>
        t.id === assignedTech.id ? { ...t, activeJobsCount: t.activeJobsCount + 1 } : t
      )
    );

    setNewModalOpen(false);
    // Reset form
    setNewClient('');
    setNewContactPerson('');
    setNewPhone('');
    setNewAddress('');
    setNewService('');
    setNewAmount(350);
    showToast(`Work Order ${newOrder.id} dispatched to ${assignedTech.name}`);
  };

  const handleCreateTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName.trim()) return;

    const initials = newTechName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const tech: Technician = {
      id: `tech-${Date.now()}`,
      name: newTechName.trim(),
      avatar: initials || 'TC',
      role: newTechRole.trim() || 'Field Service Technician',
      phone: newTechPhone.trim() || '+1 (555) 000-0000',
      email: newTechEmail.trim() || 'tech@company.com',
      status: 'Available',
      activeJobsCount: 0,
      completedJobsCount: 0,
      rating: 5.0,
      vehicle: newTechVehicle.trim() || 'Service Van',
    };

    setTechnicians([...technicians, tech]);
    setTechModalOpen(false);
    setNewTechName('');
    setNewTechRole('');
    setNewTechPhone('');
    setNewTechEmail('');
    showToast(`Technician ${tech.name} added to field roster`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: JobStatus) => {
    const isCompleted = newStatus === 'Completed';
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          completedAt: isCompleted ? 'Today, Just Now' : o.completedAt,
          customerSigned: isCompleted ? true : o.customerSigned,
        };
      }
      return o;
    });

    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        completedAt: isCompleted ? 'Today, Just Now' : selectedOrder.completedAt,
        customerSigned: isCompleted ? true : selectedOrder.customerSigned,
      });
    }
    showToast(`Work Order ${orderId} marked as ${newStatus}`);
  };

  const handleAddPartToOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !partName.trim()) return;

    const newPart: JobPartItem = {
      id: `p-${Date.now()}`,
      name: partName.trim(),
      sku: `MAT-${Math.floor(100 + Math.random() * 900)}`,
      quantity: Number(partQty),
      unitPrice: Number(partPrice),
    };

    const updatedParts = [...selectedOrder.partsUsed, newPart];
    const addedAmount = newPart.quantity * newPart.unitPrice;
    const updatedTotal = selectedOrder.amount + addedAmount;

    const updatedOrder = {
      ...selectedOrder,
      partsUsed: updatedParts,
      amount: updatedTotal,
    };

    setSelectedOrder(updatedOrder);
    setOrders(orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)));
    setPartName('');
    setPartQty(1);
    setPartPrice(45);
    showToast(`Added ${newPart.name} to Job ${selectedOrder.id}`);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID,Customer,Contact,Phone,Address,Category,Service Description,Technician,Schedule,Priority,Status,Fee'];
    const rows = orders.map((o) =>
      `"${o.id}","${o.client}","${o.contactPerson || ''}","${o.phone}","${o.address}","${o.category}","${o.serviceType}","${o.technician.name}","${o.scheduledDate} - ${o.timeSlot}","${o.priority}","${o.status}",${o.amount}`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bahi_field_service_jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Service jobs log exported as CSV');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in text-ink">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141513] text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-2.5 text-xs font-semibold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 text-[#0F766E] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 font-mono">
              Service Visits &amp; Jobs
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              Field Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Service Visits &amp; Jobs
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Book customer repair visits, assign field technicians, track work orders, and log materials used.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/applications"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <span>← All Apps</span>
          </Link>
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            title="Download full CSV of service appointments"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] border-[#14B8A6]/40 cursor-pointer font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Book New Service Job</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
          </div>
          <div className="text-2xl font-black text-ink font-mono">{activeJobsCount}</div>
          <p className="text-xs text-[#0F766E] dark:text-[#2DD4BF] font-semibold">
            {orders.filter((o) => o.status === 'In Progress').length} currently underway on site
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">First-Visit Fix Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-ink font-mono">94.8%</div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+2.4% vs last month</p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Field Crew</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-ink font-mono">
            {availableTechsCount} / {technicians.length} <span className="text-xs font-normal text-ink-muted">Ready</span>
          </div>
          <p className="text-xs text-ink-muted">Avg response time: 24 mins</p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Service Billing</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-ink font-mono">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-ink-muted">Across {orders.length} total logged work orders</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'orders'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-[#2DD4BF] dark:border-[#2DD4BF]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Work Orders &amp; Jobs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-ink">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'schedule'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-[#2DD4BF] dark:border-[#2DD4BF]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily Dispatch Schedule</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('technicians')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'technicians'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-[#2DD4BF] dark:border-[#2DD4BF]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Technicians &amp; Field Staff</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-ink">
              {technicians.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap px-1 ${
              activeTab === 'contracts'
                ? 'border-[#0F766E] text-[#0F766E] dark:text-[#2DD4BF] dark:border-[#2DD4BF]'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Service Contracts &amp; SLAs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-ink">
              {contracts.length}
            </span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: WORK ORDERS & SERVICE JOBS ──────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-[#1C1D1A] p-3.5 rounded-2xl border border-border shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['all', 'scheduled', 'en route', 'in progress', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    filter === st
                      ? 'bg-[#2DD4BF]/20 text-[#0F766E] dark:text-[#2DD4BF] border border-[#2DD4BF]/30'
                      : 'text-ink-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {st}
                </button>
              ))}

              <span className="text-border px-1">|</span>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:outline-hidden"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="standard">Standard</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search jobs, customers, tech..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:outline-hidden focus:border-[#2DD4BF]"
              />
              <Search className="w-3.5 h-3.5 text-ink-muted absolute left-2.5 top-2" />
            </div>
          </div>

          {/* Orders List Table */}
          <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl border border-border shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted font-bold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Order ID &amp; Priority</th>
                    <th className="py-3 px-4">Customer &amp; Site Address</th>
                    <th className="py-3 px-4">Service Category &amp; Task</th>
                    <th className="py-3 px-4">Assigned Field Tech</th>
                    <th className="py-3 px-4">Schedule Slot</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-ink-muted">
                        No service work orders found matching your active search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-ink">
                          <div className="text-accent">{order.id}</div>
                          <span
                            className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-sans font-bold mt-1 ${
                              order.priority === 'Urgent'
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                : order.priority === 'High'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'bg-neutral-500/10 text-neutral-500'
                            }`}
                          >
                            {order.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-ink">{order.client}</div>
                          <div className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{order.address}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-medium text-ink line-clamp-1">{order.serviceType}</div>
                          <span className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold">
                            {order.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#2DD4BF]/20 text-[#0F766E] dark:text-[#2DD4BF] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                              {order.technician.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-ink">{order.technician.name}</div>
                              <div className="text-[10px] text-ink-muted font-mono">{order.technician.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-ink">
                          <div className="font-semibold">{order.scheduledDate}</div>
                          <div className="text-[10px] text-ink-muted">{order.timeSlot}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              order.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : order.status === 'In Progress'
                                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20 animate-pulse'
                                : order.status === 'En Route'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-neutral-500/10 text-neutral-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.status === 'Completed'
                                  ? 'bg-emerald-500'
                                  : order.status === 'In Progress'
                                  ? 'bg-blue-500'
                                  : order.status === 'En Route'
                                  ? 'bg-amber-500'
                                  : 'bg-neutral-500'
                              }`}
                            />
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-ink text-sm">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline px-2 py-1"
                          >
                            Manage →
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

      {/* ─── TAB 2: DAILY DISPATCH SCHEDULE ─────────────────────────────────── */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
              <div>
                <h3 className="font-bold text-base text-ink">Today’s Field Schedule &amp; Dispatch Board</h3>
                <p className="text-xs text-ink-muted">Chronological itinerary of all client visits and technician routes for Today.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-muted">Slot:</span>
                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-mono font-bold">
                  All Time Windows
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {(['Morning (08:00 - 12:00)', 'Afternoon (12:00 - 16:00)', 'Evening (16:00 - 20:00)'] as const).map(
                (slot) => {
                  const slotOrders = orders.filter((o) => o.timeSlot === slot);
                  return (
                    <div key={slot} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
                        <span>{slot}</span>
                        <span className="text-[10px] text-ink-muted font-normal">
                          ({slotOrders.length} {slotOrders.length === 1 ? 'appointment' : 'appointments'})
                        </span>
                      </div>

                      {slotOrders.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-ink-muted">
                          No visits booked for this window. Technicians open for emergency calls.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {slotOrders.map((o) => (
                            <div
                              key={o.id}
                              onClick={() => setSelectedOrder(o)}
                              className="p-4 rounded-xl border border-border bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-[#2DD4BF]/50 transition-all cursor-pointer space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="font-mono text-xs font-bold text-accent">{o.id}</span>
                                  <h4 className="font-bold text-sm text-ink">{o.client}</h4>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    o.status === 'Completed'
                                      ? 'bg-emerald-500/10 text-emerald-600'
                                      : o.status === 'In Progress'
                                      ? 'bg-blue-500/10 text-blue-600'
                                      : o.status === 'En Route'
                                      ? 'bg-amber-500/10 text-amber-600'
                                      : 'bg-neutral-500/10 text-neutral-600'
                                  }`}
                                >
                                  {o.status}
                                </span>
                              </div>

                              <p className="text-xs text-ink-muted line-clamp-1">{o.serviceType}</p>

                              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
                                <div className="flex items-center gap-1.5 text-ink-muted">
                                  <UserCheck className="w-3.5 h-3.5 text-ink" />
                                  <span className="font-medium text-ink">{o.technician.name}</span>
                                </div>
                                <span className="font-mono font-bold text-ink">{formatCurrency(o.amount)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: FIELD TECHNICIANS & CREW ─────────────────────────────────── */}
      {activeTab === 'technicians' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ink">Field Staff &amp; Technician Roster</h3>
              <p className="text-xs text-ink-muted">
                Track assigned vehicles, contact details, real-time dispatch availability, and historical ratings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTechModalOpen(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Field Technician</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#2DD4BF]/20 text-[#0F766E] dark:text-[#2DD4BF] flex items-center justify-center font-black text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-ink">{t.name}</h4>
                      <p className="text-xs text-ink-muted">{t.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : t.status === 'On Job'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : t.status === 'En Route'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-neutral-500/10 text-neutral-600'
                    }`}
                  >
                    ● {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-border text-center text-xs">
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Active Jobs</span>
                    <div className="font-mono font-bold text-sm text-ink">{t.activeJobsCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Completed</span>
                    <div className="font-mono font-bold text-sm text-ink">{t.completedJobsCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Rating</span>
                    <div className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">★ {t.rating}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-ink-muted">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                    <span className="font-mono">{t.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                    <span>{t.vehicle}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNewTechId(t.id);
                      setNewModalOpen(true);
                    }}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Dispatch to Job</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: SERVICE CONTRACTS & SLAS ─────────────────────────────────── */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl border border-border shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-ink">Recurring Customer Maintenance Agreements</h3>
                <p className="text-xs text-ink-muted">
                  Client equipment maintenance contracts, visit intervals, and guaranteed SLA response windows.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted font-bold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Contract ID</th>
                    <th className="py-3 px-4">Client Customer</th>
                    <th className="py-3 px-4">Covered Equipment / Systems</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4">SLA Response</th>
                    <th className="py-3 px-4 text-right">Annual Value</th>
                    <th className="py-3 px-4">Next Visit Due</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b border-border">
                  {contracts.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-accent">{c.id}</td>
                      <td className="py-3.5 px-4 font-bold text-ink">{c.customer}</td>
                      <td className="py-3.5 px-4 text-ink">{c.equipment}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-medium">
                          {c.frequency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        Within {c.slaHours} Hours
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                        {formatCurrency(c.annualValue)}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-ink">{c.nextScheduledVisit}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {c.status}
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

      {/* ─── MODAL 1: BOOK NEW SERVICE JOB ──────────────────────────────────── */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-ink">Book &amp; Dispatch Field Service Job</h3>
                <p className="text-xs text-ink-muted">Schedule a customer visit and dispatch a technician.</p>
              </div>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Customer / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Supplies"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Customer Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. John Miller (Plant Mgr)"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Customer Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Service Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                  >
                    <option value="Repair & Troubleshooting">Repair &amp; Troubleshooting</option>
                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                    <option value="Installation">Equipment Installation</option>
                    <option value="Inspection & Audit">Inspection &amp; Safety Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Task &amp; Fault Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compressor High Temperature Trip &amp; Vibration Check"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Site Location / Address</label>
                <input
                  type="text"
                  placeholder="e.g. 102 West Avenue, Building B, Dock 2"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Assigned Field Technician</label>
                  <select
                    value={newTechId}
                    onChange={(e) => setNewTechId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden font-medium"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.status} - {t.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                  >
                    <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                    <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                    <option value="Evening (16:00 - 20:00)">Evening (16:00 - 20:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden font-semibold"
                  >
                    <option value="Standard">Standard</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Immediate Dispatch)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Estimated Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#0F766E] hover:bg-[#115E59] font-semibold"
                >
                  Confirm &amp; Dispatch Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD NEW FIELD TECHNICIAN ──────────────────────────────── */}
      {techModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-lg text-ink">Add Field Technician</h3>
                <p className="text-xs text-ink-muted">Add a crew member to your field service dispatch roster.</p>
              </div>
              <button
                type="button"
                onClick={() => setTechModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTechnician} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tyler Martinez"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Trade Specialty / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Master Electrician &amp; PLC Tech"
                  value={newTechRole}
                  onChange={(e) => setNewTechRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newTechPhone}
                    onChange={(e) => setNewTechPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Vehicle / Van Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Van #05"
                    value={newTechVehicle}
                    onChange={(e) => setNewTechVehicle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="technician@company.com"
                  value={newTechEmail}
                  onChange={(e) => setNewTechEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setTechModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#0F766E] hover:bg-[#115E59]"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DRAWER 3: WORK ORDER DETAILS, STATUS PROGRESSION & PARTS ──────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border-l border-border h-full max-w-lg w-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-accent">{selectedOrder.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedOrder.priority === 'Urgent'
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        : selectedOrder.priority === 'High'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-neutral-500/10 text-neutral-500'
                    }`}
                  >
                    {selectedOrder.priority} Priority
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Customer */}
              <div>
                <h2 className="text-xl font-black text-ink">{selectedOrder.client}</h2>
                <p className="text-xs text-ink-muted mt-1">{selectedOrder.serviceType}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-ink-muted">
                  <MapPin className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                  <span>{selectedOrder.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                  <Phone className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                  <span className="font-mono">{selectedOrder.phone}</span>
                  {selectedOrder.contactPerson && <span>({selectedOrder.contactPerson})</span>}
                </div>
              </div>

              {/* Status Progression Controls */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Dispatch Lifecycle Status
                  </span>
                  <span className="font-bold text-xs text-[#0F766E] dark:text-[#2DD4BF]">
                    Current: {selectedOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {(['Scheduled', 'En Route', 'In Progress', 'Completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
                        selectedOrder.status === st
                          ? 'border-[#2DD4BF] bg-[#2DD4BF]/20 text-[#0F766E] dark:text-[#2DD4BF]'
                          : 'border-border text-ink-muted hover:text-ink'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assigned Technician */}
              <div className="p-3.5 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#2DD4BF]/20 text-[#0F766E] dark:text-[#2DD4BF] flex items-center justify-center font-bold text-xs">
                    {selectedOrder.technician.avatar}
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase">Assigned Technician</span>
                    <div className="font-bold text-sm text-ink">{selectedOrder.technician.name}</div>
                    <div className="text-[10px] text-ink-muted">{selectedOrder.technician.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-ink-muted uppercase">Phone</span>
                  <div className="text-xs font-mono font-semibold text-ink">{selectedOrder.technician.phone}</div>
                </div>
              </div>

              {/* Parts & Materials Consumed Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink">
                    Parts &amp; Inventory Consumed
                  </span>
                  <span className="text-xs font-mono text-ink-muted">
                    {selectedOrder.partsUsed.length} {selectedOrder.partsUsed.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {selectedOrder.partsUsed.length === 0 ? (
                  <div className="p-3 rounded-lg border border-dashed border-border text-center text-xs text-ink-muted">
                    No physical parts logged yet for this visit.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedOrder.partsUsed.map((part) => (
                      <div
                        key={part.id}
                        className="p-2.5 rounded-lg border border-border bg-white dark:bg-[#1A1B18] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-ink">{part.name}</div>
                          <span className="text-[10px] font-mono text-ink-muted">SKU: {part.sku}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-ink">
                            {formatCurrency(part.unitPrice * part.quantity)}
                          </div>
                          <span className="text-[10px] text-ink-muted font-mono">
                            {part.quantity} × {formatCurrency(part.unitPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Part Form */}
                <form onSubmit={handleAddPartToOrder} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-border space-y-2 text-xs">
                  <span className="font-bold text-ink text-[11px] block">Log Part Used From Van / Storage</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-3 sm:col-span-1">
                      <input
                        type="text"
                        required
                        placeholder="Part name..."
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        className="w-full p-1.5 rounded-lg border border-border bg-white dark:bg-neutral-900 text-ink text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={partQty}
                        onChange={(e) => setPartQty(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg border border-border bg-white dark:bg-neutral-900 text-ink font-mono text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={partPrice}
                        onChange={(e) => setPartPrice(Number(e.target.value))}
                        className="w-full p-1.5 rounded-lg border border-border bg-white dark:bg-neutral-900 text-ink font-mono text-xs"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-secondary py-1 px-3 text-xs w-full cursor-pointer font-semibold"
                  >
                    + Add Part to Job Invoice
                  </button>
                </form>
              </div>

              {/* Resolution Notes */}
              {selectedOrder.technicianNotes && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Technician Service Notes</span>
                  </span>
                  <div className="p-3 rounded-lg border border-border bg-neutral-50/50 dark:bg-neutral-900/40 text-xs text-ink">
                    {selectedOrder.technicianNotes}
                  </div>
                </div>
              )}

              {/* Total Job Billing Summary */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase">Total Billable Fee</span>
                  <div className="text-xl font-black text-ink font-mono">{formatCurrency(selectedOrder.amount)}</div>
                </div>
                {selectedOrder.customerSigned ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Customer Signed Off</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Sign-off Pending</span>
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
              {selectedOrder.status !== 'Completed' ? (
                <button
                  type="button"
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Completed')}
                  className="btn-primary py-2 px-4 text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Job Completed</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Finished &amp; Invoiced
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn-secondary py-2 px-4 text-xs"
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
