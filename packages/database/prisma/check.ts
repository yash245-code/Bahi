import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  console.log('🔄 Checking MongoDB Atlas connection...');
  const start = Date.now();

  const tenant = await prisma.tenant.findUnique({
    where: { slug: 'acme-corp' },
    include: {
      users: true,
      roles: true,
      products: true,
      warehouses: true,
      pipelineStages: true,
      contacts: true,
    },
  });

  const latency = Date.now() - start;

  if (tenant) {
    console.log(`\n🎉 Connection Successful! (${latency}ms)`);
    console.log('────────────────────────────────────────────');
    console.log(`🏢 Tenant Name:    ${tenant.name}`);
    console.log(`🆔 Tenant ID:      ${tenant.id}`);
    console.log(`👤 Active Users:   ${tenant.users.length} (${tenant.users.map((u) => u.email).join(', ')})`);
    console.log(`🛡️  Roles:          ${tenant.roles.length} (${tenant.roles.map((r) => r.name).join(', ')})`);
    console.log(`👥 Contacts:       ${tenant.contacts.length}`);
    console.log(`📦 Products:       ${tenant.products.length}`);
    console.log(`🏭 Warehouses:     ${tenant.warehouses.length}`);
    console.log(`📊 CRM Pipelines:  ${tenant.pipelineStages.length} stages`);
    console.log('────────────────────────────────────────────\n');
  } else {
    console.log('⚠️  Connected to MongoDB, but no tenant records found. Run `npm run db:seed` to populate data.');
  }
}

check()
  .catch((err) => {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
