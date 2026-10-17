import { CrmAnalyticsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Forecasting & Reports | Bahi CRM',
  description: 'Executive revenue telemetry, weighted pipeline forecast, and sales velocity metrics.',
};

export default function AnalyticsPage() {
  return <CrmAnalyticsView />;
}
