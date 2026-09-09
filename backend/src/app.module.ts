// ═══════════════════════════════════════════════════════════
// Bahi API — Root Application Module
// Assembles all domain modules into a modular monolith.
// ═══════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './shared/shared.module';
import { CrmModule } from './modules/crm/crm.module';
import { SalesModule } from './modules/sales/sales.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { HrModule } from './modules/hr/hr.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    // Foundation — must load first
    CoreModule,
    SharedModule,

    // Domain modules
    CrmModule,
    SalesModule,
    InventoryModule,
    AccountingModule,
    HrModule,
    ProjectsModule,
  ],
})
export class AppModule {}
