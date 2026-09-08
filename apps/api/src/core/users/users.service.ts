import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, userId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: { role: true },
    });
  }

  async invite(tenantId: string, dto: { email: string; firstName: string; lastName: string; roleId?: string }) {
    // In a full implementation, this would send an invitation email
    // and create the user in INVITED status.
    return this.prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        passwordHash: '', // Will be set when user accepts invite
        firstName: dto.firstName,
        lastName: dto.lastName,
        roleId: dto.roleId,
        status: 'INVITED',
      },
    });
  }

  async update(tenantId: string, userId: string, dto: { firstName?: string; lastName?: string; roleId?: string; status?: string }) {
    return this.prisma.user.updateMany({
      where: { id: userId, tenantId },
      data: dto as any,
    });
  }
}
