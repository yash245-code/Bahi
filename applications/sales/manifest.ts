import { ApplicationManifest } from '@bahi/types';

export const salesManifest: ApplicationManifest = {
  id: 'sales',
  name: 'Sales & Quotes',
  description: 'Create price quotes for customers, confirm orders, and manage price lists.',
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
    { label: 'Overview', href: '/sales', icon: 'ChartBarIcon' },
    { label: 'Price Quotes', href: '/sales/quotes', icon: 'DocumentTextIcon' },
    { label: 'Customer Orders', href: '/sales/orders', icon: 'ShoppingBagIcon' },
    { label: 'Price Lists', href: '/sales/price-books', icon: 'TagIcon' },
    { label: 'Sales Reports', href: '/sales/analytics', icon: 'PresentationChartLineIcon' },
  ],
};

export default salesManifest;
