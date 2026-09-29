import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { OpportunitiesService } from './opportunities.service';

@ApiTags('crm')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get('pipelines')
  @ApiOperation({ summary: 'Get all pipeline stages with active opportunities' })
  getPipelines(@Req() req: any) {
    return this.opportunitiesService.getPipelineStages(req.user.tenantId);
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'List opportunities, optionally filtered by stage' })
  findAll(@Req() req: any, @Query('stage') stage?: string) {
    return this.opportunitiesService.findAll(req.user.tenantId, stage);
  }

  @Get('opportunities/:id')
  @ApiOperation({ summary: 'Get single opportunity by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.opportunitiesService.findOne(req.user.tenantId, id);
  }

  @Post('opportunities')
  @ApiOperation({ summary: 'Create a new opportunity / deal' })
  create(@Req() req: any, @Body() body: any) {
    return this.opportunitiesService.create(req.user.tenantId, body);
  }

  @Patch('opportunities/:id/stage')
  @ApiOperation({ summary: 'Move an opportunity to a different pipeline stage' })
  updateStage(@Req() req: any, @Param('id') id: string, @Body() body: { stageId: string }) {
    return this.opportunitiesService.updateStage(req.user.tenantId, id, body.stageId);
  }

  @Patch('opportunities/:id')
  @ApiOperation({ summary: 'Update opportunity attributes' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.opportunitiesService.update(req.user.tenantId, id, body);
  }
}
