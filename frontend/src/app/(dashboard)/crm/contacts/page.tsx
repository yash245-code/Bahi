import { CrmContactsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Contacts Directory | Bahi CRM',
  description: 'Directory of decision-makers, stakeholders, and 360 customer communication profiles.',
};

export default function ContactsPage() {
  return <CrmContactsView />;
}
