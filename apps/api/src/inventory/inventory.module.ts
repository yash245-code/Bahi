import { Module } from '@nestjs/common';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { WarehousesController } from './warehouses/warehouses.controller';
import { WarehousesService } from './warehouses/warehouses.service';

@Module({
  controllers: [ProductsController, WarehousesController],
  providers: [ProductsService, WarehousesService],
  exports: [ProductsService, WarehousesService],
})
export class InventoryModule {}
