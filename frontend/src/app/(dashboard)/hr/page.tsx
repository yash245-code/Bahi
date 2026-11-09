'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  UserCheck,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  workplace: 'On-Site' | 'Remote' | 'Hybrid';
  employmentType: 'Full-Time' | 'Part-Time' | 'Contractor';
  status: 'Active' | 'On Leave' | 'Remote Today';
  hireDate: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  onboardingProgress: number; // 0 - 100%
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Yash Rawat',
    role: 'Chief Executive Officer',
    department: 'Leadership',
    email: 'yash@bahi.app',
    phone: '+1 (555) 234-5678',
    location: 'Headquarters, Suite 400',
    workplace: 'Hybrid',
    employmentType: 'Full-Time',
    status: 'Active',
    hireDate: '2024-01-15',
    emergencyContact: {
      name: 'Priya Rawat',
      relationship: 'Spouse',
      phone: '+1 (555) 234-9988',
    },
    onboardingProgress: 100,
  },
  {
    id: 'EMP-002',
    name: 'Carlos Mendez',
    role: 'Lead Field Specialist',
    department: 'Field Services',
    email: 'carlos@bahi.app',
    phone: '+1 (555) 345-6789',
    location: 'West Metro Service Depot',
    workplace: 'On-Site',
    employmentType: 'Full-Time',
    status: 'Active',
    hireDate: '2024-06-01',
    emergencyContact: {
      name: 'Maria Mendez',
      relationship: 'Spouse',
      phone: '+1 (555) 345-0011',
    },
    onboardingProgress: 100,
  },
  {
    id: 'EMP-003',
    name: 'Maya Lin',
    role: 'Client Operations Manager',
    department: 'Revenue Ops',
    email: 'maya@bahi.app',
    phone: '+1 (555) 456-7890',
    location: 'Seattle Hub',
    workplace: 'Remote',
    employmentType: 'Full-Time',
    status: 'Remote Today',
    hireDate: '2024-09-15',
    emergencyContact: {
      name: 'David Lin',
      relationship: 'Brother',
      phone: '+1 (555) 456-1122',
    },
    onboardingProgress: 100,
  },
  {
    id: 'EMP-004',
    name: 'Devon Vance',
    role: 'Senior Inventory Director',
    department: 'Supply Chain',
    email: 'devon@bahi.app',
    phone: '+1 (555) 567-8901',
    location: 'Central Distribution Center',
    workplace: 'On-Site',
    employmentType: 'Full-Time',
    status: 'Active',
    hireDate: '2025-02-10',
    emergencyContact: {
      name: 'Sarah Vance',
      relationship: 'Sister',
      phone: '+1 (555) 567-3344',
    },
    onboardingProgress: 100,
  },
  {
    id: 'EMP-005',
    name: 'Sarah Chen',
    role: 'Chief Financial Controller',
    department: 'Finance',
    email: 'sarah@bahi.app',
    phone: '+1 (555) 678-9012',
    location: 'Headquarters, Suite 400',
    workplace: 'Hybrid',
    employmentType: 'Full-Time',
    status: 'On Leave',
    hireDate: '2024-03-20',
    emergencyContact: {
      name: 'Kevin Chen',
      relationship: 'Spouse',
      phone: '+1 (555) 678-5566',
    },
    onboardingProgress: 100,
  },
  {
    id: 'EMP-006',
    name: 'Elena Rostova',
    role: 'Principal Cloud Architect',
    department: 'Engineering',
    email: 'elena@bahi.app',
    phone: '+1 (555) 789-0123',
    location: 'San Francisco Office',
    workplace: 'Remote',
    employmentType: 'Full-Time',
    status: 'Remote Today',
    hireDate: '2025-05-01',
    emergencyContact: {
      name: 'Alex Rostova',
      relationship: 'Father',
      phone: '+1 (555) 789-7788',
    },
    onboardingProgress: 100,
  },
  {
    id: 'EMP-007',
    name: 'Marcus Vance',
    role: 'Commercial Account Executive',
    department: 'Revenue Ops',
    email: 'marcus@bahi.app',
    phone: '+1 (555) 890-1234',
    location: 'Austin Regional Hub',
    workplace: 'Hybrid',
    employmentType: 'Full-Time',
    status: 'Active',
    hireDate: '2026-08-01',
    emergencyContact: {
      name: 'Devon Vance',
      relationship: 'Brother',
      phone: '+1 (555) 567-8901',
    },
    onboardingProgress: 80,
  },
  {
    id: 'EMP-008',
    name: 'Liam O\'Connor',
    role: 'Field Service Apprentice',
    department: 'Field Services',
    email: 'liam@bahi.app',
    phone: '+1 (555) 901-2345',
    location: 'West Metro Service Depot',
    workplace: 'On-Site',
    employmentType: 'Contractor',
    status: 'Active',
    hireDate: '2026-10-15',
    emergencyContact: {
      name: 'Grace O\'Connor',
      relationship: 'Mother',
      phone: '+1 (555) 901-9900',
    },
    onboardingProgress: 60,
  },
];

