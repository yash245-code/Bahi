import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('inventory/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  findAll(@Req() req: any) { return this.productsService.findAll(req.user.tenantId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  findOne(@Req() req: any, @Param('id') id: string) { return this.productsService.findOne(req.user.tenantId, id); }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Req() req: any, @Body() body: any) { return this.productsService.create(req.user.tenantId, body); }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.productsService.update(req.user.tenantId, id, body); }
}
