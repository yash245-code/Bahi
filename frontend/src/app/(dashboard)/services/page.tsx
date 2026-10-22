'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WorkOrder {
  id: string;
  client: string;
  address: string;
  serviceType: string;
  technician: { name: string; avatar: string; phone: string };
  scheduledTime: string;
  priority: 'Urgent' | 'High' | 'Standard';
  status: 'Scheduled' | 'En Route' | 'In Progress' | 'Completed';
  amount: number;
}

const initialWorkOrders: WorkOrder[] = [
  {
    id: 'WO-4091',
    client: 'Highland Residency Club',
    address: '420 Park Ave, Suite 12B',
    serviceType: 'HVAC Seasonal Inspection & Filter Replacement',
    technician: { name: 'Carlos Mendez', avatar: 'CM', phone: '+1 (555) 329-8471' },
    scheduledTime: 'Today, 2:00 PM',
    priority: 'High',
    status: 'In Progress',
    amount: 450,
  },
  {
    id: 'WO-4092',
    client: 'Apex Logistics Hub',
    address: '88 Industrial Blvd, Dock 4',
    serviceType: 'Forklift Hydraulic Valve Calibration',
    technician: { name: 'Devon Vance', avatar: 'DV', phone: '+1 (555) 819-2041' },
    scheduledTime: 'Today, 3:30 PM',
    priority: 'Urgent',
    status: 'En Route',
    amount: 1200,
  },
  {
    id: 'WO-4093',
    client: 'Green Garden Cafe',
    address: '14 Elm Street, Downtown',
    serviceType: 'Commercial Espresso Boiler Descaling',
    technician: { name: 'Maya Lin', avatar: 'ML', phone: '+1 (555) 441-9082' },
    scheduledTime: 'Today, 5:00 PM',
    priority: 'Standard',
    status: 'Scheduled',
    amount: 320,
  },
  {
    id: 'WO-4089',
    client: 'Summit Medical Clinic',
    address: '100 Medical Center Way',
    serviceType: 'Backup Generator Annual Load Test',
    technician: { name: 'Carlos Mendez', avatar: 'CM', phone: '+1 (555) 329-8471' },
    scheduledTime: 'Today, 9:30 AM',
    priority: 'High',
    status: 'Completed',
    amount: 1850,
  },
  {
    id: 'WO-4088',
    client: 'Nordic Warehouses',
    address: '25 Harbor Road, Pier 7',
    serviceType: 'Refrigerated Cold-Room Temp Sensor Sync',
    technician: { name: 'Maya Lin', avatar: 'ML', phone: '+1 (555) 441-9082' },
    scheduledTime: 'Yesterday',
    priority: 'Standard',
    status: 'Completed',
    amount: 680,
  },
];

export default function ServicesPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [newService, setNewService] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPriority, setNewPriority] = useState<'Standard' | 'High' | 'Urgent'>('Standard');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newService) return;

    const newOrder: WorkOrder = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      client: newClient,
      address: newAddress || 'Main Commercial Site',
      serviceType: newService,
      technician: { name: 'Carlos Mendez', avatar: 'CM', phone: '+1 (555) 329-8471' },
      scheduledTime: 'Today, Pending Dispatch',
      priority: newPriority,
      status: 'Scheduled',
      amount: 400,
    };

    setOrders([newOrder, ...orders]);
    setNewModalOpen(false);
    setNewClient('');
    setNewService('');
    setNewAddress('');
    showToast(`Work order ${newOrder.id} dispatched successfully`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141513] text-white px-4 py-2.5 rounded-xl shadow-xl border border-neutral-700 flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-mono">
              Field Services &amp; Dispatch
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded">
              v1.0.0
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
            Field Operations &amp; Job Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Real-time technician scheduling, on-site work orders, GPS dispatch, and client maintenance contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/applications"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <span>← Apps Suite</span>
          </Link>
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] border-[#14B8A6]/40 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>+ Dispatch Work Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Active Work Orders</span>
          <div className="text-2xl font-black text-ink font-mono">{orders.length}</div>
          <p className="text-xs text-[#2DD4BF] font-semibold">3 in field right now</p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">First-Time Fix Rate</span>
          <div className="text-2xl font-black text-ink font-mono">94.8%</div>
          <p className="text-xs text-[#1F7A4D] font-semibold">+2.4% vs last month</p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">On-Duty Technicians</span>
          <div className="text-2xl font-black text-ink font-mono">4 Active</div>
          <p className="text-xs text-ink-muted">Avg response time: 28 mins</p>
        </div>

        <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl p-5 border border-border shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Billed Service Revenue</span>
          <div className="text-2xl font-black text-ink font-mono">$4,500.00</div>
          <p className="text-xs text-ink-muted">Direct sync to Invoicing</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1C1D1A] p-4 rounded-2xl border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
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
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search work orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:outline-hidden focus:border-[#2DD4BF]"
          />
          <svg className="w-4 h-4 text-ink-muted absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white dark:bg-[#1C1D1A] rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Order ID &amp; Priority</th>
                <th className="py-3 px-4">Customer &amp; Location</th>
                <th className="py-3 px-4">Service Description</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink-muted">
                    No work orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-ink">
                      <div>{order.id}</div>
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
                      <div className="text-[11px] text-ink-muted">{order.address}</div>
                    </td>
                    <td className="py-3.5 px-4 text-ink max-w-xs">{order.serviceType}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/20 text-[#0F766E] dark:text-[#2DD4BF] flex items-center justify-center font-bold text-[10px]">
                          {order.technician.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-ink">{order.technician.name}</div>
                          <div className="text-[10px] text-ink-muted font-mono">{order.technician.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-ink font-medium">{order.scheduledTime}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : order.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20 animate-pulse'
                            : order.status === 'En Route'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : 'bg-neutral-500/10 text-neutral-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                      ${order.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Work Order Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1F1C] border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-lg text-ink">Dispatch Field Service Order</h3>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">Customer / Client Name</label>
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
                <label className="block font-bold text-ink mb-1">Service Task Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pump Valve Repair and Pressure Testing"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Service Location Address</label>
                <input
                  type="text"
                  placeholder="e.g. 102 West Avenue, Dock 2"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-border bg-neutral-50 dark:bg-neutral-900 text-ink focus:border-[#2DD4BF] focus:outline-hidden"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent (Immediate Dispatch)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs bg-[#0F766E] hover:bg-[#115E59]"
                >
                  Confirm &amp; Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
