import { CrmDashboardView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'CRM Executive Dashboard | Bahi CRM',
  description: 'Revenue cockpit, quota pacing, sales velocity, rep leaderboards, and opportunity health telemetry.',
};

export default function CrmPage() {
  return <CrmDashboardView />;
}
