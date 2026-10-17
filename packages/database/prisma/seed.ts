// ═══════════════════════════════════════════════════════════
// Bahi CRM — Production Database Seed Script (PostgreSQL)
// Generates realistic multi-tenant data for Bahi Suite.
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Bahi multi-tenant database...');

  // ── 1. Create Demo Tenant ──────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      plan: 'BUSINESS',
      status: 'ACTIVE',
      enabledModules: ['core', 'crm', 'sales', 'inventory', 'accounting', 'hr', 'projects'],
      currency: 'USD',
      timezone: 'America/New_York',
      dateFormat: 'YYYY-MM-DD',
      numberFormat: 'en-US',
      accentColor: '#A8462F',
    },
  });

  console.log(`  ✔ Tenant: ${tenant.name} (${tenant.id})`);

  // ── 2. Create Standard Roles ───────────────────────────────
  const rolesData = [
    {
      name: 'Owner',
      description: 'Full organizational authority and subscription billing owner',
      permissions: ['*'],
      isDefault: false,
    },
    {
      name: 'Admin',
      description: 'System administration, user access, and module configurations',
      permissions: [
        'manage:tenant', 'manage:users', 'manage:roles', 'manage:settings',
        'view:leads', 'manage:leads', 'view:contacts', 'manage:contacts',
        'view:companies', 'manage:companies', 'view:opportunities', 'manage:opportunities',
        'view:activities', 'manage:activities', 'view:reports', 'manage:automations',
      ],
      isDefault: false,
    },
    {
      name: 'Sales Manager',
      description: 'Team lead managing pipeline stages, quotas, assignments, and approvals',
      permissions: [
        'view:leads', 'manage:leads', 'view:contacts', 'manage:contacts',
        'view:companies', 'manage:companies', 'view:opportunities', 'manage:opportunities',
        'approve:deals', 'view:activities', 'manage:activities', 'view:reports',
      ],
      isDefault: false,
    },
    {
      name: 'Sales Rep',
      description: 'Standard quota-carrying account executive and sales representative',
      permissions: [
        'view:leads', 'manage:leads', 'view:contacts', 'manage:contacts',
        'view:companies', 'manage:companies', 'view:opportunities', 'manage:opportunities',
        'view:activities', 'manage:activities',
      ],
      isDefault: true,
    },
    {
      name: 'Read-only',
      description: 'Auditor and executive dashboard view without editing privileges',
      permissions: [
        'view:leads', 'view:contacts', 'view:companies', 'view:opportunities',
        'view:activities', 'view:reports',
      ],
      isDefault: false,
    },
  ];

  const roles: Record<string, string> = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: r.name } },
      update: {},
      create: {
        tenantId: tenant.id,
        name: r.name,
        description: r.description,
        permissions: r.permissions,
        isDefault: r.isDefault,
      },
    });
    roles[r.name] = role.id;
  }
  console.log('  ✔ Standard roles provisioned');

  // ── 3. Create Teams ────────────────────────────────────────
  const enterpriseTeam = await prisma.team.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Enterprise Revenue Squad' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Enterprise Revenue Squad',
      description: 'Strategic tier corporate sales and expansion',
    },
  });

  const smbTeam = await prisma.team.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Growth & Inbound Sales' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Growth & Inbound Sales',
      description: 'High-velocity inbound qualification and mid-market conversions',
    },
  });

  // ── 4. Create Users ────────────────────────────────────────
  // Default password for all seed accounts: "admin123" (bcrypt hash)
  const passwordHash = '$2b$10$aEJDHCcbdSEy1yQN2x3Bg..4h1wOhvM90zZqNYGQWgEzSOhCTde.G';

  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@acmecorp.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@acmecorp.com',
      passwordHash,
      firstName: 'Yash',
      lastName: 'Rawat',
      status: 'ACTIVE',
      roleId: roles['Owner'],
      teamId: enterpriseTeam.id,
    },
  });

  const salesRepUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'alex.morgan@acmecorp.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'alex.morgan@acmecorp.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Morgan',
      status: 'ACTIVE',
      roleId: roles['Sales Rep'],
      teamId: enterpriseTeam.id,
      managerId: adminUser.id,
    },
  });

  const salesRepUser2 = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'priya.sharma@acmecorp.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'priya.sharma@acmecorp.com',
      passwordHash,
      firstName: 'Priya',
      lastName: 'Sharma',
      status: 'ACTIVE',
      roleId: roles['Sales Rep'],
      teamId: smbTeam.id,
      managerId: adminUser.id,
    },
  });

  console.log(`  ✔ Users provisioned: ${adminUser.email}, ${salesRepUser.email}, ${salesRepUser2.email}`);

  // ── 5. Standard Pipelines & Stages ─────────────────────────
  const defaultPipeline = await prisma.pipeline.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Standard Sales Pipeline' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Standard Sales Pipeline',
      isDefault: true,
      order: 1,
      active: true,
    },
  });

  const stagesData = [
    { name: 'New Inbound', order: 1, color: '#75766E', defaultProbability: 20, rottingDays: 7, stageType: 'OPEN' as const },
    { name: 'Discovery & Qualified', order: 2, color: '#3B82F6', defaultProbability: 40, rottingDays: 10, stageType: 'OPEN' as const },
    { name: 'Demo & Presentation', order: 3, color: '#8B5CF6', defaultProbability: 60, rottingDays: 14, stageType: 'OPEN' as const },
    { name: 'Proposal Sent', order: 4, color: '#D97706', defaultProbability: 75, rottingDays: 10, stageType: 'OPEN' as const },
    { name: 'Contract Negotiation', order: 5, color: '#A8462F', defaultProbability: 90, rottingDays: 7, stageType: 'OPEN' as const },
    { name: 'Closed Won', order: 6, color: '#1F7A4D', defaultProbability: 100, rottingDays: 0, stageType: 'WON' as const },
    { name: 'Closed Lost', order: 7, color: '#B23A2E', defaultProbability: 0, rottingDays: 0, stageType: 'LOST' as const },
  ];

  const stages: Record<string, string> = {};
  for (const s of stagesData) {
    const stage = await prisma.pipelineStage.upsert({
      where: { pipelineId_name: { pipelineId: defaultPipeline.id, name: s.name } },
      update: {},
      create: {
        tenantId: tenant.id,
        pipelineId: defaultPipeline.id,
        name: s.name,
        order: s.order,
        color: s.color,
        defaultProbability: s.defaultProbability,
        rottingDays: s.rottingDays,
        stageType: s.stageType,
      },
    });
    stages[s.name] = stage.id;
  }
  console.log('  ✔ Pipeline & Stages configured');

  // ── 6. Lead Sources & Lost Reasons ─────────────────────────
  const leadSources = [
    'Inbound Website', 'Google Ads', 'LinkedIn Campaign',
    'Partner Referral', 'Webinar / Event', 'Outbound Prospecting',
  ];
  for (const src of leadSources) {
    await prisma.leadSource.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: src } },
      update: {},
      create: { tenantId: tenant.id, name: src },
    });
  }

  const lostReasons = [
    'Budget Constraints', 'Competitor Chosen', 'Feature Gap',
    'Timing / Postponed', 'Lost to No Decision', 'Unresponsive',
  ];
  for (const r of lostReasons) {
    await prisma.lostReason.upsert({
      where: { tenantId_reason: { tenantId: tenant.id, reason: r } },
      update: {},
      create: { tenantId: tenant.id, reason: r },
    });
  }

  // ── 7. Products Catalog ────────────────────────────────────
  const productsData = [
    { name: 'Bahi Suite Enterprise License', sku: 'BAHI-ENT-01', unitPrice: 2400.00, category: 'Software' },
    { name: 'Dedicated Cloud Implementation Service', sku: 'BAHI-SVC-01', unitPrice: 5000.00, category: 'Services' },
    { name: 'Priority 24/7 SLA Support Tier', sku: 'BAHI-SUP-01', unitPrice: 600.00, category: 'Support' },
  ];
  const products: Record<string, string> = {};
  for (const p of productsData) {
    const prod = await prisma.product.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: p.sku } },
      update: {},
      create: {
        tenantId: tenant.id,
        name: p.name,
        sku: p.sku,
        unitPrice: p.unitPrice,
        currency: 'USD',
        category: p.category,
      },
    });
    products[p.sku] = prod.id;
  }

  // ── 8. Companies (Accounts) ────────────────────────────────
  const company1 = await prisma.company.create({
    data: {
      tenantId: tenant.id,
      name: 'Apex Technologies Inc',
      domain: 'apextech.io',
      industry: 'Enterprise Software',
      size: '51-200',
      annualRevenue: 12500000.00,
      accountTier: 'ENTERPRISE',
      healthScore: 95,
      ownerId: salesRepUser.id,
      tags: ['SaaS', 'Key Account', 'US-East'],
    },
  });

  const company2 = await prisma.company.create({
    data: {
      tenantId: tenant.id,
      name: 'Nordic Logistics AG',
      domain: 'nordiclogistics.de',
      industry: 'Supply Chain & Freight',
      size: '201-500',
      annualRevenue: 45000000.00,
      accountTier: 'STRATEGIC',
      healthScore: 88,
      ownerId: salesRepUser.id,
      tags: ['Logistics', 'EMEA', 'Multinational'],
    },
  });

  const company3 = await prisma.company.create({
    data: {
      tenantId: tenant.id,
      name: 'Vertex Health Systems',
      domain: 'vertexhealth.org',
      industry: 'Healthcare & Clinical',
      size: '500+',
      annualRevenue: 85000000.00,
      accountTier: 'STRATEGIC',
      healthScore: 92,
      ownerId: salesRepUser2.id,
      tags: ['Healthcare', 'HIPAA', 'Priority'],
    },
  });

  // ── 9. Contacts ────────────────────────────────────────────
  const contact1 = await prisma.contact.create({
    data: {
      tenantId: tenant.id,
      firstName: 'David',
      lastName: 'Chen',
      salutation: 'Mr.',
      jobTitle: 'Chief Technology Officer',
      department: 'Engineering',
      companyId: company1.id,
      emails: [{ email: 'david.chen@apextech.io', isPrimary: true, label: 'Work' }],
      phones: [{ phone: '+1 (555) 349-2041', type: 'Mobile', isWhatsApp: true, isPrimary: true }],
      lifecycleStage: 'CUSTOMER',
      ownerId: salesRepUser.id,
      tags: ['Decision Maker', 'Technical Buyer'],
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Elena',
      lastName: 'Rostova',
      salutation: 'Ms.',
      jobTitle: 'VP of Global Operations',
      department: 'Operations',
      companyId: company2.id,
      emails: [{ email: 'elena.rostova@nordiclogistics.de', isPrimary: true, label: 'Work' }],
      phones: [{ phone: '+49 30 901820', type: 'Office', isWhatsApp: false, isPrimary: true }],
      lifecycleStage: 'OPPORTUNITY',
      ownerId: salesRepUser.id,
      tags: ['Executive Sponsor'],
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      tenantId: tenant.id,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      salutation: 'Dr.',
      jobTitle: 'Director of Procurement',
      department: 'Procurement',
      companyId: company3.id,
      emails: [{ email: 's.jenkins@vertexhealth.org', isPrimary: true, label: 'Work' }],
      phones: [{ phone: '+1 (555) 782-9011', type: 'Office', isWhatsApp: false, isPrimary: true }],
      lifecycleStage: 'MQL',
      ownerId: salesRepUser2.id,
      tags: ['Commercial Evaluator'],
    },
  });

  // ── 10. Deals (Opportunities) ──────────────────────────────
  const deal1 = await prisma.opportunity.create({
    data: {
      tenantId: tenant.id,
      title: 'Apex Tech — Global Multi-Entity ERP Rollout',
      contactId: contact1.id,
      companyId: company1.id,
      pipelineId: defaultPipeline.id,
      stageId: stages['Contract Negotiation'],
      value: 48000.00,
      currency: 'USD',
      probability: 90,
      forecastCategory: 'COMMIT',
      ownerId: salesRepUser.id,
      teamId: enterpriseTeam.id,
      expectedCloseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      nextStep: 'Final legal redlines exchange with General Counsel',
    },
  });

  const deal2 = await prisma.opportunity.create({
    data: {
      tenantId: tenant.id,
      title: 'Nordic Logistics — Automated Multi-Warehouse Dispatch',
      contactId: contact2.id,
      companyId: company2.id,
      pipelineId: defaultPipeline.id,
      stageId: stages['Proposal Sent'],
      value: 28500.00,
      currency: 'USD',
      probability: 75,
      forecastCategory: 'BEST_CASE',
      ownerId: salesRepUser.id,
      teamId: enterpriseTeam.id,
      expectedCloseDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      nextStep: 'Executive stakeholder presentation on ROI analysis',
    },
  });

  const deal3 = await prisma.opportunity.create({
    data: {
      tenantId: tenant.id,
      title: 'Vertex Health — Clinical Billing & Invoicing Engine',
      contactId: contact3.id,
      companyId: company3.id,
      pipelineId: defaultPipeline.id,
      stageId: stages['Demo & Presentation'],
      value: 85000.00,
      currency: 'USD',
      probability: 60,
      forecastCategory: 'PIPELINE',
      ownerId: salesRepUser2.id,
      teamId: smbTeam.id,
      expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      nextStep: 'Technical architecture deep-dive on HIPAA compliance',
    },
  });

  // Deal line items
  await prisma.dealLineItem.create({
    data: {
      tenantId: tenant.id,
      dealId: deal1.id,
      productId: products['BAHI-ENT-01'],
      name: 'Bahi Suite Enterprise License (Annual)',
      quantity: 15.00,
      unitPrice: 2400.00,
      discountPercent: 10.00,
      totalPrice: 32400.00,
    },
  });

  await prisma.dealLineItem.create({
    data: {
      tenantId: tenant.id,
      dealId: deal1.id,
      productId: products['BAHI-SVC-01'],
      name: 'Dedicated Cloud Implementation Service',
      quantity: 2.00,
      unitPrice: 5000.00,
      discountPercent: 0.00,
      totalPrice: 10000.00,
    },
  });

  // ── 11. Leads ──────────────────────────────────────────────
  await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      title: 'Marcus Vance — Inbound Enterprise Inquirer',
      companyName: 'DataFlow Systems',
      source: 'Inbound Website',
      status: 'WORKING',
      score: 92,
      rating: 'HOT',
      ownerId: salesRepUser.id,
      interestNotes: 'Urgent evaluation for migrating away from legacy Odoo instance.',
    },
  });

  await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      title: 'Rachel Adams — VP Strategy & Growth',
      companyName: 'Summit Cloud Infrastructure',
      source: 'LinkedIn Campaign',
      status: 'NEW',
      score: 78,
      rating: 'WARM',
      ownerId: salesRepUser2.id,
      interestNotes: 'Interested in unified quote-to-cash workflow for 80 sales reps.',
    },
  });

  // ── 12. Activities & Tasks ─────────────────────────────────
  await prisma.activity.create({
    data: {
      tenantId: tenant.id,
      type: 'CALL',
      subject: 'Commercial Terms Review with David Chen',
      description: 'Discuss final 10% volume discount and 3-year agreement terms.',
      dueDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      durationMinutes: 45,
      status: 'PENDING',
      priority: 'HIGH',
      assigneeId: salesRepUser.id,
      relatedType: 'deal',
      relatedId: deal1.id,
    },
  });

  await prisma.activity.create({
    data: {
      tenantId: tenant.id,
      type: 'MEETING',
      subject: 'Executive Demo with Elena Rostova',
      description: 'Walkthrough of real-time inventory multi-warehouse allocation module.',
      dueDateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      status: 'PENDING',
      priority: 'URGENT',
      assigneeId: salesRepUser.id,
      relatedType: 'deal',
      relatedId: deal2.id,
    },
  });

  console.log('✅ Bahi CRM database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
