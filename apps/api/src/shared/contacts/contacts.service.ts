import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, type?: string) {
    return this.prisma.contact.findMany({
      where: { tenantId, ...(type ? { type: type as any } : {}) },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.contact.findFirst({ where: { id, tenantId } });
  }

  async create(tenantId: string, dto: any) {
    return this.prisma.contact.create({ data: { tenantId, ...dto } });
  }

  async update(tenantId: string, id: string, dto: any) {
    return this.prisma.contact.updateMany({ where: { id, tenantId }, data: dto });
  }
}
