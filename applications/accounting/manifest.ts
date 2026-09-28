import { ApplicationManifest } from '@bahi/types';

export const accountingManifest: ApplicationManifest = {
  id: 'accounting',
  name: 'Accounting & Ledger',
  description: 'GAAP double-entry general ledger, automated reconciliation, and invoicing.',
  icon: 'BanknotesIcon',
  colorToken: 'module-accounting',
  version: '1.8.0',
  backendModule: 'AccountingModule',
  routePrefix: '/accounting',
  permissions: [
    'view:invoices',
    'manage:invoices',
    'view:payments',
    'manage:payments',
    'view:reports',
  ],
  plans: ['growth', 'enterprise'],
  defaultFeatureFlags: {
    'accounting.reconciliation': true,
    'accounting.taxReports': true,
  },
  navigation: [
    { label: 'Invoices & Payments', href: '/accounting', icon: 'BanknotesIcon' },
  ],
};

export default accountingManifest;
