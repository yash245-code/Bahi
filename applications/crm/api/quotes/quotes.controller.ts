// ═══════════════════════════════════════════════════════════
// QuotesController — Quotation & Customer Portal REST APIs
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { QuotesService, CreateQuoteDto, AcceptQuoteDto } from './quotes.service';

@ApiTags('crm-quotes')
@Controller('crm')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  // ─── Tenant Authenticated Routes ──────────────────────────────

  @Get('quotes')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RequireApplication('crm')
  @ApiOperation({ summary: 'List all quotes for tenant' })
  findAll(@Req() req: any) {
    return this.quotesService.findAll(req.user.tenantId);
  }

  @Get('quotes/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RequireApplication('crm')
  @ApiOperation({ summary: 'Get quote details by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.quotesService.findOne(req.user.tenantId, id);
  }

  @Post('quotes')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RequireApplication('crm')
  @ApiOperation({ summary: 'Create a new quotation' })
  create(@Req() req: any, @Body() body: CreateQuoteDto) {
    return this.quotesService.create(req.user.tenantId, body, req.user.id);
  }

  @Post('deals/:id/generate-quote')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @RequireApplication('crm')
  @ApiOperation({ summary: 'Generate quotation draft directly from deal' })
  generateFromDeal(@Req() req: any, @Param('id') dealId: string) {
    return this.quotesService.createFromDeal(req.user.tenantId, dealId, req.user.id);
  }

  // ─── Public Customer Portal Routes (No JWT required) ─────────

  @Get('portal/quotes/:id')
  @ApiOperation({ summary: 'Customer portal view quotation details' })
  getPublicQuote(@Param('id') id: string) {
    return this.quotesService.getPublicQuote(id);
  }

  @Post('portal/quotes/:id/accept')
  @ApiOperation({ summary: 'Customer portal digital signature & quote acceptance' })
  acceptQuote(@Param('id') id: string, @Body() body: AcceptQuoteDto) {
    return this.quotesService.acceptQuoteOnline(id, body);
  }
}
