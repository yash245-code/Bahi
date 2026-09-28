import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async create(tenantId: string, dto: { name: string; description?: string; permissions: string[] }) {
    return this.prisma.role.create({
      data: { tenantId, ...dto },
    });
  }

  async update(tenantId: string, roleId: string, dto: { name?: string; description?: string; permissions?: string[] }) {
    return this.prisma.role.updateMany({
      where: { id: roleId, tenantId },
      data: dto as any,
    });
  }
}
