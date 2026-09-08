import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }],
    });
  }

  async create(projectId: string, dto: any) {
    return this.prisma.task.create({ data: { projectId, ...dto } });
  }

  async addTimesheet(taskId: string, dto: { employeeId: string; hours: number; description?: string; date: string; billable?: boolean }) {
    return this.prisma.timesheet.create({
      data: { taskId, ...dto, date: new Date(dto.date) },
    });
  }
}
