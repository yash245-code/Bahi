// ═══════════════════════════════════════════════════════════
// Permissions Decorator — Attaches permission requirements to routes
// ═══════════════════════════════════════════════════════════

import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
