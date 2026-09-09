import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return this.prisma.project.findFirst({
      where: { id, tenantId },
      include: { tasks: true },
    });
  }

  async create(tenantId: string, dto: any) {
    return this.prisma.project.create({ data: { tenantId, ...dto } });
  }
}
