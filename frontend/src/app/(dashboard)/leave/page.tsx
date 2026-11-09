'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Plus,
  Clock,
  Download,
  Sun,
  Palmtree,
  CalendarCheck,
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'Annual Vacation' | 'Sick Leave' | 'Personal' | 'Parental' | 'Bereavement';
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  notes: string;
  coveragePerson: string;
}

interface EmployeeBalance {
  employeeId: string;
  name: string;
  department: string;
  annualQuota: number;
  usedVacation: number;
  sickUsed: number;
  remaining: number;
}

const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-301',
    employeeId: 'EMP-005',
    employeeName: 'Sarah Chen',
    department: 'Finance',
    type: 'Annual Vacation',
    startDate: '2026-10-23',
    endDate: '2026-10-27',
    days: 4,
    status: 'Approved',
    notes: 'Family trip to Yosemite National Park. Financial reconciliation covered by Yash.',
    coveragePerson: 'Yash Rawat',
  },
  {
    id: 'LV-302',
    employeeId: 'EMP-003',
    employeeName: 'Maya Lin',
    department: 'Revenue Ops',
    type: 'Personal',
    startDate: '2026-11-04',
    endDate: '2026-11-05',
    days: 2,
    status: 'Pending',
    notes: 'Home moving and utility installation.',
    coveragePerson: 'Marcus Vance',
  },
  {
    id: 'LV-303',
    employeeId: 'EMP-004',
    employeeName: 'Devon Vance',
    department: 'Supply Chain',
    type: 'Sick Leave',
    startDate: '2026-10-14',
    endDate: '2026-10-15',
    days: 1,
    status: 'Approved',
    notes: 'Dental procedure recovery.',
    coveragePerson: 'Carlos Mendez',
  },
  {
    id: 'LV-304',
    employeeId: 'EMP-002',
    employeeName: 'Carlos Mendez',
    department: 'Field Services',
    type: 'Annual Vacation',
    startDate: '2026-11-20',
    endDate: '2026-11-25',
    days: 4,
    status: 'Approved',
    notes: 'Thanksgiving week family gathering.',
    coveragePerson: 'Liam O\'Connor',
  },
  {
    id: 'LV-305',
    employeeId: 'EMP-006',
    employeeName: 'Elena Rostova',
    department: 'Engineering',
    type: 'Annual Vacation',
    startDate: '2026-12-22',
    endDate: '2026-12-29',
    days: 5,
    status: 'Pending',
    notes: 'Year-end holiday break.',
    coveragePerson: 'Yash Rawat',
  },
];

const INITIAL_BALANCES: EmployeeBalance[] = [
  { employeeId: 'EMP-001', name: 'Yash Rawat', department: 'Leadership', annualQuota: 25, usedVacation: 3, sickUsed: 0, remaining: 22 },
  { employeeId: 'EMP-002', name: 'Carlos Mendez', department: 'Field Services', annualQuota: 20, usedVacation: 8, sickUsed: 2, remaining: 12 },
  { employeeId: 'EMP-003', name: 'Maya Lin', department: 'Revenue Ops', annualQuota: 20, usedVacation: 5, sickUsed: 1, remaining: 15 },
  { employeeId: 'EMP-004', name: 'Devon Vance', department: 'Supply Chain', annualQuota: 20, usedVacation: 4, sickUsed: 2, remaining: 16 },
  { employeeId: 'EMP-005', name: 'Sarah Chen', department: 'Finance', annualQuota: 22, usedVacation: 6, sickUsed: 1, remaining: 16 },
  { employeeId: 'EMP-006', name: 'Elena Rostova', department: 'Engineering', annualQuota: 22, usedVacation: 2, sickUsed: 0, remaining: 20 },
  { employeeId: 'EMP-007', name: 'Marcus Vance', department: 'Revenue Ops', annualQuota: 18, usedVacation: 0, sickUsed: 0, remaining: 18 },
  { employeeId: 'EMP-008', name: 'Liam O\'Connor', department: 'Field Services', annualQuota: 15, usedVacation: 1, sickUsed: 0, remaining: 14 },
];

interface CompanyHoliday {
  name: string;
  date: string;
  dayOfWeek: string;
  daysUntil: number;
}

