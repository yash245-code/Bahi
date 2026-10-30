import { CrmLeadsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Leads & Inquiries | Bahi CRM',
  description: 'See new customer inquiries, mark interested leads, and turn them into deals with one click.',
};

export default function LeadsPage() {
  return <CrmLeadsView />;
}
