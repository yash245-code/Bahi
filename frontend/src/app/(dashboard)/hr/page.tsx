import { StatusBadge } from '@/components/ui/StatusBadge';

const departments = [
  { name: 'Engineering', headcount: 14, head: 'Alex Morgan', openPositions: 2 },
  { name: 'Sales & Marketing', headcount: 8, head: 'Priya Sharma', openPositions: 1 },
  { name: 'Operations', headcount: 6, head: 'Daniel Kim', openPositions: 0 },
  { name: 'Finance', headcount: 4, head: 'Sarah Chen', openPositions: 1 },
  { name: 'HR & Admin', headcount: 2, head: 'Lisa Park', openPositions: 0 },
];

const employees = [
  { name: 'Alex Morgan', role: 'VP Engineering', department: 'Engineering', email: 'alex@acme.co', status: 'Active', avatar: 'AM' },
  { name: 'Priya Sharma', role: 'Head of Sales', department: 'Sales & Marketing', email: 'priya@acme.co', status: 'Active', avatar: 'PS' },
  { name: 'Daniel Kim', role: 'COO', department: 'Operations', email: 'daniel@acme.co', status: 'Active', avatar: 'DK' },
  { name: 'Sarah Chen', role: 'CFO', department: 'Finance', email: 'sarah@acme.co', status: 'On Leave', avatar: 'SC' },
  { name: 'Marcus Rodriguez', role: 'Senior Developer', department: 'Engineering', email: 'marcus@acme.co', status: 'Active', avatar: 'MR' },
  { name: 'Emily Zhang', role: 'Product Designer', department: 'Engineering', email: 'emily@acme.co', status: 'Active', avatar: 'EZ' },
  { name: 'James Wilson', role: 'Account Executive', department: 'Sales & Marketing', email: 'james@acme.co', status: 'Active', avatar: 'JW' },
  { name: 'Lisa Park', role: 'HR Manager', department: 'HR & Admin', email: 'lisa@acme.co', status: 'Active', avatar: 'LP' },
];

const leaveRequests = [
  { employee: 'Sarah Chen', type: 'Annual Leave', from: 'Sep 5, 2026', to: 'Sep 12, 2026', days: 6, status: 'Approved' },
  { employee: 'Marcus Rodriguez', type: 'Sick Leave', from: 'Sep 8, 2026', to: 'Sep 9, 2026', days: 2, status: 'Pending' },
  { employee: 'Emily Zhang', type: 'Personal', from: 'Sep 15, 2026', to: 'Sep 16, 2026', days: 2, status: 'Pending' },
  { employee: 'James Wilson', type: 'Annual Leave', from: 'Sep 22, 2026', to: 'Sep 26, 2026', days: 5, status: 'Pending' },
];

const leaveVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Approved: 'success', Pending: 'warning', Rejected: 'danger',
  };
  return map[s] || 'neutral';
};

const statusVariant = (s: string) => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    Active: 'success', 'On Leave': 'info', Inactive: 'neutral',
  };
  return map[s] || 'neutral';
};

const avatarColors = [
  'bg-accent text-white',
  'bg-[#20211F] text-white',
  'bg-[#1F7A4D] text-white',
  'bg-[#B8790A] text-white',
  'bg-[#853526] text-white',
  'bg-[#75766E] text-white',
];

export default function HrPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Human Resources</h1>
          <p className="page-subtitle">Employee directory, departments, and leave management.</p>
        </div>
        <div className="flex gap-2.5">
          <button className="btn-secondary">Leave Requests</button>
          <button className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="stat-card"><span className="stat-label">Total Employees</span><span className="stat-value">34</span></div>
        <div className="stat-card"><span className="stat-label">Departments</span><span className="stat-value">5</span></div>
        <div className="stat-card"><span className="stat-label">On Leave Today</span><span className="stat-value text-ink">2</span></div>
        <div className="stat-card"><span className="stat-label">Open Positions</span><span className="stat-value text-[#B8790A]">4</span></div>
      </div>

      {/* Department Overview */}
      <h2 className="text-base font-bold text-ink mb-3">Departments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {departments.map((dept) => (
          <div key={dept.name} className="card p-4">
            <h3 className="text-sm font-semibold text-ink mb-2">{dept.name}</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Headcount</span>
                <span className="font-semibold text-ink">{dept.headcount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Head</span>
                <span className="font-medium text-ink truncate ml-2">{dept.head}</span>
              </div>
              {dept.openPositions > 0 && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">Open</span>
                  <span className="font-semibold text-[#B8790A]">{dept.openPositions}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Employee Directory */}
      <h2 className="text-base font-bold text-ink mb-3">Employee Directory</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {employees.map((emp, i) => (
          <div key={emp.email} className="card p-5 flex flex-col items-center text-center cursor-pointer">
            <div className={`w-14 h-14 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center font-bold text-base mb-3 shadow-xs`}>
              {emp.avatar}
            </div>
            <h4 className="text-sm font-semibold text-ink">{emp.name}</h4>
            <p className="text-xs text-ink-muted mt-0.5">{emp.role}</p>
            <p className="text-xs text-ink-muted/80 mt-0.5">{emp.department}</p>
            <div className="mt-3">
              <StatusBadge label={emp.status} variant={statusVariant(emp.status)} />
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests */}
      <h2 className="text-base font-bold text-ink mb-3">Leave Requests</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-[#FAF9F5]">
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Employee</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">From</th>
              <th className="text-left px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">To</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Days</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-5 py-3 font-semibold text-ink-muted text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leaveRequests.map((lr, i) => (
              <tr key={i} className="hover:bg-[#FAF9F5] transition-colors">
                <td className="px-5 py-3.5 font-medium text-ink">{lr.employee}</td>
                <td className="px-5 py-3.5 text-ink-muted">{lr.type}</td>
                <td className="px-5 py-3.5 text-ink-muted">{lr.from}</td>
                <td className="px-5 py-3.5 text-ink-muted">{lr.to}</td>
                <td className="px-5 py-3.5 text-center font-semibold text-ink">{lr.days}</td>
                <td className="px-5 py-3.5 text-center"><StatusBadge label={lr.status} variant={leaveVariant(lr.status)} /></td>
                <td className="px-5 py-3.5 text-center">
                  {lr.status === 'Pending' && (
                    <div className="flex justify-center gap-3">
                      <button className="text-xs font-semibold text-[#1F7A4D] hover:underline">Approve</button>
                      <button className="text-xs font-semibold text-[#B23A2E] hover:underline">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
