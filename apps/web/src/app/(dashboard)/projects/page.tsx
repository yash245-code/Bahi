import { StatusBadge } from '@/components/ui/StatusBadge';

const projects = [
  { name: 'Platform Redesign', client: 'Internal', progress: 72, tasks: { total: 24, done: 17 }, hours: 186, budget: '$45,000', status: 'On Track' },
  { name: 'API Integration v2', client: 'NexGen Systems', progress: 45, tasks: { total: 18, done: 8 }, hours: 94, budget: '$32,000', status: 'On Track' },
  { name: 'Mobile App MVP', client: 'TechStart Inc.', progress: 88, tasks: { total: 32, done: 28 }, hours: 312, budget: '$68,000', status: 'Ahead' },
  { name: 'Data Migration', client: 'Enterprise One', progress: 30, tasks: { total: 15, done: 4 }, hours: 56, budget: '$18,000', status: 'At Risk' },
];

const taskColumns = [
  { name: 'To Do', color: '#75766E', tasks: [
    { title: 'Design system tokens audit', project: 'Platform Redesign', assignee: 'EZ', priority: 'Medium' },
    { title: 'Auth flow error handling', project: 'API Integration v2', assignee: 'MR', priority: 'High' },
    { title: 'Data validation layer', project: 'Data Migration', assignee: 'AM', priority: 'High' },
  ]},
  { name: 'In Progress', color: '#B8790A', tasks: [
    { title: 'Dashboard performance opt.', project: 'Platform Redesign', assignee: 'MR', priority: 'High' },
    { title: 'Webhook retry logic', project: 'API Integration v2', assignee: 'DK', priority: 'Medium' },
  ]},
  { name: 'In Review', color: '#A8462F', tasks: [
    { title: 'Push notification service', project: 'Mobile App MVP', assignee: 'JW', priority: 'Medium' },
    { title: 'Sidebar navigation update', project: 'Platform Redesign', assignee: 'EZ', priority: 'Low' },
  ]},
  { name: 'Done', color: '#1F7A4D', tasks: [
    { title: 'Onboarding flow v2', project: 'Mobile App MVP', assignee: 'PS', priority: 'High' },
  ]},
];

const timesheetSummary = [
  { employee: 'Alex Morgan', project: 'Data Migration', hours: 18, week: 'Sep 1–7' },
  { employee: 'Marcus Rodriguez', project: 'Platform Redesign', hours: 32, week: 'Sep 1–7' },
  { employee: 'Emily Zhang', project: 'Platform Redesign', hours: 28, week: 'Sep 1–7' },
  { employee: 'Daniel Kim', project: 'API Integration v2', hours: 24, week: 'Sep 1–7' },
];

const projectVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    'On Track': 'success', Ahead: 'info', 'At Risk': 'danger', Completed: 'neutral',
  };
  return map[s] || 'neutral';
};

const priorityVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    High: 'danger', Medium: 'warning', Low: 'info',
  };
  return map[s] || 'neutral';
};

const avatarColors: Record<string, string> = {
  AM: 'bg-accent text-white',
  PS: 'bg-[#20211F] text-white',
  DK: 'bg-[#1F7A4D] text-white',
  MR: 'bg-[#B8790A] text-white',
  EZ: 'bg-[#853526] text-white',
  JW: 'bg-[#75766E] text-white',
  SC: 'bg-accent text-white',
  LP: 'bg-[#20211F] text-white',
};

export default function ProjectsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage projects, track tasks, and log timesheets.</p>
        </div>
        <div className="flex gap-2.5">
          <button className="btn-secondary">Log Time</button>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="stat-card"><span className="stat-label">Active Projects</span><span className="stat-value">4</span></div>
        <div className="stat-card"><span className="stat-label">Open Tasks</span><span className="stat-value">32</span></div>
        <div className="stat-card"><span className="stat-label">Hours This Week</span><span className="stat-value text-[#1F7A4D]">102</span></div>
        <div className="stat-card"><span className="stat-label">Total Budget</span><span className="stat-value text-accent">$163K</span></div>
      </div>

      {/* Project Cards */}
      <h2 className="text-base font-bold text-ink mb-3">Active Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {projects.map((proj) => (
          <div key={proj.name} className="card p-5 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-ink">{proj.name}</h3>
                <p className="text-xs text-ink-muted mt-0.5">{proj.client}</p>
              </div>
              <StatusBadge label={proj.status} variant={projectVariant(proj.status)} />
            </div>
            <div className="space-y-3">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink-muted">Progress</span>
                  <span className="font-semibold text-ink">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#FAF9F5] border border-border/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      proj.progress >= 75 ? 'bg-[#1F7A4D]' : proj.progress >= 40 ? 'bg-accent' : 'bg-[#B8790A]'
                    }`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-ink-muted block">Tasks</span>
                  <span className="font-semibold text-ink">{proj.tasks.done}/{proj.tasks.total}</span>
                </div>
                <div>
                  <span className="text-ink-muted block">Hours</span>
                  <span className="font-semibold text-ink">{proj.hours}h</span>
                </div>
                <div>
                  <span className="text-ink-muted block">Budget</span>
                  <span className="font-semibold text-accent">{proj.budget}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Task Board */}
      <h2 className="text-base font-bold text-ink mb-3">Task Board</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
        {taskColumns.map((col) => (
          <div key={col.name} className="min-w-[280px] flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
              <h3 className="text-sm font-semibold text-ink">{col.name}</h3>
              <span className="badge badge-neutral text-[10px] ml-auto">{col.tasks.length}</span>
            </div>
            <div className="space-y-3">
              {col.tasks.map((task) => (
                <div key={task.title} className="card p-4 cursor-pointer">
                  <h4 className="text-sm font-medium text-ink mb-1">{task.title}</h4>
                  <p className="text-xs text-ink-muted mb-3">{task.project}</p>
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg ${avatarColors[task.assignee] || 'bg-accent text-white'} flex items-center justify-center text-[10px] font-bold shadow-xs`}>
                      {task.assignee}
                    </div>
                    <StatusBadge label={task.priority} variant={priorityVariant(task.priority)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Timesheet Summary */}
      <h2 className="text-base font-bold text-ink mb-3">Timesheet Summary</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Employee</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Project</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Hours</th>
              <th className="text-right px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Week</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {timesheetSummary.map((ts, i) => (
              <tr key={i} className="hover:bg-[#FAF9F5] transition-colors">
                <td className="px-5 py-3.5 font-medium text-ink">{ts.employee}</td>
                <td className="px-5 py-3.5 text-ink-muted">{ts.project}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-accent">{ts.hours}h</td>
                <td className="px-5 py-3.5 text-right text-ink-muted">{ts.week}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
