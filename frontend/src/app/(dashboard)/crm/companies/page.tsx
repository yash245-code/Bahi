import { CrmCompaniesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Corporate Accounts | Bahi CRM',
  description: 'Manage B2B client organizations, corporate hierarchies, and deal attribution.',
};

export default function CompaniesPage() {
  return <CrmCompaniesView />;
}
