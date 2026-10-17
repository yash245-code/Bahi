// ═══════════════════════════════════════════════════════════
// OpportunitiesController — Deal Pipeline REST Endpoints
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
import {
  OpportunitiesService,
  CreateDealDto,
  UpdateDealDto,
} from './opportunities.service';

@ApiTags('crm-opportunities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get('board')
  @ApiOperation({ summary: 'Get visual Kanban board for pipeline with rotting and weighted metrics' })
  getBoard(@Req() req: any, @Query('pipelineId') pipelineId?: string) {
    return this.opportunitiesService.getPipelineBoard(req.user.tenantId, pipelineId);
  }

  @Get()
  @ApiOperation({ summary: 'List deals with optional filtering' })
  findAll(
    @Req() req: any,
    @Query('pipelineId') pipelineId?: string,
    @Query('stageId') stageId?: string,
    @Query('ownerId') ownerId?: string,
    @Query('forecastCategory') forecastCategory?: string,
    @Query('search') search?: string,
  ) {
    return this.opportunitiesService.findAll(req.user.tenantId, {
      pipelineId,
      stageId,
      ownerId,
      forecastCategory,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal details including line items, stage history, and contacts' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.opportunitiesService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity / deal' })
  create(@Req() req: any, @Body() body: CreateDealDto) {
    return this.opportunitiesService.create(req.user.tenantId, body, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deal metadata' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateDealDto) {
    return this.opportunitiesService.update(req.user.tenantId, id, body, req.user.id);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Move deal to a new stage (Kanban drag-and-drop)' })
  updateStage(
    @Req() req: any,
    @Param('id') id: string,
    @Body('stageId') stageId: string,
  ) {
    return this.opportunitiesService.updateStage(req.user.tenantId, id, stageId, req.user.id);
  }

  @Post(':id/won')
  @ApiOperation({ summary: 'Mark deal won with reason' })
  markWon(@Req() req: any, @Param('id') id: string, @Body('reason') reason?: string) {
    return this.opportunitiesService.markWon(req.user.tenantId, id, reason, req.user.id);
  }

  @Post(':id/lost')
  @ApiOperation({ summary: 'Mark deal lost with reason' })
  markLost(@Req() req: any, @Param('id') id: string, @Body('reason') reason: string) {
    return this.opportunitiesService.markLost(req.user.tenantId, id, reason, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete deal' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.opportunitiesService.remove(req.user.tenantId, id, req.user.id);
  }
}
