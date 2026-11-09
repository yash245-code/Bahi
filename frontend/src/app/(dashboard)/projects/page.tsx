'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Search,
  Plus,
  Download,
  CheckCircle2,
  DollarSign,
  ListTodo,
  Milestone,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  category: string;
  budget: number;
  spent: number;
  lead: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  tasksCompleted: number;
  tasksTotal: number;
  description: string;
}

interface TaskItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  column: 'Backlog' | 'In Progress' | 'Review' | 'Done';
}

interface ProjectMilestone {
  id: string;
  projectName: string;
  title: string;
  targetDate: string;
  completed: boolean;
  deliverables: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    name: 'Field Technician Dispatch Portal Sync',
    client: 'Apex Logistics Hub',
    category: 'Field Operations',
    budget: 18500,
    spent: 12400,
    lead: 'Carlos Mendez',
    deadline: '2026-11-20',
    priority: 'High',
    status: 'In Progress',
    tasksCompleted: 14,
    tasksTotal: 18,
    description: 'Real-time GPS dispatch and offline work order sync for 12 commercial field vans.',
  },
  {
    id: 'PRJ-102',
    name: 'Warehouse IoT Barcode & Cycle Count Upgrade',
    client: 'Nordic Warehouses',
    category: 'Supply Chain',
    budget: 24000,
    spent: 21500,
    lead: 'Devon Vance',
    deadline: '2026-11-15',
    priority: 'High',
    status: 'Review',
    tasksCompleted: 22,
    tasksTotal: 24,
    description: 'Automated warehouse shelf sensors and handheld cycle count barcode scanners integration.',
  },
  {
    id: 'PRJ-103',
    name: 'General Ledger Multi-Currency & Tax Automation',
    client: 'Summit Medical Clinic',
    category: 'Finance & Accounts',
    budget: 12000,
    spent: 6800,
    lead: 'Sarah Chen',
    deadline: '2026-12-05',
    priority: 'Medium',
    status: 'In Progress',
    tasksCompleted: 8,
    tasksTotal: 15,
    description: 'Cross-border billing and automatic quarterly tax calculation ledger module.',
  },
  {
    id: 'PRJ-104',
    name: 'Commercial Client Portal & Renewal Onboarding',
    client: 'Green Garden Cafe',
    category: 'Customer Experience',
    budget: 9500,
    spent: 9500,
    lead: 'Maya Lin',
    deadline: '2026-10-28',
    priority: 'Medium',
    status: 'Completed',
    tasksCompleted: 12,
    tasksTotal: 12,
    description: 'Custom self-service invoice download and contract renewal interface for multi-location franchisees.',
  },
  {
    id: 'PRJ-105',
    name: 'Enterprise Cloud Architecture & S3 Backup Vault',
    client: 'Acme Global Internal',
    category: 'Engineering',
    budget: 32000,
    spent: 8500,
    lead: 'Elena Rostova',
    deadline: '2026-12-18',
    priority: 'High',
    status: 'Planning',
    tasksCompleted: 3,
    tasksTotal: 20,
    description: 'High-availability PostgreSQL replication cluster and daily immutable cryptographic backup archives.',
  },
];

