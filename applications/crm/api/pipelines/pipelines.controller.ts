// ═══════════════════════════════════════════════════════════
// PipelinesController — Pipeline Configuration Endpoints
// ═══════════════════════════════════════════════════════════

import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { PipelinesService } from './pipelines.service';

@ApiTags('crm-pipelines')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  @ApiOperation({ summary: 'List all pipelines and configured stages' })
  findAll(@Req() req: any) {
    return this.pipelinesService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific pipeline with stages' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.pipelinesService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sales pipeline with custom stages' })
  create(@Req() req: any, @Body() body: any) {
    return this.pipelinesService.create(req.user.tenantId, body);
  }

  @Patch('stages/:stageId')
  @ApiOperation({ summary: 'Update stage configuration (probability, rotting days, color)' })
  updateStage(
    @Req() req: any,
    @Param('stageId') stageId: string,
    @Body() body: any,
  ) {
    return this.pipelinesService.updateStage(req.user.tenantId, stageId, body);
  }
}
