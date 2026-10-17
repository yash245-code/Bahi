// ═══════════════════════════════════════════════════════════
// LeadsController — Inbound Lead Management REST Endpoints
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
import { LeadsService, CreateLeadDto, UpdateLeadDto, ConvertLeadDto } from './leads.service';

@ApiTags('crm-leads')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List all leads for tenant with filters' })
  findAll(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('rating') rating?: string,
    @Query('source') source?: string,
    @Query('ownerId') ownerId?: string,
    @Query('search') search?: string,
  ) {
    return this.leadsService.findAll(req.user.tenantId, {
      status,
      rating,
      source,
      ownerId,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Capture a new inbound lead' })
  create(@Req() req: any, @Body() body: CreateLeadDto) {
    return this.leadsService.create(req.user.tenantId, body, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead status, score, or metadata' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateLeadDto) {
    return this.leadsService.update(req.user.tenantId, id, body, req.user.id);
  }

  @Post(':id/disqualify')
  @ApiOperation({ summary: 'Disqualify a lead with a reason' })
  disqualify(@Req() req: any, @Param('id') id: string, @Body('reason') reason: string) {
    return this.leadsService.disqualify(req.user.tenantId, id, reason, req.user.id);
  }

  @Post(':id/recycle')
  @ApiOperation({ summary: 'Recycle disqualified lead back to nurture' })
  recycle(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.recycle(req.user.tenantId, id, req.user.id);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: '1-click convert lead to Contact + Company + Opportunity' })
  convert(@Req() req: any, @Param('id') id: string, @Body() body: ConvertLeadDto) {
    return this.leadsService.convert(req.user.tenantId, id, body, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete lead' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.remove(req.user.tenantId, id, req.user.id);
  }

  @Post('bulk/assign')
  @ApiOperation({ summary: 'Bulk reassign leads to a sales rep' })
  bulkAssign(@Req() req: any, @Body() body: { ids: string[]; ownerId: string }) {
    return this.leadsService.bulkAssign(req.user.tenantId, body.ids, body.ownerId, req.user.id);
  }

  @Post('bulk/status')
  @ApiOperation({ summary: 'Bulk update status for selected leads' })
  bulkStatus(@Req() req: any, @Body() body: { ids: string[]; status: any }) {
    return this.leadsService.bulkUpdateStatus(req.user.tenantId, body.ids, body.status, req.user.id);
  }
}
