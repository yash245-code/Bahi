import { Module } from '@nestjs/common';
import { QuotationsController } from './quotations/quotations.controller';
import { QuotationsService } from './quotations/quotations.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';

@Module({
  controllers: [QuotationsController, OrdersController],
  providers: [QuotationsService, OrdersService],
  exports: [QuotationsService, OrdersService],
})
export class SalesModule {}
