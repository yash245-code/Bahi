import { Controller, Get, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';

@ApiTags('crm')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('crm')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get('pipelines')
  @ApiOperation({ summary: 'Get pipeline stages with opportunities' })
  getPipelines(@Req() req: any) {
    return this.opportunitiesService.getPipelineStages(req.user.tenantId);
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'List opportunities, optionally filtered by stage' })
  findAll(@Req() req: any, @Query('stage') stage?: string) {
    return this.opportunitiesService.findAll(req.user.tenantId, stage);
  }

  @Patch('opportunities/:id/stage')
  @ApiOperation({ summary: 'Move an opportunity to a different pipeline stage' })
  updateStage(@Req() req: any, @Param('id') id: string, @Body() body: { stageId: string }) {
    return this.opportunitiesService.updateStage(req.user.tenantId, id, body.stageId);
  }
}
