import { ApplicationManifest } from '@bahi/types';

export const servicesManifest: ApplicationManifest = {
  id: 'services',
  name: 'Service Visits & Jobs',
  description: 'Book customer service jobs, schedule visits, and dispatch technicians.',
  icon: 'WrenchScrewdriverIcon',
  colorToken: 'module-services',
  version: '1.0.0',
  backendModule: 'ServicesModule',
  routePrefix: '/services',
  permissions: [
    'view:services',
    'manage:services',
    'view:work_orders',
    'manage:work_orders',
    'view:technicians',
    'manage:technicians',
    'view:contracts',
    'manage:contracts',
  ],
  plans: ['starter', 'growth', 'enterprise'],
  defaultFeatureFlags: {
    'services.dispatch': true,
    'services.workOrders': true,
    'services.contracts': true,
    'services.technicians': true,
  },
  navigation: [
    { label: 'Daily Schedule', href: '/services', icon: 'CalendarDaysIcon' },
    { label: 'Service Jobs', href: '/services#orders', icon: 'ClipboardDocumentListIcon' },
    { label: 'Service Plans', href: '/services#contracts', icon: 'ShieldCheckIcon' },
    { label: 'Technicians & Staff', href: '/services#technicians', icon: 'UserGroupIcon' },
  ],
};

export default servicesManifest;
