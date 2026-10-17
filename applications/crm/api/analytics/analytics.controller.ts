// ═══════════════════════════════════════════════════════════
// AnalyticsController — Revenue Telemetry & Forecasting REST Endpoints
// ═══════════════════════════════════════════════════════════

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { AnalyticsService } from './analytics.service';

@ApiTags('crm-analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get executive CRM telemetry, conversion ratios and forecast' })
  getMetrics(@Req() req: any) {
    return this.analyticsService.getExecutiveMetrics(req.user.tenantId);
  }
}
