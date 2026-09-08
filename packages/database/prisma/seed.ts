// ═══════════════════════════════════════════════════════════
// Bahi — Database Seed Script
// Creates a demo tenant, admin user, default roles, and
// sample data for development.
// ═══════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── 1. Create demo tenant ──────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      plan: 'BUSINESS',
      status: 'ACTIVE',
      enabledModules: ['core', 'crm', 'sales', 'inventory', 'accounting', 'hr', 'projects'],
      currency: 'USD',
      timezone: 'America/New_York',
    },
  });

  console.log(`  ✔ Tenant: ${tenant.name} (${tenant.id})`);

  // ── 2. Create default roles ────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Admin' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin',
      description: 'Full access to all modules',
      permissions: [
        'manage:tenant', 'manage:users', 'manage:roles',
        'view:leads', 'manage:leads', 'view:opportunities', 'manage:opportunities',
        'view:quotations', 'manage:quotations', 'view:orders', 'manage:orders',
        'view:products', 'manage:products', 'view:stock', 'manage:stock',
        'view:invoices', 'manage:invoices', 'view:payments', 'manage:payments', 'view:reports',
        'view:employees', 'manage:employees', 'manage:leave', 'view:attendance',
        'view:projects', 'manage:projects', 'view:timesheets', 'manage:timesheets',
      ],
      isDefault: false,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Member' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Member',
      description: 'Standard team member access',
      permissions: [
        'view:leads', 'manage:leads', 'view:opportunities',
        'view:quotations', 'view:orders',
        'view:products', 'view:stock',
        'view:invoices', 'view:payments',
        'view:employees', 'view:attendance',
        'view:projects', 'manage:projects', 'view:timesheets', 'manage:timesheets',
      ],
      isDefault: true,
    },
  });

  console.log(`  ✔ Roles: ${adminRole.name}, ${memberRole.name}`);

  // ── 3. Create admin user (password: "admin123") ────────
  // NOTE: In production, passwords are hashed with bcrypt.
  // This seed uses a pre-computed bcrypt hash for "admin123".
  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@acmecorp.com' } },
    update: {
      passwordHash: '$2b$10$aEJDHCcbdSEy1yQN2x3Bg..4h1wOhvM90zZqNYGQWgEzSOhCTde.G',
    },
    create: {
      tenantId: tenant.id,
      email: 'admin@acmecorp.com',
      passwordHash: '$2b$10$aEJDHCcbdSEy1yQN2x3Bg..4h1wOhvM90zZqNYGQWgEzSOhCTde.G', // admin123
      firstName: 'Yash',
      lastName: 'Rawat',
      status: 'ACTIVE',
      roleId: adminRole.id,
    },
  });

  console.log(`  ✔ Admin User: ${adminUser.email}`);

  // ── 4. CRM pipeline stages ─────────────────────────────
  const stages = [
    { name: 'New', order: 1, color: '#6366f1' },
    { name: 'Qualified', order: 2, color: '#8b5cf6' },
    { name: 'Proposal', order: 3, color: '#a78bfa' },
    { name: 'Negotiation', order: 4, color: '#f59e0b' },
    { name: 'Won', order: 5, color: '#10b981' },
    { name: 'Lost', order: 6, color: '#ef4444' },
  ];

  for (const stage of stages) {
    await prisma.pipelineStage.upsert({
      where: { tenantId_name: { tenantId: tenant.id, name: stage.name } },
      update: {},
      create: { tenantId: tenant.id, ...stage },
    });
  }

  console.log(`  ✔ Pipeline stages: ${stages.length} created`);

  // ── 5. Sample contacts ─────────────────────────────────
  const existingContacts = await prisma.contact.count({ where: { tenantId: tenant.id } });
  if (existingContacts === 0) {
    await Promise.all([
      prisma.contact.create({
        data: {
          tenantId: tenant.id,
          type: 'CUSTOMER',
          name: 'TechStart Inc.',
          email: 'hello@techstart.io',
          phone: '+1-555-0101',
          company: 'TechStart Inc.',
        },
      }),
      prisma.contact.create({
        data: {
          tenantId: tenant.id,
          type: 'LEAD',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1-555-0202',
          company: 'Smith & Co.',
        },
      }),
      prisma.contact.create({
        data: {
          tenantId: tenant.id,
          type: 'VENDOR',
          name: 'SupplyLine Ltd.',
          email: 'orders@supplyline.com',
          phone: '+1-555-0303',
          company: 'SupplyLine Ltd.',
        },
      }),
    ]);
  }

  console.log(`  ✔ Contacts verified`);

  // ── 6. Sample products ─────────────────────────────────
  const products = [
    {
      name: 'Business Suite License',
      sku: 'BSL-001',
      description: 'Annual business suite license',
      unitPrice: 299.00,
      category: 'Software',
      trackStock: false,
    },
    {
      name: 'Consulting Hours Pack',
      sku: 'CHP-010',
      description: '10 hours of expert consulting',
      unitPrice: 1500.00,
      category: 'Services',
      trackStock: false,
    },
    {
      name: 'Cloud Server (Monthly)',
      sku: 'CSV-M01',
      description: 'Managed cloud server instance',
      unitPrice: 89.00,
      category: 'Infrastructure',
      trackStock: false,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: prod.sku } },
      update: {},
      create: { tenantId: tenant.id, ...prod },
    });
  }

  console.log(`  ✔ Products: 3 verified`);

  // ── 7. Sample warehouse ────────────────────────────────
  await prisma.warehouse.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'WH-MAIN' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Main Warehouse',
      code: 'WH-MAIN',
      address: '123 Industrial Blvd, New York, NY',
    },
  });

  console.log(`  ✔ Warehouses: 1 verified`);

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
