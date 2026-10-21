import { CrmSettingsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'CRM Settings & Pipeline Rules | Bahi CRM',
  description: 'Enterprise pipeline stages, probability weights, lead scoring rules, custom schema fields, and webhooks.',
};

export default function SettingsPage() {
  return <CrmSettingsView />;
}
