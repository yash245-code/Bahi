import { CrmDashboardView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Customers & Leads Dashboard | Bahi CRM',
  description: 'See total sales pipeline, upcoming follow-ups, top sales team members, and overall deal health at a glance.',
};

export default function CrmPage() {
  return <CrmDashboardView />;
}
