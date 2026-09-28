import { Module } from '@nestjs/common';
import { LeadsController } from './leads/leads.controller';
import { LeadsService } from './leads/leads.service';
import { OpportunitiesController } from './opportunities/opportunities.controller';
import { OpportunitiesService } from './opportunities/opportunities.service';

@Module({
  controllers: [LeadsController, OpportunitiesController],
  providers: [LeadsService, OpportunitiesService],
  exports: [LeadsService, OpportunitiesService],
})
export class CrmModule {}
