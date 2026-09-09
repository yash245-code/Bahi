// ═══════════════════════════════════════════════════════════
// Bahi API — Root Application Module
// Assembles all domain modules into a modular monolith.
// ═══════════════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CrmModule } from './crm/crm.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { AccountingModule } from './accounting/accounting.module';
import { HrModule } from './hr/hr.module';
import { ProjectsModule } from './projects/projects.module';

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
