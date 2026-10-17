// ═══════════════════════════════════════════════════════════
// ApprovalsController — Deal Approvals & Sales Goals REST APIs
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
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
  ApprovalsService,
  CreateApprovalDto,
  DecideApprovalDto,
  CreateGoalDto,
} from './approvals.service';

@ApiTags('crm-approvals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  // ─── Approvals ───────────────────────────────────────────────

  @Get('approvals')
  @ApiOperation({ summary: 'List deal approvals' })
  findAllApprovals(
    @Req() req: any,
    @Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED',
  ) {
    return this.approvalsService.findAllApprovals(req.user.tenantId, status);
  }

  @Post('approvals')
  @ApiOperation({ summary: 'Request deal exception approval (discount or deal value)' })
  createApproval(@Req() req: any, @Body() body: CreateApprovalDto) {
    return this.approvalsService.createApproval(req.user.tenantId, req.user.id, body);
  }

  @Post('approvals/:id/decide')
  @ApiOperation({ summary: 'Approve or reject deal approval request' })
  decideApproval(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: DecideApprovalDto,
  ) {
    return this.approvalsService.decideApproval(req.user.tenantId, id, req.user.id, body);
  }

  // ─── Goals ───────────────────────────────────────────────────

  @Get('goals')
  @ApiOperation({ summary: 'List sales goals and quota progress' })
  findAllGoals(@Req() req: any) {
    return this.approvalsService.findAllGoals(req.user.tenantId);
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create new sales goal / quota target' })
  createGoal(@Req() req: any, @Body() body: CreateGoalDto) {
    return this.approvalsService.createGoal(req.user.tenantId, body);
  }

  @Post('goals/:id/recalculate')
  @ApiOperation({ summary: 'Recalculate progress and attainment percentage for goal' })
  recalculateGoal(@Req() req: any, @Param('id') id: string) {
    return this.approvalsService.recalculateGoalProgress(req.user.tenantId, id);
  }
}
