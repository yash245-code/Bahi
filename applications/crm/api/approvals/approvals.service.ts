// ═══════════════════════════════════════════════════════════
// ApprovalsService — Deal Approval Workflows & Sales Goals
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface CreateApprovalDto {
  dealId: string;
  approverId: string;
  type: 'DISCOUNT_OVER_THRESHOLD' | 'DEAL_VALUE_EXCEPTION' | 'STAGE_SKIP';
  discountPercent?: number;
  dealValue?: number;
  comments?: string;
}

export interface DecideApprovalDto {
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
}

export interface CreateGoalDto {
  targetType: 'REVENUE' | 'DEALS_WON' | 'ACTIVITIES_COMPLETED' | 'LEADS_CONVERTED';
  targetValue: number;
  periodType: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  startDate: string;
  endDate: string;
  userId?: string;
  teamId?: string;
}

@Injectable()
export class ApprovalsService {
  private readonly logger = new Logger(ApprovalsService.name);

  constructor(private readonly prisma: PrismaClient) {}

  // ─── Approvals ───────────────────────────────────────────────

  async findAllApprovals(tenantId: string, status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return this.prisma.approvalRequest.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        deal: { select: { id: true, title: true, value: true, currency: true } },
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
        approver: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createApproval(tenantId: string, userId: string, dto: CreateApprovalDto) {
    const deal = await this.prisma.opportunity.findFirst({
      where: { id: dto.dealId, tenantId, deletedAt: null },
    });
    if (!deal) throw new NotFoundException(`Deal ${dto.dealId} not found`);

    const approval = await this.prisma.approvalRequest.create({
      data: {
        tenantId,
        dealId: dto.dealId,
        requestedById: userId,
        approverId: dto.approverId,
        type: dto.type,
        discountPercent: dto.discountPercent || null,
        dealValue: dto.dealValue || deal.value,
        comments: dto.comments || null,
        status: 'PENDING',
      },
      include: {
        deal: true,
        requester: true,
        approver: true,
      },
    });

    // Notify approver
    await this.prisma.notification.create({
      data: {
        tenantId,
        userId: dto.approverId,
        title: 'Deal Approval Required',
        body: `Approval requested for deal "${deal.title}" (${dto.type})`,
        type: 'SYSTEM',
        relatedType: 'deal',
        relatedId: dto.dealId,
      },
    });

    return approval;
  }

  async decideApproval(tenantId: string, approvalId: string, userId: string, dto: DecideApprovalDto) {
    const approval = await this.prisma.approvalRequest.findFirst({
      where: { id: approvalId, tenantId },
      include: { deal: true },
    });

    if (!approval) throw new NotFoundException(`Approval request ${approvalId} not found`);
    if (approval.status !== 'PENDING') {
      throw new BadRequestException(`Approval request has already been ${approval.status.toLowerCase()}`);
    }

    this.logger.log(`User ${userId} decided approval ${approvalId} -> ${dto.status}`);
    const updated = await this.prisma.approvalRequest.update({
      where: { id: approvalId },
      data: {
        status: dto.status,
        comments: dto.comments ? `${approval.comments || ''}\nDecision comment: ${dto.comments}`.trim() : approval.comments,
        approvedAt: dto.status === 'APPROVED' ? new Date() : null,
      },
      include: {
        deal: true,
        requester: true,
      },
    });

    // Notify requester
    await this.prisma.notification.create({
      data: {
        tenantId,
        userId: approval.requestedById,
        title: `Deal Approval ${dto.status}`,
        body: `Your approval request for "${approval.deal.title}" was ${dto.status.toLowerCase()}`,
        type: 'SYSTEM',
        relatedType: 'deal',
        relatedId: approval.dealId,
      },
    });

    return updated;
  }

  // ─── Goals & Quota Attainment ────────────────────────────────

  async findAllGoals(tenantId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { tenantId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        team: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return goals.map((g) => {
      const target = Number(g.targetValue) || 1;
      const achieved = Number(g.achievedValue) || 0;
      const attainmentPercent = Math.min(Math.round((achieved / target) * 100), 100);
      return {
        ...g,
        attainmentPercent,
      };
    });
  }

  async createGoal(tenantId: string, dto: CreateGoalDto) {
    return this.prisma.goal.create({
      data: {
        tenantId,
        targetType: dto.targetType,
        targetValue: dto.targetValue,
        periodType: dto.periodType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        userId: dto.userId || null,
        teamId: dto.teamId || null,
      },
    });
  }

  async recalculateGoalProgress(tenantId: string, goalId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, tenantId },
    });
    if (!goal) throw new NotFoundException(`Goal ${goalId} not found`);

    let actualAchieved = 0;

    if (goal.targetType === 'REVENUE') {
      const wonDeals = await this.prisma.opportunity.findMany({
        where: {
          tenantId,
          stage: { stageType: 'WON' },
          deletedAt: null,
          ...(goal.userId && { ownerId: goal.userId }),
          updatedAt: { gte: goal.startDate, lte: goal.endDate },
        },
        select: { value: true },
      });
      actualAchieved = wonDeals.reduce((sum, d) => sum + Number(d.value), 0);
    } else if (goal.targetType === 'DEALS_WON') {
      actualAchieved = await this.prisma.opportunity.count({
        where: {
          tenantId,
          stage: { stageType: 'WON' },
          deletedAt: null,
          ...(goal.userId && { ownerId: goal.userId }),
          updatedAt: { gte: goal.startDate, lte: goal.endDate },
        },
      });
    } else if (goal.targetType === 'LEADS_CONVERTED') {
      actualAchieved = await this.prisma.lead.count({
        where: {
          tenantId,
          status: 'CONVERTED',
          deletedAt: null,
          ...(goal.userId && { ownerId: goal.userId }),
          updatedAt: { gte: goal.startDate, lte: goal.endDate },
        },
      });
    } else if (goal.targetType === 'ACTIVITIES_COMPLETED') {
      actualAchieved = await this.prisma.activity.count({
        where: {
          tenantId,
          status: 'COMPLETED',
          deletedAt: null,
          ...(goal.userId && { assigneeId: goal.userId }),
          completedAt: { gte: goal.startDate, lte: goal.endDate },
        },
      });
    }

    const updated = await this.prisma.goal.update({
      where: { id: goalId },
      data: { achievedValue: actualAchieved },
    });

    const target = Number(updated.targetValue) || 1;
    const attainmentPercent = Math.min(Math.round((actualAchieved / target) * 100), 100);

    return {
      ...updated,
      attainmentPercent,
    };
  }
}
