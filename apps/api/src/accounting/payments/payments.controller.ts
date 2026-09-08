import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('accounting')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounting/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Record a payment against an invoice' })
  create(@Req() req: any, @Body() body: any) {
    return this.paymentsService.create(req.user.tenantId, body);
  }
}
