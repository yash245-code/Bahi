import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/core/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findForEntity(tenantId: string, relatedType: string, relatedId: string) {
    return this.prisma.activity.findMany({
      where: { tenantId, relatedType, relatedId },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, userId: string, dto: any) {
    return this.prisma.activity.create({
      data: { tenantId, userId, ...dto },
    });
  }
}
