// ═══════════════════════════════════════════════════════════
// Shared Module — Contacts, Activities, Attachments
// Cross-cutting entities used by every domain module.
// ═══════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';
import { ActivitiesController } from './activities/activities.controller';
import { ActivitiesService } from './activities/activities.service';

@Module({
  controllers: [ContactsController, ActivitiesController],
  providers: [ContactsService, ActivitiesService],
  exports: [ContactsService, ActivitiesService],
})
export class SharedModule {}
