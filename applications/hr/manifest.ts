import { ApplicationManifest } from '@bahi/types';

export const hrManifest: ApplicationManifest = {
  id: 'hr',
  name: 'Team & Staff Directory',
  description: 'Find team contact info, track attendance, and manage vacation requests.',
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
    { label: 'Team & Time Off', href: '/hr', icon: 'IdentificationIcon' },
  ],
};

export default hrManifest;
