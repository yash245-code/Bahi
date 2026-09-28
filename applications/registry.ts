// ═══════════════════════════════════════════════════════════
// @bahi/applications — Unified Application Registry
// Discovers, indexes, and provides helpers for all Bahi
// business applications.
// ═══════════════════════════════════════════════════════════

import { ApplicationManifest, ApplicationId } from '@bahi/types';

import { crmManifest } from './crm/manifest';
import { salesManifest } from './sales/manifest';
import { inventoryManifest } from './inventory/manifest';
import { accountingManifest } from './accounting/manifest';
import { hrManifest } from './hr/manifest';
import { projectsManifest } from './projects/manifest';

export {
  crmManifest,
  salesManifest,
  inventoryManifest,
  accountingManifest,
  hrManifest,
  projectsManifest,
};

export type { ApplicationManifest, ApplicationId };

export const applicationRegistry: Record<ApplicationId, ApplicationManifest> = {
  crm: crmManifest,
  sales: salesManifest,
  inventory: inventoryManifest,
  accounting: accountingManifest,
  hr: hrManifest,
  projects: projectsManifest,
};

export const applications: ApplicationManifest[] = [
  crmManifest,
  salesManifest,
  inventoryManifest,
  accountingManifest,
  hrManifest,
  projectsManifest,
];

/**
 * Returns all registered applications.
 */
export function getAllApplications(): ApplicationManifest[] {
  return applications;
}

/**
 * Retrieves a single application manifest by ID.
 */
export function getApplication(id: string): ApplicationManifest | undefined {
  return applicationRegistry[id as ApplicationId];
}

/**
 * Returns applications available for a given subscription plan tier.
 */
export function getApplicationsForPlan(plan: string): ApplicationManifest[] {
  const normalized = plan.toLowerCase();
  return applications.filter((app) =>
    app.plans.includes(normalized as 'starter' | 'growth' | 'enterprise'),
  );
}

/**
 * Checks whether an application is permitted under a given plan tier.
 */
export function isApplicationAllowedForPlan(appId: string, plan: string): boolean {
  const app = getApplication(appId);
  if (!app) return false;
  return app.plans.includes(plan.toLowerCase() as 'starter' | 'growth' | 'enterprise');
}

/**
 * Checks whether an application is active and enabled for a tenant.
 */
export function isApplicationEnabled(
  appId: string,
  tenantEnabledModules: string[] = [],
): boolean {
  return tenantEnabledModules.includes(appId);
}

export { REQUIRE_APPLICATION_KEY, RequireApplication } from '@bahi/types';