const INITIAL_TASKS: TaskItem[] = [
  { id: 'TSK-201', projectId: 'PRJ-101', projectName: 'Field Technician Dispatch Portal Sync', title: 'Calibrate GPS geofence threshold in field app', assignee: 'Carlos Mendez', priority: 'High', dueDate: '2026-11-12', column: 'In Progress' },
  { id: 'TSK-202', projectId: 'PRJ-101', projectName: 'Field Technician Dispatch Portal Sync', title: 'Complete offline cache persistence unit test', assignee: 'Elena Rostova', priority: 'Medium', dueDate: '2026-11-14', column: 'Review' },
  { id: 'TSK-203', projectId: 'PRJ-102', projectName: 'Warehouse IoT Barcode & Cycle Count Upgrade', title: 'Scan test on 400 dock inventory bins', assignee: 'Devon Vance', priority: 'High', dueDate: '2026-11-10', column: 'Done' },
  { id: 'TSK-204', projectId: 'PRJ-103', projectName: 'General Ledger Multi-Currency & Tax Automation', title: 'Configure VAT 20% calculation schema rules', assignee: 'Sarah Chen', priority: 'High', dueDate: '2026-11-18', column: 'In Progress' },
  { id: 'TSK-205', projectId: 'PRJ-105', projectName: 'Enterprise Cloud Architecture & S3 Backup Vault', title: 'Setup automated snapshot test restore drill', assignee: 'Elena Rostova', priority: 'Medium', dueDate: '2026-11-25', column: 'Backlog' },
  { id: 'TSK-206', projectId: 'PRJ-101', projectName: 'Field Technician Dispatch Portal Sync', title: 'Technician pilot training documentation', assignee: 'Liam O\'Connor', priority: 'Low', dueDate: '2026-11-19', column: 'Backlog' },
];

