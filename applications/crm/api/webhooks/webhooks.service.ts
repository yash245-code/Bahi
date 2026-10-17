// ═══════════════════════════════════════════════════════════
// WebhooksService — Inbound Lead Webhook Ingestion & Parsing
// Ingests leads from Meta Ads, Google Ads, IndiaMART, JustDial & Forms
// ═══════════════════════════════════════════════════════════

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly leadsService: LeadsService,
  ) {}

  /**
   * Ingest lead from public hosted web form using public form token.
   */
  async ingestWebForm(token: string, payload: Record<string, any>) {
    const form = await this.prisma.webForm.findUnique({
      where: { publicToken: token },
    });

    if (!form || !form.active) {
      throw new BadRequestException('Form not found or inactive');
    }

    // Honeypot spam check
    if (form.honeypotEnabled && payload['website_hp']) {
      return { status: 'ignored', reason: 'Spam detected' };
    }

    const lead = await this.leadsService.create(
      form.tenantId,
      {
        title: `${payload.name || 'Web Prospect'} — Form Submission`,
        firstName: payload.firstName || (payload.name ? payload.name.split(' ')[0] : 'Web'),
        lastName: payload.lastName || (payload.name ? payload.name.split(' ').slice(1).join(' ') : 'Prospect'),
        companyName: payload.company || payload.organization,
        email: payload.email,
        phone: payload.phone,
        source: `Web Form: ${form.name}`,
        interestNotes: payload.message || payload.comments,
      },
    );

    await this.prisma.webForm.update({
      where: { id: form.id },
      data: { submissionsCount: { increment: 1 } },
    });

    return {
      status: 'success',
      leadId: lead.id,
      redirectUrl: form.redirectUrl,
      message: form.successMessage,
    };
  }

  /**
   * Universal Webhook Ingestion endpoint for advertising channels.
   */
  async ingestChannelWebhook(tenantId: string, channel: 'meta' | 'google' | 'indiamart' | 'justdial', payload: any) {
    let leadTitle = 'Inbound Ad Lead';
    let email = payload.email;
    let phone = payload.phone || payload.mobile;
    let company = payload.company_name || payload.company;
    let notes = '';

    if (channel === 'meta') {
      leadTitle = `Meta Lead: ${payload.leadgen_id || payload.ad_name || 'Campaign'}`;
      notes = `Campaign: ${payload.campaign_name || 'N/A'}, Form: ${payload.form_id || 'N/A'}`;
    } else if (channel === 'indiamart') {
      leadTitle = `IndiaMART Query: ${payload.QUERY_ID || payload.SENDER_NAME}`;
      email = payload.SENDER_EMAIL;
      phone = payload.SENDER_MOBILE;
      company = payload.SENDER_COMPANY;
      notes = `Product Query: ${payload.QUERY_MODID || ''} - ${payload.QUERY_MESSAGE || ''}`;
    } else if (channel === 'google') {
      leadTitle = `Google Ads Lead: ${payload.campaign_id || 'Search'}`;
    }

    return this.leadsService.create(tenantId, {
      title: leadTitle,
      companyName: company,
      email,
      phone,
      source: `${channel.toUpperCase()} Lead Ingestion`,
      score: 75,
      interestNotes: notes,
    });
  }
}
