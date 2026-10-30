import { CrmSettingsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'CRM Settings & Pipeline Rules | Bahi CRM',
  description: 'Customize deal stages, win chance percentages, lead qualification rules, and team preferences.',
};

export default function SettingsPage() {
  return <CrmSettingsView />;
}
