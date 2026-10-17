// ═══════════════════════════════════════════════════════════
// CustomFieldsController — Custom Field Attribute Endpoints
// ═══════════════════════════════════════════════════════════

import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { CustomFieldsService, CreateCustomFieldDto } from './custom-fields.service';

@ApiTags('crm-custom-fields')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Get()
  @ApiOperation({ summary: 'List custom field definitions for entity type' })
  findAll(@Req() req: any, @Query('entityType') entityType?: string) {
    return this.customFieldsService.findAll(req.user.tenantId, entityType);
  }

  @Post()
  @ApiOperation({ summary: 'Define new tenant custom field' })
  create(@Req() req: any, @Body() body: CreateCustomFieldDto) {
    return this.customFieldsService.create(req.user.tenantId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete custom field definition' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.customFieldsService.remove(req.user.tenantId, id);
  }
}
