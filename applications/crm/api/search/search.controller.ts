// ═══════════════════════════════════════════════════════════
// SearchController — Global Omnibar Search Endpoint
// ═══════════════════════════════════════════════════════════

import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequireApplication } from '@bahi/types';
import { SearchService } from './search.service';

@ApiTags('crm-search')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@RequireApplication('crm')
@Controller('crm/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global Omnibar search across leads, contacts, accounts, deals, and tasks' })
  search(
    @Req() req: any,
    @Query('q') q: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.globalSearch(
      req.user.tenantId,
      q,
      limit ? Number(limit) : 5,
    );
  }
}
