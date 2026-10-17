// ═══════════════════════════════════════════════════════════
// CompaniesController — Corporate Accounts REST Endpoints
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
import { CompaniesService, CreateCompanyDto } from './companies.service';

@ApiTags('crm-companies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'List all corporate accounts with aggregated deal volumes' })
  findAll(
    @Req() req: any,
    @Query('industry') industry?: string,
    @Query('tier') tier?: string,
    @Query('ownerId') ownerId?: string,
    @Query('search') search?: string,
  ) {
    return this.companiesService.findAll(req.user.tenantId, {
      industry,
      tier,
      ownerId,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company details with contacts and deals history' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.companiesService.findOne(req.user.tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new corporate account' })
  create(@Req() req: any, @Body() body: CreateCompanyDto) {
    return this.companiesService.create(req.user.tenantId, body, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company details' })
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: Partial<CreateCompanyDto>,
  ) {
    return this.companiesService.update(req.user.tenantId, id, body, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete company' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.companiesService.remove(req.user.tenantId, id, req.user.id);
  }
}
