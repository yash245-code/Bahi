// ═══════════════════════════════════════════════════════════
// Bahi SaaS Platform — Admin Auth, Security & Impersonation Engine
// ═══════════════════════════════════════════════════════════

import { UserRole } from './permissions';

export interface AdminSession {
  adminId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  twoFactorVerified: boolean;
  expiresAt: number; // Unix timestamp
  ipAddress: string;
}

export interface ImpersonationState {
  isImpersonating: boolean;
  originalAdminEmail: string;
  targetUserEmail: string;
  targetUserName: string;
  targetTenantId: string;
  targetTenantName: string;
  startedAt: number;
  expiresAt: number;
}

const ADMIN_SESSION_KEY = 'bahi_admin_session_v1';
const IMPERSONATION_KEY = 'bahi_impersonation_v1';
const FAILED_ATTEMPTS_KEY = 'bahi_admin_failed_attempts';
const MAX_ATTEMPTS = 4;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

// Default super admin for initial access and demonstration
export const DEFAULT_ADMIN: AdminSession = {
  adminId: 'admin-super-001',
  name: 'Aiden Vance',
  email: 'admin@bahi.app',
  role: 'super_admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  twoFactorVerified: true,
  expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
  ipAddress: '192.168.1.100 (Internal Secure Gateway)',
};

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getFailedAttempts(): { count: number; lockedUntil: number } {
  if (typeof window === 'undefined') return { count: 0, lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

export function recordFailedAttempt(): { count: number; lockedUntil: number; isLocked: boolean } {
  const current = getFailedAttempts();
  const newCount = current.count + 1;
  let lockedUntil = current.lockedUntil;

  if (newCount >= MAX_ATTEMPTS) {
    lockedUntil = Date.now() + LOCKOUT_MS;
  }

  const result = { count: newCount, lockedUntil, isLocked: lockedUntil > Date.now() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(result));
  }
  return result;
}

export function resetFailedAttempts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAILED_ATTEMPTS_KEY);
}

// ─── User Impersonation ─────────────────────────────────────

export function getImpersonationState(): ImpersonationState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(IMPERSONATION_KEY);
    if (!raw) return null;
    const state: ImpersonationState = JSON.parse(raw);
    if (Date.now() > state.expiresAt) {
      endImpersonation();
      return null;
    }
    return state;
  } catch {
    return null;
  }
}

export function startImpersonation(
  adminEmail: string,
  targetUser: { email: string; name: string; tenantId: string; tenantName: string },
): ImpersonationState {
  const state: ImpersonationState = {
    isImpersonating: true,
    originalAdminEmail: adminEmail,
    targetUserEmail: targetUser.email,
    targetUserName: targetUser.name,
    targetTenantId: targetUser.tenantId,
    targetTenantName: targetUser.tenantName,
    startedAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour max impersonation window
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(IMPERSONATION_KEY, JSON.stringify(state));
    // Also record audit log event
    recordAuditEntry({
      actor: adminEmail,
      action: 'USER_IMPERSONATION_STARTED',
      target: targetUser.email,
      details: `Started impersonation session for organization "${targetUser.tenantName}"`,
    });
  }

  return state;
}

export function endImpersonation(): void {
  if (typeof window === 'undefined') return;
  const current = getImpersonationState();
  if (current) {
    recordAuditEntry({
      actor: current.originalAdminEmail,
      action: 'USER_IMPERSONATION_ENDED',
      target: current.targetUserEmail,
      details: 'Concluded customer impersonation session',
    });
  }
  localStorage.removeItem(IMPERSONATION_KEY);
}

// ─── Audit Log Store ────────────────────────────────────────

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: string;
}

const AUDIT_KEY = 'bahi_audit_logs_v1';

export function getAuditLogs(): AuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? JSON.parse(raw) : getInitialAuditLogs();
  } catch {
    return getInitialAuditLogs();
  }
}

export function recordAuditEntry(entry: Omit<AuditEntry, 'id' | 'ip' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const existing = getAuditLogs();
  const newEntry: AuditEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ip: '192.168.1.100',
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(AUDIT_KEY, JSON.stringify([newEntry, ...existing.slice(0, 199)]));
}

function getInitialAuditLogs(): AuditEntry[] {
  return [
    {
      id: 'audit-001',
      actor: 'admin@bahi.app',
      action: 'TENANT_TIER_UPGRADE',
      target: 'org-acme-corp',
      details: 'Upgraded tenant "Acme Logistics" to Growth Plan',
      ip: '192.168.1.100',
      timestamp: '2026-11-09T18:42:10Z',
    },
    {
      id: 'audit-002',
      actor: 'admin@bahi.app',
      action: 'ROLE_PERMISSION_MATRIX_UPDATED',
      target: 'Support Agent Role',
      details: 'Granted internal notes editing privilege',
      ip: '192.168.1.100',
      timestamp: '2026-11-08T14:15:30Z',
    },
    {
      id: 'audit-003',
      actor: 'security-daemon',
      action: '2FA_FORCE_ENFORCED',
      target: 'Staff Users (5)',
      details: 'Mandatory TOTP authenticator policy applied',
      ip: '10.0.4.1',
      timestamp: '2026-11-06T09:00:00Z',
    },
  ];
}

