// ═══════════════════════════════════════════════════════════
// CrmModule — Root NestJS Module for Bahi CRM Vertical Slice
// ═══════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { CrmEventBus } from './common/events';
import { LeadsController } from './leads/leads.controller';
import { LeadsService } from './leads/leads.service';
import { OpportunitiesController } from './opportunities/opportunities.controller';
import { OpportunitiesService } from './opportunities/opportunities.service';
import { PipelinesController } from './pipelines/pipelines.controller';
import { PipelinesService } from './pipelines/pipelines.service';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';
import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';
import { ActivitiesController } from './activities/activities.controller';
import { ActivitiesService } from './activities/activities.service';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { CustomFieldsController } from './custom-fields/custom-fields.controller';
import { CustomFieldsService } from './custom-fields/custom-fields.service';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksService } from './webhooks/webhooks.service';
import { AutomationsController } from './automations/automations.controller';
import { AutomationsService } from './automations/automations.service';
import { ScoringController } from './scoring/scoring.controller';
import { ScoringService } from './scoring/scoring.service';
import { ImpexController } from './impex/impex.controller';
import { ImpexService } from './impex/impex.service';
import { QuotesController } from './quotes/quotes.controller';
import { QuotesService } from './quotes/quotes.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { ApprovalsController } from './approvals/approvals.controller';
import { ApprovalsService } from './approvals/approvals.service';

@Module({
  controllers: [
    LeadsController,
    OpportunitiesController,
    PipelinesController,
    CompaniesController,
    ContactsController,
    ActivitiesController,
    AnalyticsController,
    CustomFieldsController,
    WebhooksController,
    AutomationsController,
    ScoringController,
    ImpexController,
    QuotesController,
    SearchController,
    ApprovalsController,
  ],
  providers: [
    CrmEventBus,
    LeadsService,
    OpportunitiesService,
    PipelinesService,
    CompaniesService,
    ContactsService,
    ActivitiesService,
    AnalyticsService,
    CustomFieldsService,
    WebhooksService,
    AutomationsService,
    ScoringService,
    ImpexService,
    QuotesService,
    SearchService,
    ApprovalsService,
  ],
  exports: [
    CrmEventBus,
    LeadsService,
    OpportunitiesService,
    PipelinesService,
    CompaniesService,
    ContactsService,
    ActivitiesService,
    AnalyticsService,
    CustomFieldsService,
    WebhooksService,
    AutomationsService,
    ScoringService,
    ImpexService,
    QuotesService,
    SearchService,
    ApprovalsService,
  ],
})
export class CrmModule {}
