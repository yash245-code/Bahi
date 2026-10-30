import { ApplicationManifest } from '@bahi/types';

export const projectsManifest: ApplicationManifest = {
  id: 'projects',
  name: 'Projects & Tasks',
  description: 'Organize tasks, assign work to your team, and track project deadlines.',
  icon: 'BriefcaseIcon',
  colorToken: 'module-projects',
  version: '1.2.0',
  backendModule: 'ProjectsModule',
  routePrefix: '/projects',
  permissions: [
    'view:projects',
    'manage:projects',
    'view:timesheets',
    'manage:timesheets',
  ],
  plans: ['enterprise'],
  defaultFeatureFlags: {
    'projects.timesheets': true,
    'projects.gantt': false,
  },
  navigation: [
    { label: 'Projects & Tasks', href: '/projects', icon: 'BriefcaseIcon' },
  ],
};

export default projectsManifest;