const PUBLIC_HOLIDAYS: CompanyHoliday[] = [
  { name: 'Thanksgiving Day', date: 'Nov 26, 2026', dayOfWeek: 'Thursday', daysUntil: 23 },
  { name: 'Day After Thanksgiving', date: 'Nov 27, 2026', dayOfWeek: 'Friday', daysUntil: 24 },
  { name: 'Christmas Eve (Half Day)', date: 'Dec 24, 2026', dayOfWeek: 'Thursday', daysUntil: 51 },
  { name: 'Christmas Day', date: 'Dec 25, 2026', dayOfWeek: 'Friday', daysUntil: 52 },
  { name: 'New Year\'s Day', date: 'Jan 01, 2027', dayOfWeek: 'Friday', daysUntil: 59 },
  { name: 'Memorial Day', date: 'May 31, 2027', dayOfWeek: 'Monday', daysUntil: 209 },
];

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [balances, setBalances] = useState<EmployeeBalance[]>(INITIAL_BALANCES);
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'balances' | 'holidays'>('requests');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqEmployee, setReqEmployee] = useState('Carlos Mendez');
  const [reqType, setReqType] = useState<'Annual Vacation' | 'Sick Leave' | 'Personal' | 'Parental' | 'Bereavement'>('Annual Vacation');
  const [reqStartDate, setReqStartDate] = useState('2026-11-12');
  const [reqEndDate, setReqEndDate] = useState('2026-11-13');
  const [reqDays, setReqDays] = useState('2');
  const [reqCoverage, setReqCoverage] = useState('Liam O\'Connor');
  const [reqNotes, setReqNotes] = useState('');

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const matchesSearch =
        l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.notes.toLowerCase().includes(search.toLowerCase()) ||
        l.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || l.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaves, search, statusFilter, typeFilter]);

  // Pending leaves
  const pendingRequests = useMemo(() => {
    return leaves.filter((l) => l.status === 'Pending');
  }, [leaves]);

  // Metrics
  const metrics = useMemo(() => {
    const totalPending = pendingRequests.length;
    const avgRemaining = Math.round(
      balances.reduce((acc, curr) => acc + curr.remaining, 0) / (balances.length || 1)
    );
    const approvedDaysThisMonth = leaves
      .filter((l) => l.status === 'Approved')
      .reduce((acc, curr) => acc + curr.days, 0);

    return { totalPending, avgRemaining, approvedDaysThisMonth };
  }, [pendingRequests, balances, leaves]);

  // Actions
  const handleApprove = (id: string) => {
    const target = leaves.find((l) => l.id === id);
    if (!target) return;

    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l))
    );

    // Deduct from employee balance
    setBalances((prev) =>
      prev.map((b) => {
        if (b.name === target.employeeName) {
          if (target.type === 'Annual Vacation') {
            return {
              ...b,
              usedVacation: b.usedVacation + target.days,
              remaining: Math.max(0, b.remaining - target.days),
            };
          } else if (target.type === 'Sick Leave') {
            return {
              ...b,
              sickUsed: b.sickUsed + target.days,
            };
          }
        }
        return b;
      })
    );
  };

  const handleReject = (id: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l))
    );
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const daysCount = parseInt(reqDays, 10) || 1;
    const newId = `LV-${300 + leaves.length + 1}`;

    const newReq: LeaveRequest = {
      id: newId,
      employeeId: 'EMP-REQ',
      employeeName: reqEmployee,
      department: 'Operations',
      type: reqType,
      startDate: reqStartDate,
      endDate: reqEndDate,
      days: daysCount,
      status: 'Pending',
      notes: reqNotes || 'Submitted through Bahi Leave system.',
      coveragePerson: reqCoverage,
    };

    setLeaves([newReq, ...leaves]);
    setIsRequestModalOpen(false);
    setReqNotes('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Request ID',
      'Employee',
      'Department',
      'Leave Type',
      'Start Date',
      'End Date',
      'Days Count',
      'Status',
      'Coverage Person',
      'Reason / Notes',
    ];

    const rows = filteredLeaves.map((l) => [
      l.id,
      `"${l.employeeName}"`,
      `"${l.department}"`,
      `"${l.type}"`,
      l.startDate,
      l.endDate,
      l.days,
      l.status,
      `"${l.coveragePerson}"`,
      `"${l.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_leave_requests_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30 font-mono">
              Leave
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Leave
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Approve employee time off, view team absence schedules, and track annual PTO allowances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-400" />
            Export CSV
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Request Time Off
          </button>
          <Link
            href="/applications"
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            ← All Apps
          </Link>
        </div>
      </div>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Out of Office Today
            </span>
            <Palmtree className="w-4 h-4 text-[#F43F5E]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            1 Staff Member
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Sarah Chen (Yosemite PTO)
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Pending Approvals
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.totalPending} Requests
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Awaiting manager sign-off
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Avg Days Remaining
            </span>
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.avgRemaining} Days
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Healthy PTO buffer per employee
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Next Paid Holiday
            </span>
            <Sun className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            Nov 26
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Thanksgiving Day (in 23 days)
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Leave Requests ({leaves.length})
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-[#3E7FBF]/15 text-[#3E7FBF] border border-[#3E7FBF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Palmtree className="w-4 h-4" />
          Team Absence Calendar
        </button>

        <button
          onClick={() => setActiveTab('balances')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'balances'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          PTO Allowances &amp; Balances
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'holidays'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Sun className="w-4 h-4" />
          Company Holidays (2026–2027)
        </button>
      </div>

      {/* ─── TAB 1: REQUESTS ─── */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, reason, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#F43F5E]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter leave requests by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                aria-label="Filter leave requests by type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Leave Types</option>
                <option value="Annual Vacation">Annual Vacation</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal">Personal</option>
                <option value="Parental">Parental</option>
                <option value="Bereavement">Bereavement</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration Range</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Work Coverage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      No leave requests match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((l) => (
                    <tr
                      key={l.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F43F5E]">{l.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink dark:text-white">{l.employeeName}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">{l.department}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-ink dark:text-neutral-200">
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-ink-muted dark:text-neutral-400 text-[11px]">
                        {l.startDate} → {l.endDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-ink dark:text-white">
                        {l.days} {l.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300">
                        {l.coveragePerson}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : l.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {l.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(l.id)}
                              title="Approve Request"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(l.id)}
                              title="Decline Request"
                              className="px-2 py-1 rounded-lg border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-ink-muted">Recorded</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 2: TEAM CALENDAR ─── */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-6 border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">
              Upcoming Team Absences &amp; Coverage View
            </h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Identifies overlapping staff vacations to guarantee customer service coverage.
            </p>
          </div>

          <div className="space-y-3">
            {leaves
              .filter((l) => l.status === 'Approved' || l.status === 'Pending')
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5]/40 dark:bg-[#141513]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F43F5E]/15 text-[#F43F5E] flex items-center justify-center font-bold text-sm">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink dark:text-white">
                          {item.employeeName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-ink-muted dark:text-neutral-300">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
                        {item.startDate} to {item.endDate} ({item.days} working days) • Coverage: <span className="font-medium text-ink dark:text-neutral-200">{item.coveragePerson}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                      item.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: BALANCES ─── */}
      {activeTab === 'balances' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <h3 className="text-sm font-bold text-ink dark:text-white">Employee PTO Quotas &amp; Remaining Days</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Annual paid time off accruals and usage for calendar year 2026.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Annual Allowance</th>
                  <th className="py-3 px-4 text-center">PTO Taken</th>
                  <th className="py-3 px-4 text-center">Sick Days</th>
                  <th className="py-3 px-4 text-right">Days Left</th>
                  <th className="py-3 px-4">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {balances.map((b) => {
                  const usedPct = Math.round((b.usedVacation / b.annualQuota) * 100);
                  return (
                    <tr key={b.employeeId} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3.5 px-4 font-bold text-ink dark:text-white">{b.name}</td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{b.department}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-ink-muted">
                        {b.annualQuota} days
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-ink dark:text-white">
                        {b.usedVacation} days
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-ink-muted">
                        {b.sickUsed} days
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {b.remaining} days
                      </td>
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#F43F5E]"
                            style={{ width: `${usedPct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 4: COMPANY HOLIDAYS ─── */}
      {activeTab === 'holidays' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PUBLIC_HOLIDAYS.map((h) => (
            <div
              key={h.name}
              className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-ink dark:text-white">{h.name}</h4>
                  <p className="text-xs text-ink-muted dark:text-neutral-400">{h.dayOfWeek}</p>
                </div>
                <Sun className="w-4 h-4 text-amber-500" />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] font-mono text-xs font-bold text-ink dark:text-white">
                {h.date}
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted pt-1">
                <span>Countdown:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  in {h.daysUntil} days
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL: REQUEST TIME OFF ─── */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Request Time Off
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Submit dates for supervisor sign-off and balance deduction.
                </p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Employee Submitter
                  </label>
                  <select
                    value={reqEmployee}
                    onChange={(e) => setReqEmployee(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#F43F5E]"
                  >
                    <option value="Carlos Mendez">Carlos Mendez</option>
                    <option value="Maya Lin">Maya Lin</option>
                    <option value="Devon Vance">Devon Vance</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Liam O'Connor">Liam O&apos;Connor</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Leave Type
                  </label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#F43F5E]"
                  >
                    <option value="Annual Vacation">Annual Vacation (PTO)</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal">Personal Leave</option>
                    <option value="Parental">Parental Leave</option>
                    <option value="Bereavement">Bereavement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reqStartDate}
                    onChange={(e) => setReqStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#F43F5E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reqEndDate}
                    onChange={(e) => setReqEndDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#F43F5E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Work Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={reqDays}
                    onChange={(e) => setReqDays(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#F43F5E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Designated Work Coverage Colleague
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam O'Connor, Yash Rawat..."
                  value={reqCoverage}
                  onChange={(e) => setReqCoverage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#F43F5E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Notes / Handover Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Details regarding handoff and urgent contact instructions..."
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#F43F5E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#F43F5E] hover:bg-[#E11D48] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
