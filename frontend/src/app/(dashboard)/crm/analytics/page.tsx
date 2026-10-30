import { CrmAnalyticsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Sales Reports & Forecasts | Bahi CRM',
  description: 'Track team sales performance, expected future earnings, and how quickly deals are closing.',
};

export default function AnalyticsPage() {
  return <CrmAnalyticsView />;
}
