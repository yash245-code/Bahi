import { CrmCompaniesView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Companies & Organizations | Bahi CRM',
  description: 'Manage client companies, view company team members, and track all related deals.',
};

export default function CompaniesPage() {
  return <CrmCompaniesView />;
}
