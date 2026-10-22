import { ApplicationManifest } from '@bahi/types';

export const servicesManifest: ApplicationManifest = {
  id: 'services',
  name: 'Services & Field Ops',
  description: 'Field service calls, technician dispatch, appointments, job work orders, and maintenance contracts.',
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
    { label: 'Dispatch Board', href: '/services', icon: 'CalendarDaysIcon' },
    { label: 'Work Orders', href: '/services#orders', icon: 'ClipboardDocumentListIcon' },
    { label: 'Maintenance Contracts', href: '/services#contracts', icon: 'ShieldCheckIcon' },
    { label: 'Technicians', href: '/services#technicians', icon: 'UserGroupIcon' },
  ],
};

export default servicesManifest;