const INITIAL_MILESTONES: ProjectMilestone[] = [
  { id: 'MLS-01', projectName: 'Field Technician Dispatch Portal Sync', title: 'Phase 1: Real-Time Field Tracking Live Pilot', targetDate: '2026-11-15', completed: false, deliverables: 'Mobile dispatcher app deployed to 5 senior field techs.' },
  { id: 'MLS-02', projectName: 'Warehouse IoT Barcode & Cycle Count Upgrade', title: 'Phase 2: Handheld Scanner Fleet Handover', targetDate: '2026-11-12', completed: true, deliverables: 'Full warehouse cycle count verification completed.' },
  { id: 'MLS-03', projectName: 'General Ledger Multi-Currency & Tax Automation', title: 'Phase 1: Multi-Currency Exchange Rate Engine', targetDate: '2026-11-22', completed: false, deliverables: 'Live ECB daily exchange rate feed integration.' },
  { id: 'MLS-04', projectName: 'Enterprise Cloud Architecture & S3 Backup Vault', title: 'Phase 1: Production Database Read Replicas', targetDate: '2026-12-01', completed: false, deliverables: 'Zero-downtime replication stream verification.' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(INITIAL_MILESTONES);
  const [activeTab, setActiveTab] = useState<'projects' | 'board' | 'milestones' | 'budget'>('projects');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modals
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState('Field Operations');
  const [newBudget, setNewBudget] = useState('');
  const [newLead, setNewLead] = useState('Carlos Mendez');
  const [newDeadline, setNewDeadline] = useState('2026-12-15');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newDescription, setNewDescription] = useState('');

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState(INITIAL_PROJECTS[0]?.name ?? '');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Carlos Mendez');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-11-20');
  const [newTaskColumn, setNewTaskColumn] = useState<'Backlog' | 'In Progress' | 'Review' | 'Done'>('In Progress');

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase()) ||
        p.lead.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || p.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, search, statusFilter, priorityFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const activeCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Planning').length;
    const completedCount = projects.filter((p) => p.status === 'Completed').length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
    const totalSpent = projects.reduce((acc, curr) => acc + curr.spent, 0);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.column === 'Done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { activeCount, completedCount, totalBudget, totalSpent, completionRate };
  }, [projects, tasks]);

  // Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newClient) return;

    const newId = `PRJ-${100 + projects.length + 1}`;
    const budgetNum = parseFloat(newBudget) || 10000;

    const newProj: Project = {
      id: newId,
      name: newProjectName,
      client: newClient,
      category: newCategory,
      budget: budgetNum,
      spent: 0,
      lead: newLead,
      deadline: newDeadline,
      priority: newPriority,
      status: 'In Progress',
      tasksCompleted: 0,
      tasksTotal: 5,
      description: newDescription || 'Standard client delivery project scope.',
    };

    setProjects([newProj, ...projects]);
    setIsNewProjectOpen(false);

    // Reset Form
    setNewProjectName('');
    setNewClient('');
    setNewBudget('');
    setNewDescription('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newId = `TSK-${200 + tasks.length + 1}`;
    const parentProj = projects.find((p) => p.name === newTaskProject);

    const newTask: TaskItem = {
      id: newId,
      projectId: parentProj ? parentProj.id : 'PRJ-101',
      projectName: newTaskProject,
      title: newTaskTitle,
      assignee: newTaskAssignee,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      column: newTaskColumn,
    };

    setTasks([...tasks, newTask]);
    setIsNewTaskOpen(false);
    setNewTaskTitle('');
  };

  const handleMoveTask = (taskId: string, newCol: 'Backlog' | 'In Progress' | 'Review' | 'Done') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: newCol } : t))
    );
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Project ID',
      'Project Name',
      'Client',
      'Category',
      'Project Lead',
      'Budget ($)',
      'Spent ($)',
      'Deadline',
      'Priority',
      'Status',
      'Tasks Completed',
      'Tasks Total',
    ];

    const rows = filteredProjects.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.client}"`,
      `"${p.category}"`,
      `"${p.lead}"`,
      p.budget.toFixed(2),
      p.spent.toFixed(2),
      p.deadline,
      p.priority,
      p.status,
      p.tasksCompleted,
      p.tasksTotal,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bahi_projects_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D1A536]/15 text-[#D1A536] border border-[#D1A536]/30 font-mono">
              Projects
            </span>
            <span className="text-[10px] font-mono text-ink-muted bg-neutral-100 dark:bg-neutral-800 border border-border dark:border-[#2A2B27] px-1.5 py-0.5 rounded">
              Ready to Use
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-neutral-400 mt-0.5">
            Organize project deliverables, assign tasks on Kanban boards, and track completion milestones.
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
            onClick={() => setIsNewTaskOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#D1A536]/30 bg-[#D1A536]/15 text-[#D1A536] hover:bg-[#D1A536]/25 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ListTodo className="w-4 h-4" />
            New Task
          </button>
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#D1A536] hover:bg-[#B88E28] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Project
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
              Active Projects
            </span>
            <FolderKanban className="w-4 h-4 text-[#D1A536]" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.activeCount}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Across {projects.length} client initiatives
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Total Budget
            </span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            ${metrics.totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400 font-mono">
            ${metrics.totalSpent.toLocaleString()} invested to date
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Task Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink dark:text-white font-mono">
            {metrics.completionRate}%
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Sprint deliverables on schedule
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted dark:text-neutral-400">
              Completed Projects
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.completedCount}
          </div>
          <p className="text-xs text-ink-muted dark:text-neutral-400">
            Fully signed off by clients
          </p>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-border dark:border-[#2A2B27] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-[#D1A536]/15 text-[#D1A536] border border-[#D1A536]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          Project Portfolio ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('board')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'board'
              ? 'bg-[#3E7FBF]/15 text-[#3E7FBF] border border-[#3E7FBF]/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          Task Kanban Board ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <Milestone className="w-4 h-4" />
          Roadmap Milestones ({milestones.length})
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'budget'
              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-xs'
              : 'text-ink-muted dark:text-neutral-400 hover:text-ink dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Budget &amp; Spend Analysis
        </button>
      </div>

      {/* ─── TAB 1: PROJECTS PORTFOLIO ─── */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-ink-muted dark:text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects, client, lead, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                aria-label="Filter projects by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">In Review</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                aria-label="Filter projects by priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border dark:border-[#2A2B27] bg-white dark:bg-[#1A1B18] text-ink dark:text-neutral-200 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-white dark:bg-[#1A1B18] rounded-2xl border border-border dark:border-[#2A2B27] text-ink-muted dark:text-neutral-500">
                No projects found matching your search.
              </div>
            ) : (
              filteredProjects.map((proj) => {
                const pct = Math.round((proj.tasksCompleted / (proj.tasksTotal || 1)) * 100);
                return (
                  <div
                    key={proj.id}
                    className="bg-white dark:bg-[#1A1B18] rounded-2xl p-5 border border-border dark:border-[#2A2B27] shadow-xs space-y-4 hover:border-[#D1A536]/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#D1A536]">{proj.id}</span>
                          <span className="text-[10px] text-ink-muted dark:text-neutral-400">
                            • {proj.client}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-ink dark:text-white leading-tight">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-ink-muted dark:text-neutral-400 mt-1 line-clamp-2">
                          {proj.description}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : proj.status === 'Review'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : proj.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-ink-muted dark:text-neutral-400">
                        <span>Task Completion ({proj.tasksCompleted}/{proj.tasksTotal} tasks)</span>
                        <span className="font-mono font-bold text-ink dark:text-white">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#D1A536] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border dark:border-[#2A2B27] text-xs">
                      <div>
                        <span className="text-[10px] text-ink-muted uppercase font-bold block">Lead</span>
                        <span className="font-medium text-ink dark:text-neutral-200 truncate block">
                          {proj.lead}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink-muted uppercase font-bold block">Budget</span>
                        <span className="font-mono font-semibold text-ink dark:text-white">
                          ${proj.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-ink-muted uppercase font-bold block">Deadline</span>
                        <span className="font-mono font-semibold text-ink dark:text-neutral-200">
                          {proj.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: KANBAN BOARD ─── */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {(['Backlog', 'In Progress', 'Review', 'Done'] as const).map((col) => {
            const colTasks = tasks.filter((t) => t.column === col);
            return (
              <div
                key={col}
                className="bg-[#FAF9F5] dark:bg-[#141513] rounded-2xl p-4 border border-border dark:border-[#2A2B27] space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border dark:border-[#2A2B27]">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink dark:text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        col === 'Done' ? 'bg-emerald-500' : col === 'In Progress' ? 'bg-blue-500' : col === 'Review' ? 'bg-amber-500' : 'bg-neutral-400'
                      }`}
                    />
                    {col}
                  </span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-ink dark:text-white">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-ink-muted dark:text-neutral-500 italic">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white dark:bg-[#1A1B18] p-3.5 rounded-xl border border-border dark:border-[#2A2B27] shadow-xs space-y-2 hover:border-[#D1A536]/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-[10px] font-bold text-[#D1A536]">{t.id}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              t.priority === 'High' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-neutral-100 dark:bg-neutral-800 text-ink-muted'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-ink dark:text-white leading-snug">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-ink-muted dark:text-neutral-400 truncate">
                          {t.projectName}
                        </p>

                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border dark:border-[#2A2B27] text-ink-muted">
                          <span>{t.assignee}</span>
                          <span className="font-mono">{t.dueDate}</span>
                        </div>

                        {/* Move controls */}
                        <div className="flex items-center justify-between pt-1 text-[9px] gap-1">
                          {col !== 'Backlog' && (
                            <button
                              onClick={() => handleMoveTask(t.id, col === 'Done' ? 'Review' : col === 'Review' ? 'In Progress' : 'Backlog')}
                              className="text-ink-muted hover:text-ink cursor-pointer"
                            >
                              ← Move Back
                            </button>
                          )}
                          {col !== 'Done' && (
                            <button
                              onClick={() => handleMoveTask(t.id, col === 'Backlog' ? 'In Progress' : col === 'In Progress' ? 'Review' : 'Done')}
                              className="ml-auto font-bold text-[#D1A536] hover:underline cursor-pointer"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 3: MILESTONES ─── */}
      {activeTab === 'milestones' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-6 border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">Delivery Roadmaps &amp; Target Milestones</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Key phase deliverables and client sign-off criteria.
            </p>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-border dark:border-[#2A2B27] bg-[#FAF9F5]/40 dark:bg-[#141513]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={m.completed}
                    onChange={() => handleToggleMilestone(m.id)}
                    className="mt-1 rounded text-[#D1A536] focus:ring-[#D1A536] cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${m.completed ? 'line-through text-ink-muted' : 'text-ink dark:text-white'}`}>
                        {m.title}
                      </h4>
                      <span className="font-mono text-[10px] text-ink-muted">({m.projectName})</span>
                    </div>
                    <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
                      Deliverable: {m.deliverables}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-ink-muted">
                    Due: {m.targetDate}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.completed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {m.completed ? 'Achieved' : 'Scheduled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: BUDGET & SPEND ─── */}
      {activeTab === 'budget' && (
        <div className="bg-white dark:bg-[#1A1B18] rounded-2xl p-6 border border-border dark:border-[#2A2B27] shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-ink dark:text-white">Budget vs. Actual Capital Investment</h3>
            <p className="text-xs text-ink-muted dark:text-neutral-400 mt-0.5">
              Tracking project financial burn and resource allocation across active contracts.
            </p>
          </div>

          <div className="space-y-4">
            {projects.map((p) => {
              const burnPct = Math.min(100, Math.round((p.spent / (p.budget || 1)) * 100));
              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-ink dark:text-white">{p.name}</span>
                      <span className="text-ink-muted dark:text-neutral-400 font-mono ml-2">
                        (${p.spent.toLocaleString()} spent of ${p.budget.toLocaleString()} budget)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-ink dark:text-neutral-200">
                      {burnPct}% Budget Used
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        burnPct > 90 ? 'bg-rose-500' : burnPct > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${burnPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE PROJECT ─── */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Create Project
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Initialize a new deliverable scope and assign a project lead.
                </p>
              </div>
              <button
                onClick={() => setIsNewProjectOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Field Sensor Telemetry Integration"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Client / Beneficiary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Logistics Hub"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  >
                    <option value="Field Operations">Field Operations</option>
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Customer Experience">Customer Experience</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    min="100"
                    placeholder="15000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#D1A536]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Project Lead
                  </label>
                  <select
                    value={newLead}
                    onChange={(e) => setNewLead(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  >
                    <option value="Carlos Mendez">Carlos Mendez</option>
                    <option value="Devon Vance">Devon Vance</option>
                    <option value="Maya Lin">Maya Lin</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Yash Rawat">Yash Rawat</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#D1A536]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Scope &amp; Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Outline key objectives and final client deliverables..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewProjectOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#D1A536] hover:bg-[#B88E28] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: NEW TASK ─── */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1B18] border border-border dark:border-[#2A2B27] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border dark:border-[#2A2B27] pb-3">
              <div>
                <h3 className="text-lg font-black text-ink dark:text-white tracking-tight">
                  Add Kanban Task
                </h3>
                <p className="text-xs text-ink-muted dark:text-neutral-400">
                  Assign a new task deliverable to the project board.
                </p>
              </div>
              <button
                onClick={() => setIsNewTaskOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct pressure test on boiler line 2"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Target Project
                </label>
                <select
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Assignee
                  </label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  >
                    <option value="Carlos Mendez">Carlos Mendez</option>
                    <option value="Devon Vance">Devon Vance</option>
                    <option value="Maya Lin">Maya Lin</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Liam O'Connor">Liam O&apos;Connor</option>
                    <option value="Sarah Chen">Sarah Chen</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Initial Column
                  </label>
                  <select
                    value={newTaskColumn}
                    onChange={(e) => setNewTaskColumn(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white focus:outline-hidden focus:border-[#D1A536]"
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-ink dark:text-neutral-300 uppercase tracking-wider block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border dark:border-[#2A2B27] bg-neutral-50 dark:bg-neutral-900 text-ink dark:text-white font-mono focus:outline-hidden focus:border-[#D1A536]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-[#2A2B27]">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border dark:border-[#2A2B27] text-ink dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#D1A536] hover:bg-[#B88E28] text-white transition-colors cursor-pointer shadow-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
