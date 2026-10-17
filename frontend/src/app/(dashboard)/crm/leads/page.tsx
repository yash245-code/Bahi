import { CrmLeadsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Leads & Intake | Bahi CRM',
  description: 'Inbound lead qualification, scoring, and 1-click conversion to deals.',
};

export default function LeadsPage() {
  return <CrmLeadsView />;
}
