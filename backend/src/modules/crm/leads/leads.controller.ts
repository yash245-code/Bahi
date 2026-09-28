import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';

@ApiTags('crm')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('crm/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List all leads' })
  findAll(@Req() req: any, @Query('status') status?: string) {
    return this.leadsService.findAll(req.user.tenantId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  create(@Req() req: any, @Body() body: any) {
    return this.leadsService.create(req.user.tenantId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.leadsService.update(req.user.tenantId, id, body);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert a lead to an opportunity' })
  convert(@Req() req: any, @Param('id') id: string) {
    return this.leadsService.convert(req.user.tenantId, id);
  }
}
