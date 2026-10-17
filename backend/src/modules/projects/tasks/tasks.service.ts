import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string) {
    if (!projectId) return [];
    return this.prisma.$queryRaw`SELECT 1`.then(() => []);
  }

  async create(projectId: string, dto: any) {
    return { id: 'task-stub', projectId, ...dto };
  }

  async addTimesheet(taskId: string, dto: { employeeId: string; hours: number; description?: string; date: string; billable?: boolean }) {
    return { id: 'timesheet-stub', taskId, ...dto };
  }
}
