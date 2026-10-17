// ═══════════════════════════════════════════════════════════
// CustomFieldsService — Tenant-Defined Extensible Data Attributes
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@bahi/database';

export interface CreateCustomFieldDto {
  entityType: 'LEAD' | 'CONTACT' | 'COMPANY' | 'DEAL' | 'ACTIVITY';
  fieldName: string;
  fieldLabel: string;
  fieldType: 'TEXT' | 'LONG_TEXT' | 'NUMBER' | 'CURRENCY' | 'PERCENT' | 'DATE' | 'DATETIME' | 'SELECT' | 'MULTI_SELECT' | 'CHECKBOX' | 'URL' | 'EMAIL' | 'PHONE' | 'USER' | 'FORMULA';
  options?: string[];
  isRequired?: boolean;
  defaultValue?: any;
  roleVisibility?: Record<string, any>;
  section?: string;
  displayOrder?: number;
}

@Injectable()
export class CustomFieldsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(tenantId: string, entityType?: string) {
    return this.prisma.customFieldDefinition.findMany({
      where: {
        tenantId,
        ...(entityType ? { entityType: entityType as any } : {}),
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(tenantId: string, dto: CreateCustomFieldDto) {
    return this.prisma.customFieldDefinition.create({
      data: {
        tenantId,
        entityType: dto.entityType,
        fieldName: dto.fieldName.trim().toLowerCase().replace(/\s+/g, '_'),
        fieldLabel: dto.fieldLabel,
        fieldType: dto.fieldType,
        options: (dto.options as any) ?? [],
        isRequired: dto.isRequired ?? false,
        defaultValue: dto.defaultValue ?? null,
        roleVisibility: dto.roleVisibility ?? {},
        section: dto.section || 'General',
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const field = await this.prisma.customFieldDefinition.findFirst({
      where: { id, tenantId },
    });
    if (!field) throw new NotFoundException('Custom field not found');

    return this.prisma.customFieldDefinition.delete({
      where: { id },
    });
  }
}
