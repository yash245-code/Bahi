import { CrmPipelineView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Deals Pipeline | Bahi CRM',
  description: 'Visual deal Kanban funnel, rotting velocity indicators, and pipeline forecasting.',
};

export default function CrmPage() {
  return <CrmPipelineView />;
}
