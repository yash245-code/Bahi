// ═══════════════════════════════════════════════════════════
// Permissions Guard — Evaluates user permissions & RBAC rules
// ═══════════════════════════════════════════════════════════

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Role permissions list
    const userPermissions: string[] = user.role?.permissions || [];

    // Owner role or wildcard bypass
    if (user.role?.name === 'Owner' || userPermissions.includes('*')) {
      return true;
    }

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permissions: Requires [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
