// ═══════════════════════════════════════════════════════════
// AutomationsService — Rule Engine & Cadence Sequences
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';
import { CrmEventBus, CrmDomainEvent } from '../common/events';

export interface ConditionRule {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in' | 'is_empty' | 'is_not_empty';
  value?: any;
}

export interface AutomationAction {
  type: 'CREATE_TASK' | 'UPDATE_FIELD' | 'NOTIFY_USER' | 'ASSIGN_OWNER' | 'ADD_TAG' | 'CALL_WEBHOOK';
  params: Record<string, any>;
}

export interface CreateAutomationRuleDto {
  name: string;
  description?: string;
  triggerEvent: string; // e.g. 'lead.created', 'deal.stage_changed', 'deal.won'
  entityType: string;   // 'lead', 'deal', 'contact', 'company'
  conditions: ConditionRule[];
  actions: AutomationAction[];
  active?: boolean;
}

export interface CreateSequenceDto {
  name: string;
  description?: string;
  entityType?: string;
  stopOnReply?: boolean;
  steps: Array<{
    stepNumber: number;
    type: 'EMAIL' | 'TASK' | 'WHATSAPP' | 'WAIT';
    waitDays?: number;
    subject?: string;
    body?: string;
    assigneeId?: string;
  }>;
}

@Injectable()
export class AutomationsService implements OnModuleInit {
  private readonly logger = new Logger(AutomationsService.name);

  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventBus: CrmEventBus,
  ) {}

  onModuleInit() {
    this.eventBus.events$.subscribe((event: CrmDomainEvent) => {
      this.handleDomainEvent(event).catch((err) => {
        this.logger.error(`Error processing automation event ${event.eventName}:`, err);
      });
    });
  }

  // ─── Event Listener & Rule Evaluation ────────────────────────

  async handleDomainEvent(event: CrmDomainEvent) {
    const payload = event.payload || {};
    const tenantId = payload.tenantId;
    if (!tenantId) return;

    const matchingRules = await this.prisma.automationRule.findMany({
      where: {
        tenantId,
        triggerEvent: event.eventName,
        active: true,
      },
    });

    for (const rule of matchingRules) {
      const conditions = (rule.conditions as any[]) || [];
      const isMatch = this.evaluateConditions(conditions, payload);

      if (isMatch) {
        this.logger.log(`[Automation] Triggering rule "${rule.name}" (${rule.id}) on ${event.eventName}`);
        await this.executeActions(tenantId, rule.actions as any[], payload);

        await this.prisma.automationRule.update({
          where: { id: rule.id },
          data: {
            executionCount: { increment: 1 },
            lastExecutedAt: new Date(),
          },
        });
      }
    }
  }

  evaluateConditions(conditions: ConditionRule[], target: Record<string, any>): boolean {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every((cond) => {
      const actualVal = target[cond.field];
      const expectedVal = cond.value;

      switch (cond.operator) {
        case 'eq':
          return String(actualVal) === String(expectedVal);
        case 'neq':
          return String(actualVal) !== String(expectedVal);
        case 'gt':
          return Number(actualVal) > Number(expectedVal);
        case 'gte':
          return Number(actualVal) >= Number(expectedVal);
        case 'lt':
          return Number(actualVal) < Number(expectedVal);
        case 'lte':
          return Number(actualVal) <= Number(expectedVal);
        case 'contains':
          return String(actualVal || '').toLowerCase().includes(String(expectedVal || '').toLowerCase());
        case 'in':
          return Array.isArray(expectedVal) && expectedVal.includes(actualVal);
        case 'is_empty':
          return actualVal === null || actualVal === undefined || actualVal === '';
        case 'is_not_empty':
          return actualVal !== null && actualVal !== undefined && actualVal !== '';
        default:
          return false;
      }
    });
  }

  async executeActions(tenantId: string, actions: AutomationAction[], payload: Record<string, any>) {
    if (!actions || !Array.isArray(actions)) return;

    for (const action of actions) {
      try {
        switch (action.type) {
          case 'CREATE_TASK': {
            const subject = action.params.subject || 'Automated Task Follow-up';
            const relatedType = action.params.relatedType || payload.entityType || 'lead';
            const relatedId = payload.id || payload.leadId || payload.dealId;
            if (relatedId) {
              await this.prisma.activity.create({
                data: {
                  tenantId,
                  type: 'TASK',
                  subject,
                  description: action.params.description || 'Generated automatically by CRM workflow rule',
                  priority: action.params.priority || 'MEDIUM',
                  assigneeId: action.params.assigneeId || payload.ownerId || null,
                  relatedType,
                  relatedId,
                  dueDateTime: action.params.dueDays
                    ? new Date(Date.now() + action.params.dueDays * 86400000)
                    : new Date(Date.now() + 86400000),
                },
              });
            }
            break;
          }

          case 'UPDATE_FIELD': {
            const entityType = action.params.entityType || payload.entityType || 'lead';
            const entityId = payload.id || payload.leadId || payload.dealId;
            const field = action.params.field;
            const value = action.params.value;

            if (entityId && field) {
              if (entityType === 'lead') {
                await this.prisma.lead.update({
                  where: { id: entityId },
                  data: { [field]: value },
                });
              } else if (entityType === 'deal' || entityType === 'opportunity') {
                await this.prisma.opportunity.update({
                  where: { id: entityId },
                  data: { [field]: value },
                });
              }
            }
            break;
          }

          case 'NOTIFY_USER': {
            const userId = action.params.userId || payload.ownerId;
            if (userId) {
              await this.prisma.notification.create({
                data: {
                  tenantId,
                  userId,
                  title: action.params.title || 'CRM Workflow Triggered',
                  body: action.params.body || `Rule matched for entity ${payload.id || ''}`,
                  type: 'SYSTEM',
                  relatedType: payload.entityType || 'lead',
                  relatedId: payload.id || payload.leadId || null,
                },
              });
            }
            break;
          }

          case 'ASSIGN_OWNER': {
            const newOwnerId = action.params.ownerId;
            const entityType = action.params.entityType || 'lead';
            const entityId = payload.id;
            if (newOwnerId && entityId) {
              if (entityType === 'lead') {
                await this.prisma.lead.update({
                  where: { id: entityId },
                  data: { ownerId: newOwnerId },
                });
              } else if (entityType === 'deal') {
                await this.prisma.opportunity.update({
                  where: { id: entityId },
                  data: { ownerId: newOwnerId },
                });
              }
            }
            break;
          }

          case 'ADD_TAG': {
            const tag = action.params.tag;
            const entityType = action.params.entityType || 'lead';
            const entityId = payload.id;
            if (tag && entityId) {
              if (entityType === 'contact') {
                const contact = await this.prisma.contact.findUnique({ where: { id: entityId } });
                if (contact && !contact.tags.includes(tag)) {
                  await this.prisma.contact.update({
                    where: { id: entityId },
                    data: { tags: { push: tag } },
                  });
                }
              } else if (entityType === 'company') {
                const company = await this.prisma.company.findUnique({ where: { id: entityId } });
                if (company && !company.tags.includes(tag)) {
                  await this.prisma.company.update({
                    where: { id: entityId },
                    data: { tags: { push: tag } },
                  });
                }
              }
            }
            break;
          }

          default:
            this.logger.warn(`Unknown automation action type: ${action.type}`);
        }
      } catch (err) {
        this.logger.error(`Failed executing automation action ${action.type}:`, err);
      }
    }
  }

  // ─── Automation Rules CRUD ───────────────────────────────────

  async findAllRules(tenantId: string) {
    return this.prisma.automationRule.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRuleById(tenantId: string, id: string) {
    const rule = await this.prisma.automationRule.findFirst({
      where: { id, tenantId },
    });
    if (!rule) throw new NotFoundException(`Automation rule ${id} not found`);
    return rule;
  }

  async createRule(tenantId: string, dto: CreateAutomationRuleDto, userId?: string) {
    return this.prisma.automationRule.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || null,
        triggerEvent: dto.triggerEvent,
        entityType: dto.entityType,
        conditions: dto.conditions as any,
        actions: dto.actions as any,
        active: dto.active ?? true,
        createdBy: userId || null,
      },
    });
  }

  async updateRule(tenantId: string, id: string, dto: Partial<CreateAutomationRuleDto>) {
    await this.findRuleById(tenantId, id);
    return this.prisma.automationRule.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.triggerEvent && { triggerEvent: dto.triggerEvent }),
        ...(dto.entityType && { entityType: dto.entityType }),
        ...(dto.conditions && { conditions: dto.conditions as any }),
        ...(dto.actions && { actions: dto.actions as any }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });
  }

  async deleteRule(tenantId: string, id: string) {
    await this.findRuleById(tenantId, id);
    return this.prisma.automationRule.delete({ where: { id } });
  }

  async testRule(tenantId: string, id: string, mockPayload: Record<string, any>) {
    const rule = await this.findRuleById(tenantId, id);
    const conditions = (rule.conditions as any[]) || [];
    const isMatch = this.evaluateConditions(conditions, mockPayload);
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched: isMatch,
      mockPayload,
      actionPlan: isMatch ? rule.actions : [],
    };
  }

  // ─── Outreach Sequences ───────────────────────────────────────

  async findAllSequences(tenantId: string) {
    return this.prisma.sequence.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSequence(tenantId: string, dto: CreateSequenceDto, userId?: string) {
    return this.prisma.sequence.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description || null,
        entityType: dto.entityType || 'lead',
        stopOnReply: dto.stopOnReply ?? true,
        steps: dto.steps as any,
        createdBy: userId || null,
      },
    });
  }

  async updateSequence(tenantId: string, id: string, dto: Partial<CreateSequenceDto>) {
    const seq = await this.prisma.sequence.findFirst({ where: { id, tenantId } });
    if (!seq) throw new NotFoundException(`Sequence ${id} not found`);

    return this.prisma.sequence.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.steps && { steps: dto.steps as any }),
        ...(dto.stopOnReply !== undefined && { stopOnReply: dto.stopOnReply }),
      },
    });
  }

  async deleteSequence(tenantId: string, id: string) {
    const seq = await this.prisma.sequence.findFirst({ where: { id, tenantId } });
    if (!seq) throw new NotFoundException(`Sequence ${id} not found`);
    return this.prisma.sequence.delete({ where: { id } });
  }
}