interface DepartmentSummary {
  name: string;
  lead: string;
  count: number;
  openRoles: number;
  color: string;
}

const DEPARTMENTS: DepartmentSummary[] = [
  { name: 'Leadership', lead: 'Yash Rawat', count: 1, openRoles: 0, color: '#C2542F' },
  { name: 'Field Services', lead: 'Carlos Mendez', count: 2, openRoles: 2, color: '#2DD4BF' },
  { name: 'Revenue Ops', lead: 'Maya Lin', count: 2, openRoles: 1, color: '#E11D48' },
  { name: 'Supply Chain', lead: 'Devon Vance', count: 1, openRoles: 1, color: '#3E7FBF' },
  { name: 'Finance', lead: 'Sarah Chen', count: 1, openRoles: 0, color: '#2E9169' },
  { name: 'Engineering', lead: 'Elena Rostova', count: 1, openRoles: 2, color: '#8B5CF6' },
];

export default function StaffPage() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState<'directory' | 'departments' | 'emergency' | 'onboarding'>('directory');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [workplaceFilter, setWorkplaceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // New Employee Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDepartment, setNewDepartment] = useState('Field Services');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('Headquarters, Suite 400');
  const [newWorkplace, setNewWorkplace] = useState<'On-Site' | 'Remote' | 'Hybrid'>('On-Site');
  const [newEmploymentType, setNewEmploymentType] = useState<'Full-Time' | 'Part-Time' | 'Contractor'>('Full-Time');
  const [newHireDate, setNewHireDate] = useState('2026-11-01');
  const [newEmergencyName, setNewEmergencyName] = useState('');
  const [newEmergencyRelation, setNewEmergencyRelation] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');

  // Filtering
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.role.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase());

      const matchesDept = departmentFilter === 'ALL' || e.department === departmentFilter;
      const matchesWorkplace = workplaceFilter === 'ALL' || e.workplace === workplaceFilter;
      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;

      return matchesSearch && matchesDept && matchesWorkplace && matchesStatus;
    });
  }, [employees, search, departmentFilter, workplaceFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const totalStaff = employees.length;
    const workingToday = employees.filter((e) => e.status === 'Active' || e.status === 'Remote Today').length;
    const onLeave = employees.filter((e) => e.status === 'On Leave').length;
    const remoteWorkers = employees.filter((e) => e.workplace === 'Remote' || e.status === 'Remote Today').length;
    return { totalStaff, workingToday, onLeave, remoteWorkers };
  }, [employees]);

  // Add Employee Handler
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newRole) return;

    const newId = `EMP-00${employees.length + 1}`;
    const newEntry: Employee = {
      id: newId,
      name: newName,
      role: newRole,
      department: newDepartment,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-0000',
      location: newLocation,
      workplace: newWorkplace,
      employmentType: newEmploymentType,
      status: 'Active',
      hireDate: newHireDate,
      emergencyContact: {
        name: newEmergencyName || 'Family Contact',
        relationship: newEmergencyRelation || 'Next of Kin',
        phone: newEmergencyPhone || newPhone,
      },
      onboardingProgress: 25,
    };

    setEmployees([...employees, newEntry]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewName('');
    setNewRole('');
    setNewEmail('');
    setNewPhone('');
    setNewEmergencyName('');
    setNewEmergencyRelation('');
    setNewEmergencyPhone('');
  };

  const handleToggleStatus = (id: string, newStatus: 'Active' | 'On Leave' | 'Remote Today') => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Job Role',
      'Department',
      'Email',
      'Phone',
      'Workplace',
      'Employment Type',
      'Status',
      'Hire Date',
      'Emergency Contact',
      'Emergency Phone',
    ];

    const rows = filteredEmployees.map((e) => [
      e.id,
      `"${e.name}"`,
      `"${e.role}"`,
      `"${e.department}"`,
      e.email,
      `"${e.phone}"`,
      e.workplace,
      e.employmentType,
      e.status,
      e.hireDate,
      `"${e.emergencyContact.name} (${e.emergencyContact.relationship})"`,
      `"${e.emergencyContact.phone}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_staff_roster_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C24A6B]/15 text-[#C24A6B] border border-[#C24A6B]/30 font-mono">
              Staff
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Staff
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Manage your company roster, job roles, department assignments, and emergency contact records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-ink-muted dark:text-neutral-400" />
            Export Roster
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#C24A6B] hover:bg-[#B03C5D] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Staff Member
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
              Total Headcount
            </span>
            <Users className="w-4 h-4 text-[#C24A6B]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.totalStaff}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% active roster synced
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Working Today
            </span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.workingToday}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Across on-site depots &amp; remote
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              On Leave
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {metrics.onLeave}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Scheduled back on Monday
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Remote / Field
            </span>
            <MapPin className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.remoteWorkers}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Distributed workforce coverage
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-[#C24A6B]/15 text-[#C24A6B] border border-[#C24A6B]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Staff Directory ({employees.length})
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'departments'
              ? 'bg-[#2DD4BF]/15 text-[#0F766E] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Departments &amp; Leads
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'emergency'
              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Emergency &amp; Compliance
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'onboarding'
              ? 'bg-[#3E7FBF]/15 text-[#3E7FBF] border border-[#3E7FBF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Onboarding Checklists
        </button>
      </div>

      {/* ─── TAB 1: DIRECTORY ─── */}
      {activeTab === 'directory' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, role, email, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter staff by department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                <option value="Leadership">Leadership</option>
                <option value="Field Services">Field Services</option>
                <option value="Revenue Ops">Revenue Ops</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
              </select>

              <select
                aria-label="Filter staff by workplace location"
                value={workplaceFilter}
                onChange={(e) => setWorkplaceFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Workplaces</option>
                <option value="On-Site">On-Site Depots</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <select
                aria-label="Filter staff by active status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Remote Today">Remote Today</option>
              </select>
            </div>
          </div>

          {/* Directory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Job Role &amp; Dept</th>
                  <th className="py-3 px-4">Workplace</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Hire Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-muted dark:text-neutral-500">
                      No staff members match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#C24A6B]/15 text-[#C24A6B] font-bold text-xs flex items-center justify-center border border-[#C24A6B]/25">
                            {emp.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-ink dark:text-white">{emp.name}</div>
                            <div className="font-mono text-[10px] text-ink-muted dark:text-neutral-400">
                              {emp.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-ink dark:text-neutral-200">{emp.role}</div>
                        <div className="text-[10px] text-ink-muted dark:text-neutral-400">{emp.department}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted dark:text-neutral-300">
                          <MapPin className="w-3 h-3 text-ink-muted" />
                          {emp.workplace}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-mono text-ink dark:text-neutral-200">{emp.email}</div>
                        <div className="text-[10px] font-mono text-ink-muted dark:text-neutral-400">{emp.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-ink dark:text-neutral-300">
                          {emp.employmentType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : emp.status === 'Remote Today'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-ink-muted dark:text-neutral-400 text-[11px]">
                        {emp.hireDate}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-ink dark:text-white transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 2: DEPARTMENTS & TEAMS ─── */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.name}
              className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-ink dark:text-white">{dept.name}</h4>
                  <p className="text-xs text-ink-muted dark:text-neutral-400">
                    Lead: <span className="font-semibold text-ink dark:text-neutral-200">{dept.lead}</span>
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: `${dept.color}20`, color: dept.color }}
                >
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border dark:border-[#2A2B27]">
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                  <p className="text-[10px] text-ink-muted uppercase font-bold">Assigned Staff</p>
                  <p className="text-lg font-black font-mono text-ink dark:text-white">{dept.count} Members</p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27]">
                  <p className="text-[10px] text-ink-muted uppercase font-bold">Open Positions</p>
                  <p className="text-lg font-black font-mono text-accent">
                    {dept.openRoles} Requisitions
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TAB 3: EMERGENCY & COMPLIANCE ─── */}
      {activeTab === 'emergency' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border dark:border-[#2A2B27] bg-[#FAF9F5]/50 dark:bg-[#141513]/50">
            <h3 className="text-sm font-bold text-ink dark:text-white">Emergency Contacts &amp; Work Records</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400">
              Mandatory OSHA and company compliance records in case of workplace incident or field emergencies.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] dark:bg-[#141513] text-ink-muted dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-border dark:border-[#2A2B27]">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Emergency Contact</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[#2A2B27]">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3.5 px-4 font-bold text-ink dark:text-white">{emp.name}</td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">{emp.department}</td>
                    <td className="py-3.5 px-4 font-semibold text-ink dark:text-neutral-200">
                      {emp.emergencyContact.name}
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted dark:text-neutral-400">
                      {emp.emergencyContact.relationship}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-ink dark:text-white">
                      {emp.emergencyContact.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 4: ONBOARDING PROGRESS ─── */}
      {activeTab === 'onboarding' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-6 border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">New Hires Onboarding &amp; Setup</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Tracks IT equipment provisioning, signed handbook contracts, and safety certifications.
            </p>
          </div>

          <div className="space-y-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5]/40 dark:bg-[#141513]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink dark:text-white">{emp.name}</span>
                    <span className="text-[10px] font-mono text-ink-muted dark:text-neutral-400">
                      Hired {emp.hireDate}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted dark:text-neutral-400">
                    {emp.role} • {emp.department}
                  </p>
                </div>

                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-bold text-ink-muted mb-1">
                      <span>Checklist Completion</span>
                      <span>{emp.onboardingProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          emp.onboardingProgress === 100
                            ? 'bg-emerald-500'
                            : 'bg-[#C24A6B]'
                        }`}
                        style={{ width: `${emp.onboardingProgress}%` }}
                      />
                    </div>
                  </div>
                  {emp.onboardingProgress === 100 ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD STAFF MEMBER ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Add Staff Member
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Register a new employee into the company directory.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Green"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Job Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Field Technician"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Department
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Field Services">Field Services</option>
                    <option value="Revenue Ops">Revenue Ops</option>
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Finance">Finance</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Workplace Arrangement
                  </label>
                  <select
                    value={newWorkplace}
                    onChange={(e) => setNewWorkplace(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  >
                    <option value="On-Site">On-Site Depot</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid Office/Field</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@bahi.app"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Employment Type
                  </label>
                  <select
                    value={newEmploymentType}
                    onChange={(e) => setNewEmploymentType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#C24A6B]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={newHireDate}
                    onChange={(e) => setNewHireDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#C24A6B]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink dark:text-white block">
                  Emergency Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newEmergencyName}
                    onChange={(e) => setNewEmergencyName(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Relationship (e.g. Spouse)"
                    value={newEmergencyRelation}
                    onChange={(e) => setNewEmergencyRelation(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Emergency Phone"
                    value={newEmergencyPhone}
                    onChange={(e) => setNewEmergencyPhone(e.target.value)}
                    className="text-xs p-2 rounded-lg border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#C24A6B] hover:bg-[#B03C5D] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: EMPLOYEE PROFILE DRAWER ─── */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C24A6B]/15 text-[#C24A6B] font-black text-sm flex items-center justify-center border border-[#C24A6B]/30">
                  {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-black text-ink dark:text-white">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-ink-muted dark:text-neutral-400">
                    {selectedEmployee.role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-border dark:border-[#2A2B27] space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Employee ID:</span>
                  <span className="font-mono font-bold text-ink dark:text-white">{selectedEmployee.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Department:</span>
                  <span className="font-semibold text-ink dark:text-white">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Work Email:</span>
                  <span className="font-mono text-ink dark:text-white">{selectedEmployee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Phone Number:</span>
                  <span className="font-mono text-ink dark:text-white">{selectedEmployee.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Work Location:</span>
                  <span className="text-ink dark:text-white">{selectedEmployee.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Employment Type:</span>
                  <span className="font-medium text-ink dark:text-white">{selectedEmployee.employmentType}</span>
                </div>
              </div>

              {/* Status Switcher */}
              <div>
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1.5">
                  Update Working Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedEmployee.id, 'Active')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedEmployee.status === 'Active'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'border-border dark:border-[#2A2B27] text-ink-muted'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedEmployee.id, 'Remote Today')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedEmployee.status === 'Remote Today'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : 'border-border dark:border-[#2A2B27] text-ink-muted'
                    }`}
                  >
                    Remote
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedEmployee.id, 'On Leave')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedEmployee.status === 'On Leave'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'border-border dark:border-[#2A2B27] text-ink-muted'
                    }`}
                  >
                    On Leave
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border dark:border-[#2A2B27]">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
