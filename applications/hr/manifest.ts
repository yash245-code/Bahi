import { ApplicationManifest } from '@bahi/types';

export const hrManifest: ApplicationManifest = {
  id: 'hr',
  name: 'Human Resources',
  description: 'Employee directory, leave management, attendance tracking, and department org chart.',
  icon: 'IdentificationIcon',
  colorToken: 'module-hr',
  version: '1.1.4',
  backendModule: 'HrModule',
  routePrefix: '/hr',
  permissions: [
    'view:employees',
    'manage:employees',
    'manage:leave',
    'view:attendance',
  ],
  plans: ['enterprise'],
  defaultFeatureFlags: {
    'hr.leaveApproval': true,
    'hr.attendanceGeofence': false,
  },
  navigation: [
    { label: 'Directory & Leave', href: '/hr', icon: 'IdentificationIcon' },
  ],
};

export default hrManifest;
