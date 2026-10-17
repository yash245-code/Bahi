// ═══════════════════════════════════════════════════════════
// ScoringController — Lead Scoring & Distribution REST APIs
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { ScoringService, AssignmentStrategy } from './scoring.service';

@ApiTags('crm-scoring')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('leads/:id/calculate')
  @ApiOperation({ summary: 'Recalculate score and rating for lead' })
  calculateScore(@Req() req: any, @Param('id') id: string) {
    return this.scoringService.calculateAndApplyScore(req.user.tenantId, id);
  }

  @Post('leads/:id/assign')
  @ApiOperation({ summary: 'Auto-assign lead using strategy (ROUND_ROBIN or LOAD_BASED)' })
  assignLead(
    @Req() req: any,
    @Param('id') id: string,
    @Query('strategy') strategy?: AssignmentStrategy,
  ) {
    return this.scoringService.assignLead(req.user.tenantId, id, strategy);
  }

  @Post('reassign-untouched')
  @ApiOperation({ summary: 'Reassign stale untouched leads' })
  reassignUntouched(
    @Req() req: any,
    @Query('days') days?: number,
  ) {
    return this.scoringService.reassignUntouchedLeads(req.user.tenantId, days ? Number(days) : 3);
  }
}
