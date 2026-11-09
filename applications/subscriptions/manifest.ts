import { ApplicationManifest } from '@bahi/types';

export const subscriptionsManifest: ApplicationManifest = {
  id: 'subscriptions',
  name: 'Subscriptions',
  description: 'Manage recurring customer plans, automated billing cycles, pricing tiers, and renewals.',
  icon: 'CreditCardIcon',
  colorToken: 'module-billing',
  version: '1.0.0',
  backendModule: 'SubscriptionsModule',
  routePrefix: '/subscriptions',
  permissions: [
    'view:subscriptions',
    'manage:subscriptions',
    'view:plans',
    'manage:plans',
    'view:billing',
    'manage:billing',
  ],
  plans: ['starter', 'growth', 'enterprise'],
  defaultFeatureFlags: {
    'subscriptions.recurring': true,
    'subscriptions.plans': true,
    'subscriptions.invoices': true,
    'subscriptions.dunning': true,
  },
  navigation: [
    { label: 'Subscriptions', href: '/subscriptions', icon: 'UserGroupIcon' },
    { label: 'Pricing Plans', href: '/subscriptions#plans', icon: 'Squares2X2Icon' },
    { label: 'Billing Invoices', href: '/subscriptions#billing', icon: 'ReceiptPercentIcon' },
  ],
};

export default subscriptionsManifest;

