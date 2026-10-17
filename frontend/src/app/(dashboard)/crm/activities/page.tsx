import { CrmActivitiesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Activity Timeline & Tasks | Bahi CRM',
  description: 'Unified sales queue for today, overdue follow-ups, calls, and upcoming meetings.',
};

export default function ActivitiesPage() {
  return <CrmActivitiesView />;
}
