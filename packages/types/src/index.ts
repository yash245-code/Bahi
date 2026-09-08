// ═══════════════════════════════════════════════════════════
// @bahi/types — Shared type definitions for the Bahi platform
// ═══════════════════════════════════════════════════════════

// ─── API Envelope ──────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    cursor: string | null;
    hasMore: boolean;
    total?: number;
  };
}

// ─── Module System ─────────────────────────────────────────

export enum ModuleCode {
  CORE = 'core',
  CRM = 'crm',
  SALES = 'sales',
  INVENTORY = 'inventory',
  ACCOUNTING = 'accounting',
  HR = 'hr',
  PROJECTS = 'projects',
}

export enum PlanTier {
  STARTER = 'starter',       // CRM + Sales
  GROWTH = 'growth',         // + Inventory + Invoicing
  BUSINESS = 'business',     // + HR + Projects
}

export const PLAN_MODULES: Record<PlanTier, ModuleCode[]> = {
  [PlanTier.STARTER]: [ModuleCode.CORE, ModuleCode.CRM, ModuleCode.SALES],
  [PlanTier.GROWTH]: [
    ModuleCode.CORE,
    ModuleCode.CRM,
    ModuleCode.SALES,
    ModuleCode.INVENTORY,
    ModuleCode.ACCOUNTING,
  ],
  [PlanTier.BUSINESS]: [
    ModuleCode.CORE,
    ModuleCode.CRM,
    ModuleCode.SALES,
    ModuleCode.INVENTORY,
    ModuleCode.ACCOUNTING,
    ModuleCode.HR,
    ModuleCode.PROJECTS,
  ],
};

// ─── Tenant ────────────────────────────────────────────────

export enum TenantStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

export interface TenantContext {
  tenantId: string;
  slug: string;
  plan: PlanTier;
  enabledModules: ModuleCode[];
}

// ─── Auth / User ───────────────────────────────────────────

export enum UserStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  DISABLED = 'disabled',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;       // userId
  tenantId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// ─── Roles & Permissions ───────────────────────────────────

export enum Permission {
  // Core
  MANAGE_TENANT = 'manage:tenant',
  MANAGE_USERS = 'manage:users',
  MANAGE_ROLES = 'manage:roles',

  // CRM
  VIEW_LEADS = 'view:leads',
  MANAGE_LEADS = 'manage:leads',
  VIEW_OPPORTUNITIES = 'view:opportunities',
  MANAGE_OPPORTUNITIES = 'manage:opportunities',

  // Sales
  VIEW_QUOTATIONS = 'view:quotations',
  MANAGE_QUOTATIONS = 'manage:quotations',
  VIEW_ORDERS = 'view:orders',
  MANAGE_ORDERS = 'manage:orders',

  // Inventory
  VIEW_PRODUCTS = 'view:products',
  MANAGE_PRODUCTS = 'manage:products',
  VIEW_STOCK = 'view:stock',
  MANAGE_STOCK = 'manage:stock',

  // Accounting
  VIEW_INVOICES = 'view:invoices',
  MANAGE_INVOICES = 'manage:invoices',
  VIEW_PAYMENTS = 'view:payments',
  MANAGE_PAYMENTS = 'manage:payments',
  VIEW_REPORTS = 'view:reports',

  // HR
  VIEW_EMPLOYEES = 'view:employees',
  MANAGE_EMPLOYEES = 'manage:employees',
  MANAGE_LEAVE = 'manage:leave',
  VIEW_ATTENDANCE = 'view:attendance',

  // Projects
  VIEW_PROJECTS = 'view:projects',
  MANAGE_PROJECTS = 'manage:projects',
  VIEW_TIMESHEETS = 'view:timesheets',
  MANAGE_TIMESHEETS = 'manage:timesheets',
}

// ─── Contact (Shared Party Model) ─────────────────────────

export enum ContactType {
  LEAD = 'lead',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  EMPLOYEE = 'employee',
}

export interface ContactDto {
  id: string;
  tenantId: string;
  type: ContactType;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity (Polymorphic) ────────────────────────────────

export enum ActivityType {
  NOTE = 'note',
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
}

export interface ActivityDto {
  id: string;
  tenantId: string;
  type: ActivityType;
  relatedType: string;    // e.g. 'lead', 'opportunity', 'invoice'
  relatedId: string;
  summary: string;
  body?: string;
  userId: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

// ─── Audit Log ─────────────────────────────────────────────

export interface AuditLogDto {
  id: string;
  tenantId: string;
  userId: string;
  action: string;        // 'create' | 'update' | 'delete'
  entityType: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  createdAt: string;
}
