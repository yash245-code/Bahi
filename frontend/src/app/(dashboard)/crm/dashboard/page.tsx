import { CrmDashboardView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Sales Dashboard | Bahi CRM',
  description: 'See total sales pipeline, upcoming follow-ups, top sales team members, and overall deal health at a glance.',
};

export default function DashboardPage() {
  return <CrmDashboardView />;
}
