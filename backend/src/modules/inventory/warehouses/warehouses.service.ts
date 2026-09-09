import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.warehouse.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });
  }

  async getStockLevels(tenantId: string, productId?: string, warehouseId?: string) {
    // Aggregate stock moves to compute current levels
    const where: any = { tenantId };
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;

    return this.prisma.stockMove.groupBy({
      by: ['productId', 'warehouseId'],
      where,
      _sum: { quantity: true },
    });
  }

  async createStockMove(tenantId: string, dto: any) {
    return this.prisma.stockMove.create({ data: { tenantId, ...dto } });
  }
}
