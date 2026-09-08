import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuotationsService } from './quotations.service';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sales/quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all quotations' })
  findAll(@Req() req: any) {
    return this.quotationsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quotation by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.quotationsService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new quotation' })
  create(@Req() req: any, @Body() body: any) {
    return this.quotationsService.create(req.user.tenantId, body);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm quotation and create a sales order' })
  confirm(@Req() req: any, @Param('id') id: string) {
    return this.quotationsService.confirm(req.user.tenantId, id);
  }
}
