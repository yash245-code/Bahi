import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks in a project' })
  findAll(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task in a project' })
  create(@Param('projectId') projectId: string, @Body() body: any) {
    return this.tasksService.create(projectId, body);
  }

  @Post(':taskId/timesheets')
  @ApiOperation({ summary: 'Log time on a task' })
  addTimesheet(@Param('taskId') taskId: string, @Body() body: any) {
    return this.tasksService.addTimesheet(taskId, body);
  }
}
