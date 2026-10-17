// ═══════════════════════════════════════════════════════════
// Shared Module — Contacts, Activities, Attachments, Event Bus
// Cross-cutting entities used by every domain module.
// ═══════════════════════════════════════════════════════════

import { Module, Global } from '@nestjs/common';
import { ContactsController } from './contacts/contacts.controller';
import { ContactsService } from './contacts/contacts.service';
import { ActivitiesController } from './activities/activities.controller';
import { ActivitiesService } from './activities/activities.service';
import { EventBusService } from './events/event-bus.service';

@Global()
@Module({
  controllers: [ContactsController, ActivitiesController],
  providers: [ContactsService, ActivitiesService, EventBusService],
  exports: [ContactsService, ActivitiesService, EventBusService],
})
export class SharedModule {}
