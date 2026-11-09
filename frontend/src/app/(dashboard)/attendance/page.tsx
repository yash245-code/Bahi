'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  Search,
  Plus,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  Download,
  Calendar,
  AlertCircle,
  Timer,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string | null;
  breakMinutes: number;
  regularHours: number;
  overtimeHours: number;
  status: 'On Time' | 'Late' | 'Overtime' | 'In Progress';
  overtimeApproved: boolean;
  notes: string;
}

const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: 'ATT-101',
    employeeId: 'EMP-002',
    employeeName: 'Carlos Mendez',
    department: 'Field Services',
    date: '2026-11-03',
    shift: 'Morning Field Crew (08:00 - 16:30)',
    clockIn: '07:54 AM',
    clockOut: '05:00 PM',
    breakMinutes: 45,
    regularHours: 8.0,
    overtimeHours: 0.5,
    status: 'Overtime',
    overtimeApproved: true,
    notes: 'Extended shift to finish emergency condenser repair at medical clinic.',
  },
  {
    id: 'ATT-102',
    employeeId: 'EMP-004',
    employeeName: 'Devon Vance',
    department: 'Supply Chain',
    date: '2026-11-03',
    shift: 'Warehouse Dock Shift (07:30 - 16:00)',
    clockIn: '07:28 AM',
    clockOut: '04:30 PM',
    breakMinutes: 30,
    regularHours: 8.0,
    overtimeHours: 0.5,
    status: 'Overtime',
    overtimeApproved: false,
    notes: 'Received late inbound freight shipment of HVAC copper valves from freight dock.',
  },
  {
    id: 'ATT-103',
    employeeId: 'EMP-003',
    employeeName: 'Maya Lin',
    department: 'Revenue Ops',
    date: '2026-11-03',
    shift: 'Client Operations (09:00 - 17:30)',
    clockIn: '09:14 AM',
    clockOut: '05:30 PM',
    breakMinutes: 60,
    regularHours: 7.75,
    overtimeHours: 0,
    status: 'Late',
    overtimeApproved: true,
    notes: '14 min delay due to subway signal disruption.',
  },
  {
    id: 'ATT-104',
    employeeId: 'EMP-001',
    employeeName: 'Yash Rawat',
    department: 'Leadership',
    date: '2026-11-03',
    shift: 'Executive Core (08:30 - 17:00)',
    clockIn: '08:25 AM',
    clockOut: null,
    breakMinutes: 30,
    regularHours: 8.0,
    overtimeHours: 0,
    status: 'In Progress',
    overtimeApproved: true,
    notes: 'Active leadership strategic sync.',
  },
  {
    id: 'ATT-105',
    employeeId: 'EMP-006',
    employeeName: 'Elena Rostova',
    department: 'Engineering',
    date: '2026-11-03',
    shift: 'Engineering Remote (09:00 - 17:30)',
    clockIn: '08:58 AM',
    clockOut: null,
    breakMinutes: 45,
    regularHours: 8.0,
    overtimeHours: 0,
    status: 'In Progress',
    overtimeApproved: true,
    notes: 'Remote cloud deployment shift.',
  },
  {
    id: 'ATT-106',
    employeeId: 'EMP-008',
    employeeName: 'Liam O\'Connor',
    department: 'Field Services',
    date: '2026-11-03',
    shift: 'Morning Field Crew (08:00 - 16:30)',
    clockIn: '07:58 AM',
    clockOut: '04:30 PM',
    breakMinutes: 30,
    regularHours: 8.0,
    overtimeHours: 0,
    status: 'On Time',
    overtimeApproved: true,
    notes: 'Routine service maintenance route completed on schedule.',
  },
];

interface ShiftSchedule {
  name: string;
  hours: string;
  department: string;
  staffCount: number;
}

