import { CrmDashboardView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Revenue Command Center | Bahi CRM',
  description: 'Executive revenue cockpit, quota pacing, sales velocity, rep leaderboards, and opportunity health telemetry.',
};

export default function DashboardPage() {
  return <CrmDashboardView />;
}
