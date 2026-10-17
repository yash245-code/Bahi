// ═══════════════════════════════════════════════════════════
// ImpexController — Import, Export & Deduplication REST APIs
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import {
  ImpexService,
  ImportPreviewDto,
  ExecuteImportDto,
  MergeRecordsDto,
} from './impex.service';

@ApiTags('crm-impex')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/data')
export class ImpexController {
  constructor(private readonly impexService: ImpexService) {}

  @Post('import/preview')
  @ApiOperation({ summary: 'Preview CSV structure and auto-suggest field mappings' })
  previewImport(@Body() body: ImportPreviewDto) {
    return this.impexService.previewImport(body);
  }

  @Post('import/execute')
  @ApiOperation({ summary: 'Execute CSV import with selected mapping and duplicate handling' })
  executeImport(@Req() req: any, @Body() body: ExecuteImportDto) {
    return this.impexService.executeImport(req.user.tenantId, req.user.id, body);
  }

  @Get('export/:entity')
  @ApiOperation({ summary: 'Export entity data as CSV' })
  async exportData(
    @Req() req: any,
    @Param('entity') entity: string,
    @Query('columns') columns?: string,
  ) {
    const columnList = columns ? columns.split(',').map((c) => c.trim()) : undefined;
    return this.impexService.exportData(req.user.tenantId, entity, columnList);
  }

  @Get('duplicates/:entity')
  @ApiOperation({ summary: 'Scan for duplicate contacts or companies' })
  scanDuplicates(
    @Req() req: any,
    @Param('entity') entity: 'contact' | 'company',
  ) {
    return this.impexService.scanDuplicates(req.user.tenantId, entity);
  }

  @Post('duplicates/merge')
  @ApiOperation({ summary: 'Merge duplicate records with field choice and re-link relations' })
  mergeRecords(@Req() req: any, @Body() body: MergeRecordsDto) {
    return this.impexService.mergeRecords(req.user.tenantId, body);
  }
}
