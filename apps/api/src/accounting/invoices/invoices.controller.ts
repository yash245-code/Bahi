import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';

@ApiTags('accounting')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounting/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  findAll(@Req() req: any) { return this.invoicesService.findAll(req.user.tenantId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by ID' })
  findOne(@Req() req: any, @Param('id') id: string) { return this.invoicesService.findOne(req.user.tenantId, id); }

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  create(@Req() req: any, @Body() body: any) { return this.invoicesService.create(req.user.tenantId, body); }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send an invoice to the customer' })
  send(@Req() req: any, @Param('id') id: string) { return this.invoicesService.send(req.user.tenantId, id); }
}
