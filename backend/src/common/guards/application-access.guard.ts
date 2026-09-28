import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable, firstValueFrom } from 'rxjs';
import { getApplication, REQUIRE_APPLICATION_KEY } from '@bahi/applications';

@Injectable()
export class ApplicationAccessGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredApp =
      this.reflector.get<string>(REQUIRE_APPLICATION_KEY, context.getHandler()) ||
      this.reflector.get<string>(REQUIRE_APPLICATION_KEY, context.getClass());

    // If no application access is required, allow unconditionally
    if (!requiredApp) {
      return true;
    }

    // Authenticate JWT bearer token
    const res = super.canActivate(context);
    const authenticated =
      res instanceof Observable ? await firstValueFrom(res) : await Promise.resolve(res);
    if (!authenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenant) {
      throw new UnauthorizedException('Authentication and tenant context are required.');
    }

    const manifest = getApplication(requiredApp);
    if (!manifest) {
      throw new NotFoundException(`Application '${requiredApp}' is not registered in the system.`);
    }

    // 1. Verify tenant has this application enabled
    const tenantModules: string[] = user.tenant.enabledModules || [];
    const isEnabled = tenantModules.includes(requiredApp);

    // 2. Verify tenant subscription plan allows this application
    const tenantPlan = String(user.tenant.plan || '').toLowerCase();
    const planAllowed = manifest.plans.includes(tenantPlan as any);

    if (!isEnabled || !planAllowed) {
      throw new ForbiddenException(
        `Access denied: Application '${manifest.name}' is not licensed or enabled for tenant '${user.tenant.name}' on plan tier '${user.tenant.plan}'.`,
      );
    }

    return true;
  }
}

