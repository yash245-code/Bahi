// ═══════════════════════════════════════════════════════════
// AuthService — Tenant Onboarding, Login, Tokens & Session
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
   * Complete Tenant Onboarding:
   * Creates Tenant, Roles, Default Pipeline & Stages, Sources,
   * Lost Reasons, and the Owner User.
   */
  async register(dto: {
    tenantName: string;
    tenantSlug: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    currency?: string;
    timezone?: string;
  }) {
    const existing = await this.prisma.tenant.findUnique({
      where: { slug: dto.tenantSlug },
    });
    if (existing) {
      throw new ConflictException('Tenant slug is already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.tenantName,
          slug: dto.tenantSlug,
          plan: 'STARTER',
          status: 'TRIAL',
          enabledModules: ['core', 'crm', 'sales'],
          currency: dto.currency || 'USD',
          timezone: dto.timezone || 'UTC',
        },
      });

      // 2. Provision Roles
      const ownerRole = await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: 'Owner',
          description: 'Full administrative access and subscription owner',
          permissions: ['*'],
          isDefault: false,
        },
      });

      await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: 'Sales Rep',
          description: 'Standard quota-carrying sales representative',
          permissions: [
            'view:leads', 'manage:leads', 'view:contacts', 'manage:contacts',
            'view:companies', 'manage:companies', 'view:opportunities', 'manage:opportunities',
            'view:activities', 'manage:activities',
          ],
          isDefault: true,
        },
      });

      // 3. Provision Default Pipeline & Stages
      const defaultPipeline = await tx.pipeline.create({
        data: {
          tenantId: tenant.id,
          name: 'Standard Sales Pipeline',
          isDefault: true,
          order: 1,
          active: true,
        },
      });

      const defaultStages = [
        { name: 'New Inbound', order: 1, color: '#75766E', defaultProbability: 20, rottingDays: 7, stageType: 'OPEN' as const },
        { name: 'Discovery & Qualified', order: 2, color: '#3B82F6', defaultProbability: 40, rottingDays: 10, stageType: 'OPEN' as const },
        { name: 'Demo & Presentation', order: 3, color: '#8B5CF6', defaultProbability: 60, rottingDays: 14, stageType: 'OPEN' as const },
        { name: 'Proposal Sent', order: 4, color: '#D97706', defaultProbability: 75, rottingDays: 10, stageType: 'OPEN' as const },
        { name: 'Contract Negotiation', order: 5, color: '#A8462F', defaultProbability: 90, rottingDays: 7, stageType: 'OPEN' as const },
        { name: 'Closed Won', order: 6, color: '#1F7A4D', defaultProbability: 100, rottingDays: 0, stageType: 'WON' as const },
        { name: 'Closed Lost', order: 7, color: '#B23A2E', defaultProbability: 0, rottingDays: 0, stageType: 'LOST' as const },
      ];

      for (const s of defaultStages) {
        await tx.pipelineStage.create({
          data: {
            tenantId: tenant.id,
            pipelineId: defaultPipeline.id,
            name: s.name,
            order: s.order,
            color: s.color,
            defaultProbability: s.defaultProbability,
            rottingDays: s.rottingDays,
            stageType: s.stageType,
          },
        });
      }

      // 4. Provision Default Lead Sources
      const sources = ['Inbound Website', 'Google Ads', 'Partner Referral', 'Outbound Prospecting'];
      for (const src of sources) {
        await tx.leadSource.create({
          data: { tenantId: tenant.id, name: src },
        });
      }

      // 5. Provision Default Lost Reasons
      const lostReasons = ['Budget Constraints', 'Competitor Chosen', 'Feature Gap', 'Timing / Postponed'];
      for (const r of lostReasons) {
        await tx.lostReason.create({
          data: { tenantId: tenant.id, reason: r },
        });
      }

      // 6. Create Owner User
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          roleId: ownerRole.id,
          status: 'ACTIVE',
        },
      });

      return { tenant, user };
    });

    const tokens = this.generateTokens(result.user.id, result.tenant.id, result.user.email, 'Owner');
    return { tenant: result.tenant, user: result.user, ...tokens };
  }

  /**
   * Authenticate user by email + password within a tenant.
   */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, status: 'ACTIVE', deletedAt: null },
      include: { role: true, tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const roleName = user.role?.name ?? 'Member';
    const tokens = this.generateTokens(user.id, user.tenantId, user.email, roleName);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: roleName,
        tenantId: user.tenantId,
        avatarUrl: user.avatarUrl,
      },
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
        plan: user.tenant.plan,
        currency: user.tenant.currency,
        timezone: user.tenant.timezone,
        enabledModules: user.tenant.enabledModules,
      },
      ...tokens,
    };
  }

  /**
   * Refresh JWT access token with a valid refresh token.
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'bahi-jwt-refresh-development-secret-key-at-least-64-characters-long-12345678',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User not found or inactive');
      }

      const roleName = user.role?.name ?? 'Member';
      return this.generateTokens(user.id, user.tenantId, user.email, roleName);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(userId: string, tenantId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      tenantId,
      email,
      role,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET || 'bahi-jwt-development-secret-key-at-least-64-characters-long-12345678',
      expiresIn: '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'bahi-jwt-refresh-development-secret-key-at-least-64-characters-long-12345678',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
