import { Controller, Get, Post, Query, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get activities for any entity (polymorphic)' })
  findForEntity(
    @Req() req: any,
    @Query('related_type') relatedType: string,
    @Query('related_id') relatedId: string,
  ) {
    return this.activitiesService.findForEntity(req.user.tenantId, relatedType, relatedId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an activity entry' })
  create(@Req() req: any, @Body() body: any) {
    return this.activitiesService.create(req.user.tenantId, req.user.userId, body);
  }
}
