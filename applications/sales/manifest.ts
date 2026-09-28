import { ApplicationManifest } from '@bahi/types';

export const salesManifest: ApplicationManifest = {
  id: 'sales',
  name: 'Sales & Quotations',
  description: 'Dynamic quotation generator, multi-tier discount matrix, and 1-click sales order booking.',
  icon: 'DocumentTextIcon',
  colorToken: 'module-billing',
  version: '1.3.8',
  backendModule: 'SalesModule',
  routePrefix: '/sales',
  permissions: [
    'view:quotations',
    'manage:quotations',
    'view:orders',
    'manage:orders',
  ],
  plans: ['starter', 'growth', 'enterprise'],
  defaultFeatureFlags: {
    'sales.discounts': true,
    'sales.multiCurrency': false,
  },
  navigation: [
    { label: 'Quotations & Orders', href: '/sales', icon: 'DocumentTextIcon' },
  ],
};

export default salesManifest;
