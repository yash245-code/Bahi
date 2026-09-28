// ═══════════════════════════════════════════════════════════
// AuthService — Registration, login, token management
// ═══════════════════════════════════════════════════════════

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Register a new tenant with its first admin user.
   */
  async register(dto: {
    tenantName: string;
    tenantSlug: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Check slug uniqueness
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });
    if (existing) {
      throw new ConflictException('Tenant slug already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create tenant + admin role + first user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          slug: dto.tenantSlug,
          plan: 'STARTER',
          status: 'TRIAL',
          enabledModules: ['core', 'crm', 'sales'],
        },
      });

      const adminRole = await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: 'Admin',
          description: 'Full access to all modules',
          permissions: [
            'manage:tenant', 'manage:users', 'manage:roles',
            'view:leads', 'manage:leads', 'view:opportunities', 'manage:opportunities',
            'view:quotations', 'manage:quotations', 'view:orders', 'manage:orders',
          ],
        },
      });

      // Default pipeline stages
      const stages = [
        { name: 'New', order: 1 },
        { name: 'Qualified', order: 2 },
        { name: 'Proposal', order: 3 },
        { name: 'Negotiation', order: 4 },
        { name: 'Won', order: 5 },
        { name: 'Lost', order: 6 },
      ];
      for (const s of stages) {
        await tx.pipelineStage.create({
          data: { tenantId: tenant.id, ...s },
        });
      }

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          roleId: adminRole.id,
          status: 'ACTIVE',
        },
      });

      return { tenant, user };
    });

    const tokens = this.generateTokens(result.user.id, result.tenant.id, result.user.email, 'Admin');

    return { tenant: result.tenant, user: result.user, ...tokens };
  }

  /**
   * Authenticate user by email + password within a tenant.
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, status: 'ACTIVE' },
      include: { role: true, tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = this.generateTokens(
      user.id,
      user.tenantId,
      user.email,
      user.role?.name || 'Member',
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role?.name,
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        plan: user.tenant.plan,
        enabledModules: user.tenant.enabledModules,
      },
      ...tokens,
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      });
      const tokens = this.generateTokens(
        payload.sub,
        payload.tenantId,
        payload.email,
        payload.role,
      );
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(userId: string, tenantId: string, email: string, role: string) {
    const payload = { sub: userId, tenantId, email, role };

    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
    });

    return { accessToken, refreshToken };
  }
}
