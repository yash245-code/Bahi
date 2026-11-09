import { ApplicationManifest } from '@bahi/types';

export const accountingManifest: ApplicationManifest = {
  id: 'accounting',
  name: 'Accounting',
  description: 'Record customer invoices, check payments, and keep track of your cash flow.',
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
    { label: 'General Ledger & Cash Flow', href: '/accounting', icon: 'DocumentTextIcon' },
    { label: 'Chart of Accounts & Banks', href: '/accounting#accounts', icon: 'BuildingLibraryIcon' },
    { label: 'Profit & Loss Statement', href: '/accounting#pl', icon: 'ChartPieIcon' },
    { label: 'Tax Reports & Filing', href: '/accounting#tax', icon: 'ShieldCheckIcon' },
  ],
};

export default accountingManifest;
