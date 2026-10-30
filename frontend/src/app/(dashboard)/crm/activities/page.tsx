import { CrmActivitiesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Activities & Tasks | Bahi CRM',
  description: 'Your daily to-do list: calls to make, meetings to attend, and customer follow-ups.',
};

export default function ActivitiesPage() {
  return <CrmActivitiesView />;
}
