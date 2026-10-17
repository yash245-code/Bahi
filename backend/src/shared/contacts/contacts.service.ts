import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/core/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, lifecycleStage?: string) {
    return this.prisma.contact.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(lifecycleStage ? { lifecycleStage: lifecycleStage as any } : {}),
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.contact.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  async create(tenantId: string, dto: any) {
    return this.prisma.contact.create({ data: { tenantId, ...dto } });
  }

  async update(tenantId: string, id: string, dto: any) {
    return this.prisma.contact.updateMany({ where: { id, tenantId }, data: dto });
  }
}
