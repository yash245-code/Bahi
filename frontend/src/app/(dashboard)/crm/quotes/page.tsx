import { CrmQuotesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Quotes & Estimates | Bahi CRM',
  description: 'Create price estimates for customers, itemize costs, and get approvals online.',
};

export default function QuotesPage() {
  return <CrmQuotesView />;
}
