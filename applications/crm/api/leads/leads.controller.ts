import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { LeadsService } from './leads.service';

@ApiTags('crm')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List all leads for tenant' })
  findAll(@Req() req: any, @Query('status') status?: string) {
    return this.leadsService.findAll(req.user.tenantId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Capture a new lead' })
  create(@Req() req: any, @Body() body: any) {
    return this.leadsService.create(req.user.tenantId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead details or status' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.leadsService.update(req.user.tenantId, id, body);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert a lead into an opportunity and customer contact' })
  convert(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.convert(req.user.tenantId, id);
  }
}
