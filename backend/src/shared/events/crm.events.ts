// ═══════════════════════════════════════════════════════════
// Domain Events — CRM Event Definitions
// ═══════════════════════════════════════════════════════════

export interface LeadCreatedEvent {
  tenantId: string;
  leadId: string;
  title: string;
  source?: string;
  score: number;
  ownerId?: string;
}

export interface LeadConvertedEvent {
  tenantId: string;
  leadId: string;
  contactId: string;
  companyId?: string;
  dealId?: string;
}

export interface DealStageChangedEvent {
  tenantId: string;
  dealId: string;
  fromStageId: string;
  toStageId: string;
  stageName: string;
  stageType: 'OPEN' | 'WON' | 'LOST';
  value: number;
  ownerId?: string;
  userId?: string;
}

export interface DealWonEvent {
  tenantId: string;
  dealId: string;
  title: string;
  value: number;
  currency: string;
  contactId?: string;
  companyId?: string;
}

export interface DealLostEvent {
  tenantId: string;
  dealId: string;
  title: string;
  reason?: string;
}

export interface ContactUpdatedEvent {
  tenantId: string;
  contactId: string;
  changes: Record<string, unknown>;
}

export interface QuoteAcceptedEvent {
  tenantId: string;
  quoteId: string;
  dealId?: string;
  amount: number;
}
