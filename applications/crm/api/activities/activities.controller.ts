// ═══════════════════════════════════════════════════════════
// ActivitiesController — Activity Timeline & Task Queue REST Endpoints
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { ActivitiesService, CreateActivityDto } from './activities.service';

@ApiTags('crm-activities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks, calls, meetings with today/overdue/upcoming filtering' })
  findAll(
    @Req() req: any,
    @Query('view') view?: 'today' | 'overdue' | 'upcoming' | 'completed' | 'all',
    @Query('type') type?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('relatedType') relatedType?: string,
    @Query('relatedId') relatedId?: string,
  ) {
    return this.activitiesService.findAll(req.user.tenantId, {
      view,
      type,
      assigneeId,
      relatedType,
      relatedId,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity details' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.activitiesService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Log a call, meeting, note, or schedule a task' })
  create(@Req() req: any, @Body() body: CreateActivityDto) {
    return this.activitiesService.create(req.user.tenantId, body, req.user.id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark task or activity complete with outcome notes' })
  complete(@Req() req: any, @Param('id') id: string, @Body('outcome') outcome?: string) {
    return this.activitiesService.complete(req.user.tenantId, id, outcome);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete activity' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.activitiesService.remove(req.user.tenantId, id);
  }
}
