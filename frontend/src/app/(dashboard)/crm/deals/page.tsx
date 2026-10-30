import { CrmPipelineView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Deals Board | Bahi CRM',
  description: 'Visual board of sales deals, deals needing attention, and upcoming expected revenue.',
};

export default function DealsPage() {
  return <CrmPipelineView />;
}
