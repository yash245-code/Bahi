import { Controller, Get, Post, Query, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inventory')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get('warehouses')
  @ApiOperation({ summary: 'List all warehouses' })
  findAll(@Req() req: any) { return this.warehousesService.findAll(req.user.tenantId); }

  @Get('stock-levels')
  @ApiOperation({ summary: 'Get stock levels per product/warehouse' })
  stockLevels(@Req() req: any, @Query('product_id') productId?: string, @Query('warehouse_id') warehouseId?: string) {
    return this.warehousesService.getStockLevels(req.user.tenantId, productId, warehouseId);
  }

  @Post('stock-moves')
  @ApiOperation({ summary: 'Create a stock move (receive/ship/transfer)' })
  createStockMove(@Req() req: any, @Body() body: any) {
    return this.warehousesService.createStockMove(req.user.tenantId, body);
  }
}
