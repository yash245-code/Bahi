import { CrmQuotesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Quotes & Proposals | Bahi CRM',
  description: 'Manage commercial quotations, line item pricing, e-signatures, and customer portal approvals.',
};

export default function QuotesPage() {
  return <CrmQuotesView />;
}
