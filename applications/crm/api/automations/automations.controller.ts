// ═══════════════════════════════════════════════════════════
// AutomationsController — Workflow Rules & Sequence REST APIs
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import {
  AutomationsService,
  CreateAutomationRuleDto,
  CreateSequenceDto,
} from './automations.service';

@ApiTags('crm-automations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  // ─── Rules ───────────────────────────────────────────────────

  @Get('automations')
  @ApiOperation({ summary: 'List all automation rules' })
  findAllRules(@Req() req: any) {
    return this.automationsService.findAllRules(req.user.tenantId);
  }

  @Get('automations/:id')
  @ApiOperation({ summary: 'Get automation rule by ID' })
  findRule(@Req() req: any, @Param('id') id: string) {
    return this.automationsService.findRuleById(req.user.tenantId, id);
  }

  @Post('automations')
  @ApiOperation({ summary: 'Create a new visual automation rule' })
  createRule(@Req() req: any, @Body() body: CreateAutomationRuleDto) {
    return this.automationsService.createRule(req.user.tenantId, body, req.user.id);
  }

  @Patch('automations/:id')
  @ApiOperation({ summary: 'Update an automation rule' })
  updateRule(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<CreateAutomationRuleDto>,
  ) {
    return this.automationsService.updateRule(req.user.tenantId, id, body);
  }

  @Delete('automations/:id')
  @ApiOperation({ summary: 'Delete an automation rule' })
  deleteRule(@Req() req: any, @Param('id') id: string) {
    return this.automationsService.deleteRule(req.user.tenantId, id);
  }

  @Post('automations/:id/test')
  @ApiOperation({ summary: 'Simulate/test rule conditions against mock payload' })
  testRule(
    @Req() req: any,
    @Param('id') id: string,
    @Body() mockPayload: Record<string, any>,
  ) {
    return this.automationsService.testRule(req.user.tenantId, id, mockPayload);
  }

  // ─── Sequences ───────────────────────────────────────────────

  @Get('sequences')
  @ApiOperation({ summary: 'List all outreach sequences' })
  findAllSequences(@Req() req: any) {
    return this.automationsService.findAllSequences(req.user.tenantId);
  }

  @Post('sequences')
  @ApiOperation({ summary: 'Create a multi-step outreach sequence' })
  createSequence(@Req() req: any, @Body() body: CreateSequenceDto) {
    return this.automationsService.createSequence(req.user.tenantId, body, req.user.id);
  }

  @Patch('sequences/:id')
  @ApiOperation({ summary: 'Update outreach sequence' })
  updateSequence(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<CreateSequenceDto>,
  ) {
    return this.automationsService.updateSequence(req.user.tenantId, id, body);
  }

  @Delete('sequences/:id')
  @ApiOperation({ summary: 'Delete outreach sequence' })
  deleteSequence(@Req() req: any, @Param('id') id: string) {
    return this.automationsService.deleteSequence(req.user.tenantId, id);
  }
}
