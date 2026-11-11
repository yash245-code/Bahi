import {
  hasPermission,
  isStaffRole,
  UserRole,
  ROLE_PERMISSIONS,
} from '../../../frontend/src/lib/permissions';
import { INITIAL_PLANS } from '../../../frontend/src/lib/plans-data';

describe('SaaS RBAC Permissions & Authorization Unit Tests', () => {
  it('should grant full administrative privileges to super_admin', () => {
    expect(hasPermission('super_admin', 'admin:access')).toBe(true);
    expect(hasPermission('super_admin', 'admin:users:impersonate')).toBe(true);
    expect(hasPermission('super_admin', 'admin:audit_logs:read')).toBe(true);
    expect(hasPermission('super_admin', 'workspace:manage_roles')).toBe(true);
  });

  it('should restrict customer_user from staff administrative access', () => {
    expect(hasPermission('customer_user', 'admin:access')).toBe(false);
    expect(hasPermission('customer_user', 'admin:users:impersonate')).toBe(false);
    expect(hasPermission('customer_user', 'billing:manage_subscription')).toBe(false);
    expect(hasPermission('customer_user', 'apps:crm:access')).toBe(true);
  });

  it('should allow customer_admin (organization owner) to manage billing and invites', () => {
    expect(hasPermission('customer_admin', 'billing:manage_subscription')).toBe(true);
    expect(hasPermission('customer_admin', 'workspace:invite_member')).toBe(true);
    expect(hasPermission('customer_admin', 'admin:access')).toBe(false); // Customer owner cannot access staff console
  });

  it('should accurately identify staff roles for elevated security perimeter', () => {
    expect(isStaffRole('super_admin')).toBe(true);
    expect(isStaffRole('billing_manager')).toBe(true);
    expect(isStaffRole('support_agent')).toBe(true);
    expect(isStaffRole('content_editor')).toBe(true);
    expect(isStaffRole('customer_admin')).toBe(false);
    expect(isStaffRole('customer_user')).toBe(false);
  });
});

describe('SaaS Plans & Pricing Calculation Unit Tests', () => {
  it('should have 3 primary tiers with valid pricing models', () => {
    expect(INITIAL_PLANS.length).toBe(3);
    const starter = INITIAL_PLANS.find((p) => p.id === 'starter')!;
    const growth = INITIAL_PLANS.find((p) => p.id === 'growth')!;
    const business = INITIAL_PLANS.find((p) => p.id === 'business')!;

    expect(starter.monthlyPrice).toBe(29);
    expect(starter.annualPrice).toBeLessThan(starter.monthlyPrice);

    expect(growth.monthlyPrice).toBe(79);
    expect(growth.annualPrice).toBeLessThan(growth.monthlyPrice);

    expect(business.monthlyPrice).toBe(199);
    expect(business.annualPrice).toBeLessThan(business.monthlyPrice);
  });

  it('should correctly calculate 15-day proration credit between Starter and Growth', () => {
    const starterDaily = 29 / 30;
    const growthDaily = 79 / 30;
    const daysRemaining = 15;

    const unusedStarterCredit = +(starterDaily * daysRemaining).toFixed(2);
    const newGrowthCost = +(growthDaily * daysRemaining).toFixed(2);
    const netImmediateCharge = +(newGrowthCost - unusedStarterCredit).toFixed(2);

    expect(unusedStarterCredit).toBe(14.5);
    expect(newGrowthCost).toBe(39.5);
    expect(netImmediateCharge).toBe(25.0);
  });
});

