// ═══════════════════════════════════════════════════════════
// WebhooksController — Public Form Submissions & Channel Webhooks
// ═══════════════════════════════════════════════════════════

import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('crm-webhooks')
@Controller('crm/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('form/:token')
  @ApiOperation({ summary: 'Public submission receiver for embedded lead forms' })
  submitForm(@Param('token') token: string, @Body() body: any) {
    return this.webhooksService.ingestWebForm(token, body);
  }

  @Post(':tenantId/:channel')
  @ApiOperation({ summary: 'Advertising channel webhook receiver (Meta, Google, IndiaMART)' })
  channelWebhook(
    @Param('tenantId') tenantId: string,
    @Param('channel') channel: 'meta' | 'google' | 'indiamart' | 'justdial',
    @Body() body: any,
  ) {
    return this.webhooksService.ingestChannelWebhook(tenantId, channel, body);
  }
}
