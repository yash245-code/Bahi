import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    return this.prisma.leaveRequest.create({ data: { tenantId, ...dto } });
  }

  async approve(tenantId: string, id: string, approvedBy: string) {
    return this.prisma.leaveRequest.updateMany({
      where: { id, tenantId },
      data: { status: 'APPROVED', approvedBy },
    });
  }

  async findAll(tenantId: string, employeeId?: string) {
    return this.prisma.leaveRequest.findMany({
      where: { tenantId, ...(employeeId ? { employeeId } : {}) },
      include: { employee: { include: { contact: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
