import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sales/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all sales orders' })
  findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sales order by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.tenantId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update sales order status' })
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(req.user.tenantId, id, body.status);
  }
}
