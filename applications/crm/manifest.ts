import { ApplicationManifest } from '@bahi/types';

export const crmManifest: ApplicationManifest = {
  id: 'crm',
  name: 'CRM & Pipelines',
  description: 'Visual Kanban pipelines, lead qualification scoring, corporate accounts, contact directory, and revenue forecasting.',
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
    'view:companies',
    'manage:companies',
    'view:contacts',
    'manage:contacts',
    'view:activities',
    'manage:activities',
  ],
  plans: ['starter', 'growth', 'enterprise'],
  defaultFeatureFlags: {
    'crm.kanban': true,
    'crm.leadScoring': true,
    'crm.multiPipeline': true,
    'crm.forecasting': true,
    'crm.activityTracking': true,
  },
  navigation: [
    { label: 'Deals Pipeline', href: '/crm', icon: 'FunnelIcon' },
    { label: 'Leads & Intake', href: '/crm/leads', icon: 'UserPlusIcon' },
    { label: 'Companies & Accounts', href: '/crm/companies', icon: 'BuildingOfficeIcon' },
    { label: 'Contacts Directory', href: '/crm/contacts', icon: 'UserGroupIcon' },
    { label: 'Activity Timeline', href: '/crm/activities', icon: 'CalendarDaysIcon' },
    { label: 'Forecast & Reports', href: '/crm/analytics', icon: 'ChartBarIcon' },
  ],
};

export default crmManifest;
