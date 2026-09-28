import { ApplicationManifest } from '@bahi/types';

export const crmManifest: ApplicationManifest = {
  id: 'crm',
  name: 'CRM & Pipelines',
  description: 'Visual Kanban pipelines, lead scoring, deal velocity forecasting, and 360° party sync.',
  icon: 'UserGroupIcon',
  colorToken: 'module-crm',
  version: '1.4.2',
  backendModule: 'CrmModule',
  routePrefix: '/crm',
  permissions: [
    'view:leads',
    'manage:leads',
    'view:opportunities',
    'manage:opportunities',
  ],
  plans: ['starter', 'growth', 'enterprise'],
  defaultFeatureFlags: {
    'crm.kanban': true,
    'crm.leadScoring': false,
  },
  navigation: [
    { label: 'Leads & Funnel', href: '/crm', icon: 'FunnelIcon' },
  ],
};

export default crmManifest;