const SCHEDULES: ShiftSchedule[] = [
  { name: 'Morning Field Crew', hours: '08:00 AM – 04:30 PM', department: 'Field Services', staffCount: 2 },
  { name: 'Warehouse Dock Shift', hours: '07:30 AM – 04:00 PM', department: 'Supply Chain', staffCount: 1 },
  { name: 'Client Operations', hours: '09:00 AM – 05:30 PM', department: 'Revenue Ops', staffCount: 1 },
  { name: 'Executive Core', hours: '08:30 AM – 05:00 PM', department: 'Leadership', staffCount: 1 },
  { name: 'Engineering Remote', hours: '09:00 AM – 05:30 PM', department: 'Engineering', staffCount: 1 },
];

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [activeTab, setActiveTab] = useState<'timesheets' | 'clockstation' | 'schedules' | 'overtime'>('timesheets');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Clock Station Interactive State
  const [selectedStaff, setSelectedStaff] = useState('Carlos Mendez');
  const [clockActionNotice, setClockActionNotice] = useState<string | null>(null);

  // Manual Entry Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualEmployee, setManualEmployee] = useState('Carlos Mendez');
  const [manualDate, setManualDate] = useState('2026-11-03');
  const [manualShift, setManualShift] = useState('Morning Field Crew (08:00 - 16:30)');
  const [manualClockIn, setManualClockIn] = useState('08:00 AM');
  const [manualClockOut, setManualClockOut] = useState('04:30 PM');
  const [manualBreak, setManualBreak] = useState('30');
  const [manualNotes, setManualNotes] = useState('');

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        r.shift.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.notes.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchesDept = departmentFilter === 'ALL' || r.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [records, search, statusFilter, departmentFilter]);

  // Overtime pending records
  const pendingOvertimeRecords = useMemo(() => {
    return records.filter((r) => r.overtimeHours > 0 && !r.overtimeApproved);
  }, [records]);

  // Metrics
  const metrics = useMemo(() => {
    const totalHoursLogged = records.reduce((acc, curr) => acc + curr.regularHours + curr.overtimeHours, 0);
    const inProgressCount = records.filter((r) => r.status === 'In Progress').length;
    const onTimeCount = records.filter((r) => r.status === 'On Time' || (r.status === 'Overtime' && !r.notes.includes('delay'))).length;
    const onTimeRate = records.length > 0 ? Math.round((onTimeCount / records.length) * 100) : 100;
    const totalOvertime = records.reduce((acc, curr) => acc + curr.overtimeHours, 0);

    return { totalHoursLogged, inProgressCount, onTimeRate, totalOvertime };
  }, [records]);

  // Actions
  const handleApproveOvertime = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, overtimeApproved: true } : r))
    );
  };

  const handleSimulateClock = (action: 'IN' | 'BREAK' | 'OUT') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (action === 'IN') {
      const existing = records.find((r) => r.employeeName === selectedStaff && r.status === 'In Progress');
      if (existing) {
        setClockActionNotice(`${selectedStaff} is already clocked in since ${existing.clockIn}!`);
        return;
      }

      const newId = `ATT-${100 + records.length + 1}`;
      const newRec: AttendanceRecord = {
        id: newId,
        employeeId: 'EMP-TEMP',
        employeeName: selectedStaff,
        department: 'Operations',
        date: now.toISOString().slice(0, 10),
        shift: 'Current Live Station Shift',
        clockIn: timeString,
        clockOut: null,
        breakMinutes: 0,
        regularHours: 8.0,
        overtimeHours: 0,
        status: 'In Progress',
        overtimeApproved: true,
        notes: 'Punched in from Digital Clock Station.',
      };

      setRecords([newRec, ...records]);
      setClockActionNotice(`✓ Clock-In verified for ${selectedStaff} at ${timeString}.`);
    } else if (action === 'BREAK') {
      setClockActionNotice(`☕ Break timer started for ${selectedStaff} at ${timeString}.`);
    } else if (action === 'OUT') {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.employeeName === selectedStaff && r.status === 'In Progress') {
            return {
              ...r,
              clockOut: timeString,
              status: 'On Time',
              notes: `${r.notes} • Shift completed at ${timeString}.`,
            };
          }
          return r;
        })
      );
      setClockActionNotice(`✓ Shift ended & clocked out for ${selectedStaff} at ${timeString}.`);
    }

    setTimeout(() => {
      setClockActionNotice(null);
    }, 4000);
  };

  const handleCreateManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ATT-${100 + records.length + 1}`;

    const newRec: AttendanceRecord = {
      id: newId,
      employeeId: 'EMP-MAN',
      employeeName: manualEmployee,
      department: 'Field Operations',
      date: manualDate,
      shift: manualShift,
      clockIn: manualClockIn,
      clockOut: manualClockOut,
      breakMinutes: parseInt(manualBreak, 10) || 30,
      regularHours: 8.0,
      overtimeHours: 0,
      status: 'On Time',
      overtimeApproved: true,
      notes: manualNotes || 'Manual timesheet correction submitted by manager.',
    };

    setRecords([newRec, ...records]);
    setIsManualModalOpen(false);
    setManualNotes('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Employee',
      'Department',
      'Date',
      'Assigned Shift',
      'Clock In',
      'Clock Out',
      'Break (Min)',
      'Regular Hours',
      'Overtime Hours',
      'Status',
      'Overtime Approved',
      'Notes',
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.date,
      `"${r.shift}"`,
      r.clockIn,
      r.clockOut || 'Active In Progress',
      r.breakMinutes,
      r.regularHours.toFixed(2),
      r.overtimeHours.toFixed(2),
      r.status,
      r.overtimeApproved ? 'Yes' : 'No',
      `"${r.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_attendance_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30 font-mono">
              Attendance
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Attendance
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Monitor daily shifts, punch clocks, meal breaks, and authorize employee overtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-400" />
            Export Timesheet
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Manual Entry
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
              Hours Logged Today
            </span>
            <Clock className="w-4 h-4 text-[#EC4899]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.totalHoursLogged.toFixed(1)} hrs
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Across {records.length} shifts
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Clocked In Right Now
            </span>
            <Timer className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.inProgressCount} Active
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Currently on duty
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              On-Time Punctuality
            </span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.onTimeRate}%
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Within 5 min grace threshold
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Overtime Hours
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.totalOvertime.toFixed(1)} hrs
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            {pendingOvertimeRecords.length} awaiting supervisor sign-off
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('timesheets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'timesheets'
              ? 'bg-[#EC4899]/15 text-[#EC4899] border border-[#EC4899]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Timesheets ({records.length})
        </button>

        <button
          onClick={() => setActiveTab('clockstation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'clockstation'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Timer className="w-4 h-4" />
          Punch Clock Station
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'schedules'
              ? 'bg-[#3E7FBF]/15 text-[#3E7FBF] border border-[#3E7FBF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Shift Schedules
        </button>

        <button
          onClick={() => setActiveTab('overtime')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'overtime'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Overtime Approvals
          {pendingOvertimeRecords.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
              {pendingOvertimeRecords.length}
            </span>
          )}
        </button>
      </div>

      {/* ─── TAB 1: TIMESHEETS ─── */}
      {activeTab === 'timesheets' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff, shift, notes, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#EC4899]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter timesheets by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="On Time">On Time</option>
                <option value="Late">Late Arrival</option>
                <option value="Overtime">Overtime</option>
                <option value="In Progress">Active (In Progress)</option>
              </select>

              <select
                aria-label="Filter timesheets by department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Field Services">Field Services</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Revenue Ops">Revenue Ops</option>
                <option value="Leadership">Leadership</option>
                <option value="Engineering">Engineering</option>
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
                  <th className="py-3 px-4">Assigned Shift</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Break</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Regular</th>
                  <th className="py-3 px-4 text-right">OT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      No timesheet records match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#EC4899]">{r.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink dark:text-white">{r.employeeName}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">{r.department}</div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-300 font-medium max-w-xs truncate">
                        {r.shift}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-ink dark:text-neutral-200">
                        {r.clockIn}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-ink-muted dark:text-neutral-400">
                        {r.clockOut || (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                            ● In Progress
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400 font-mono">
                        {r.breakMinutes}m
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'On Time'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : r.status === 'Overtime'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : r.status === 'In Progress'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-ink dark:text-white">
                        {r.regularHours.toFixed(1)}h
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                        {r.overtimeHours > 0 ? `+${r.overtimeHours.toFixed(1)}h` : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PUNCH CLOCK STATION ─── */}
      {activeTab === 'clockstation' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-[#1A1B18] rounded-3xl p-6 sm:p-8 border border-border dark:border-[#2A2B27] shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono inline-block">
              Live Digital Time Clock
            </span>
            <h3 className="text-xl font-black text-ink dark:text-white">Staff Punch Station</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Select team member and punch in or out. Geolocation and timestamp are logged automatically.
            </p>
          </div>

          {/* Feedback alert notice */}
          {clockActionNotice && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs animate-fade-in">
              {clockActionNotice}
            </div>
          )}

          {/* Staff Member Selector */}
          <div className="text-left space-y-1.5">
            <label className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
              Active Employee Terminal
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full text-sm font-bold p-3 rounded-2xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#EC4899] cursor-pointer"
            >
              <option value="Carlos Mendez">Carlos Mendez (Lead Field Specialist)</option>
              <option value="Devon Vance">Devon Vance (Senior Inventory Director)</option>
              <option value="Maya Lin">Maya Lin (Client Operations Manager)</option>
              <option value="Liam O'Connor">Liam O&apos;Connor (Field Apprentice)</option>
              <option value="Sarah Chen">Sarah Chen (Finance Controller)</option>
              <option value="Elena Rostova">Elena Rostova (Engineering Architect)</option>
              <option value="Yash Rawat">Yash Rawat (Executive CEO)</option>
            </select>
          </div>

          {/* Live Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => handleSimulateClock('IN')}
              className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Clock In</span>
              <span className="text-[10px] opacity-80 font-normal">Start Shift</span>
            </button>

            <button
              onClick={() => handleSimulateClock('BREAK')}
              className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <Coffee className="w-5 h-5" />
              <span>Meal Break</span>
              <span className="text-[10px] opacity-80 font-normal">Pause Work</span>
            </button>

            <button
              onClick={() => handleSimulateClock('OUT')}
              className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Clock Out</span>
              <span className="text-[10px] opacity-80 font-normal">End Daily Shift</span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] flex items-center justify-center gap-2 text-xs text-ink-muted dark:text-neutral-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Biometric PIN &amp; GPS verification active</span>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SHIFT SCHEDULES ─── */}
      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCHEDULES.map((s) => (
            <div
              key={s.name}
              className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-ink dark:text-white">{s.name}</h4>
                  <p className="text-xs text-ink-muted dark:text-neutral-400">{s.department}</p>
                </div>
                <Clock className="w-4 h-4 text-[#EC4899]" />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] font-mono text-xs font-bold text-ink dark:text-white">
                {s.hours}
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted pt-1">
                <span>Assigned Staff:</span>
                <span className="font-bold text-ink dark:text-white">{s.staffCount} workers</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 4: OVERTIME APPROVALS ─── */}
      {activeTab === 'overtime' && (
        <div className="space-y-4">
          <div className="bg-[#FAF9F5] dark:bg-[#141513] p-4 rounded-2xl border border-border dark:border-[#2A2B27] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">Overtime Hours Authorization</h3>
              <p className="text-xs text-ink-muted dark:text-neutral-400">
                Supervisor approval required before overtime pay rate (1.5x) is exported to payroll.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              {pendingOvertimeRecords.length} Pending Approval
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOvertimeRecords.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                All employee overtime has been approved for payroll.
              </div>
            ) : (
              pendingOvertimeRecords.map((r) => (
                <div
                  key={r.id}
                  className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#EC4899]">{r.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          +{r.overtimeHours.toFixed(1)} hrs Overtime
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-ink dark:text-white">{r.employeeName}</h4>
                      <p className="text-xs text-ink-muted dark:text-neutral-400">
                        {r.department} • {r.date}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] text-xs text-ink-muted dark:text-neutral-300">
                    <span className="font-semibold text-ink dark:text-white">Shift Reason: </span>
                    {r.notes}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border dark:border-[#2A2B27]">
                    <button
                      onClick={() => handleApproveOvertime(r.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Overtime
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL: MANUAL TIME ENTRY ─── */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Manual Timesheet Entry
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Log missed shift or offline field work punch.
                </p>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Employee Submitter
                  </label>
                  <select
                    value={manualEmployee}
                    onChange={(e) => setManualEmployee(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                  >
                    <option value="Carlos Mendez">Carlos Mendez</option>
                    <option value="Devon Vance">Devon Vance</option>
                    <option value="Maya Lin">Maya Lin</option>
                    <option value="Liam O'Connor">Liam O&apos;Connor</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Shift Date
                  </label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#EC4899]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Assigned Shift
                </label>
                <select
                  value={manualShift}
                  onChange={(e) => setManualShift(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                >
                  <option value="Morning Field Crew (08:00 - 16:30)">Morning Field Crew (08:00 - 16:30)</option>
                  <option value="Warehouse Dock Shift (07:30 - 16:00)">Warehouse Dock Shift (07:30 - 16:00)</option>
                  <option value="Client Operations (09:00 - 17:30)">Client Operations (09:00 - 17:30)</option>
                  <option value="Engineering Remote (09:00 - 17:30)">Engineering Remote (09:00 - 17:30)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Clock In
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 AM"
                    value={manualClockIn}
                    onChange={(e) => setManualClockIn(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#EC4899]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Clock Out
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="04:30 PM"
                    value={manualClockOut}
                    onChange={(e) => setManualClockOut(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#EC4899]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Break (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={manualBreak}
                    onChange={(e) => setManualBreak(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#EC4899]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Reason for Manual Entry
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Field emergency job without cell reception, biometric punch issue..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#EC4899]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Save Shift Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
