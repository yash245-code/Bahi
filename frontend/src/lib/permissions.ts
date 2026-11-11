// ═══════════════════════════════════════════════════════════
// Bahi SaaS Platform — Central Permission & RBAC Engine
// ═══════════════════════════════════════════════════════════

export type UserRole =
  | 'super_admin'
  | 'billing_manager'
  | 'content_editor'
  | 'support_agent'
  | 'customer_admin'
  | 'customer_user';

export type Permission =
  // Public & Profile
  | 'profile:read'
  | 'profile:update'
  // Customer App Workspace
  | 'workspace:read'
  | 'workspace:update'
  | 'workspace:invite_member'
  | 'workspace:manage_roles'
  | 'workspace:delete'
  // Business Apps
  | 'apps:crm:access'
  | 'apps:sales:access'
  | 'apps:inventory:access'
  | 'apps:accounting:access'
  | 'apps:hr:access'
  | 'apps:projects:access'
  // Billing
  | 'billing:view_invoices'
  | 'billing:manage_subscription'
  | 'billing:manage_payment_methods'
  // Support
  | 'support:create_ticket'
  | 'support:view_own_tickets'
  | 'support:manage_all_tickets'
  | 'support:internal_notes'
  // CMS & Marketing
  | 'cms:read'
  | 'cms:write'
  | 'cms:publish'
  // Admin Console (Staff Only)
  | 'admin:access'
  | 'admin:dashboard:view'
  | 'admin:users:read'
  | 'admin:users:manage'
  | 'admin:users:impersonate'
  | 'admin:tenants:read'
  | 'admin:tenants:manage'
  | 'admin:plans:manage'
  | 'admin:payments:manage'
  | 'admin:feature_flags:manage'
  | 'admin:audit_logs:read'
  | 'admin:error_logs:read'
  | 'admin:settings:manage'
  | 'admin:security:manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'profile:read',
    'profile:update',
    'workspace:read',
    'workspace:update',
    'workspace:invite_member',
    'workspace:manage_roles',
    'workspace:delete',
    'apps:crm:access',
    'apps:sales:access',
    'apps:inventory:access',
    'apps:accounting:access',
    'apps:hr:access',
    'apps:projects:access',
    'billing:view_invoices',
    'billing:manage_subscription',
    'billing:manage_payment_methods',
    'support:create_ticket',
    'support:view_own_tickets',
    'support:manage_all_tickets',
    'support:internal_notes',
    'cms:read',
    'cms:write',
    'cms:publish',
    'admin:access',
    'admin:dashboard:view',
    'admin:users:read',
    'admin:users:manage',
    'admin:users:impersonate',
    'admin:tenants:read',
    'admin:tenants:manage',
    'admin:plans:manage',
    'admin:payments:manage',
    'admin:feature_flags:manage',
    'admin:audit_logs:read',
    'admin:error_logs:read',
    'admin:settings:manage',
    'admin:security:manage',
  ],

  billing_manager: [
    'profile:read',
    'profile:update',
    'admin:access',
    'admin:dashboard:view',
    'admin:tenants:read',
    'admin:plans:manage',
    'admin:payments:manage',
    'billing:view_invoices',
    'billing:manage_subscription',
    'billing:manage_payment_methods',
    'admin:audit_logs:read',
  ],

  content_editor: [
    'profile:read',
    'profile:update',
    'admin:access',
    'cms:read',
    'cms:write',
    'cms:publish',
    'admin:audit_logs:read',
  ],

  support_agent: [
    'profile:read',
    'profile:update',
    'admin:access',
    'admin:dashboard:view',
    'admin:users:read',
    'admin:tenants:read',
    'support:view_own_tickets',
    'support:manage_all_tickets',
    'support:internal_notes',
    'admin:audit_logs:read',
  ],

  customer_admin: [
    'profile:read',
    'profile:update',
    'workspace:read',
    'workspace:update',
    'workspace:invite_member',
    'workspace:manage_roles',
    'apps:crm:access',
    'apps:sales:access',
    'apps:inventory:access',
    'apps:accounting:access',
    'apps:hr:access',
    'apps:projects:access',
    'billing:view_invoices',
    'billing:manage_subscription',
    'billing:manage_payment_methods',
    'support:create_ticket',
    'support:view_own_tickets',
  ],

  customer_user: [
    'profile:read',
    'profile:update',
    'workspace:read',
    'apps:crm:access',
    'apps:sales:access',
    'apps:inventory:access',
    'apps:accounting:access',
    'support:create_ticket',
    'support:view_own_tickets',
  ],
};

export const ROLE_LABELS: Record<UserRole, { label: string; badge: string; description: string }> = {
  super_admin: {
    label: 'Super Admin',
    badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    description: 'Full unconstrained platform control, staff impersonation, security controls, and audit logs.',
  },
  billing_manager: {
    label: 'Billing Manager',
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    description: 'Manages pricing plans, subscriptions, payment provider webhooks, invoices, and refunds.',
  },
  content_editor: {
    label: 'Content Editor',
    badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    description: 'Manages marketing CMS, blog posts, knowledge base, announcements, and legal documents.',
  },
  support_agent: {
    label: 'Support Agent',
    badge: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    description: 'Assigned to customer tickets, writes internal notes, and assists tenant operators.',
  },
  customer_admin: {
    label: 'Organization Owner',
    badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    description: 'Organization owner/admin with full billing, user management, and workspace rights.',
  },
  customer_user: {
    label: 'Customer Member',
    badge: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    description: 'Standard organization member with app access based on assigned workspace permissions.',
  },
};

export function hasPermission(role: UserRole | string | undefined, permission: Permission): boolean {
  if (!role) return false;
  const userPermissions = ROLE_PERMISSIONS[role as UserRole] || [];
  return userPermissions.includes(permission);
}

export function hasAnyPermission(role: UserRole | string | undefined, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((perm) => hasPermission(role, perm));
}

export function isStaffRole(role: UserRole | string | undefined): boolean {
  return ['super_admin', 'billing_manager', 'content_editor', 'support_agent'].includes(
    (role as string) || '',
  );
}

