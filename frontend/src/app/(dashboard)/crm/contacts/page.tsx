import { CrmContactsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Customer Contacts | Bahi CRM',
  description: 'Directory of people, their contact details, notes, and full conversation history.',
};

export default function ContactsPage() {
  return <CrmContactsView />;
}
