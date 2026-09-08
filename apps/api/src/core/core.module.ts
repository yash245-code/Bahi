// ═══════════════════════════════════════════════════════════
// Core Module — Auth, Tenancy, Users, Roles, Audit, Prisma
// ═══════════════════════════════════════════════════════════

import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { TenancyMiddleware } from './tenancy/tenancy.middleware';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { AuditService } from './audit/audit.service';
import { HealthController } from './health/health.controller';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: { expiresIn: (process.env.JWT_EXPIRATION || '15m') as any },
    }),
  ],
  controllers: [HealthController, AuthController, UsersController, RolesController],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    TenancyMiddleware,
    UsersService,
    RolesService,
    AuditService,
  ],
  exports: [PrismaService, AuthService, AuditService, JwtModule],
})
export class CoreModule {}
