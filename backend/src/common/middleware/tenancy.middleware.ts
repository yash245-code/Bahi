// ═══════════════════════════════════════════════════════════
// Tenancy Middleware — Extracts tenant context from JWT
// and makes it available throughout the request lifecycle.
// ═══════════════════════════════════════════════════════════

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    // The JWT strategy already attaches tenant info to req.user
    // This middleware is a hook point for future tenant-specific
    // logic (e.g., setting Prisma RLS context, rate-limit lookup).
    //
    // For now, it passes through — the real isolation is in the
    // JWT strategy + Prisma queries filtered by tenantId.
    next();
  }
}
