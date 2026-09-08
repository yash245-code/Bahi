// ═══════════════════════════════════════════════════════════
// Bahi API — Application Entry Point
// ═══════════════════════════════════════════════════════════

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Global prefix & versioning ──────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ── CORS ────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // ── Validation pipe ─────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger / OpenAPI ───────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bahi — Multi-Tenant Business Suite API')
    .setDescription(
      'RESTful API for the Bahi ERP/Business-operations platform. ' +
      'Modules: Core, CRM, Sales, Inventory, Accounting, HR, Projects.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & registration')
    .addTag('tenants', 'Tenant management')
    .addTag('users', 'User management & invitations')
    .addTag('roles', 'Role-based access control')
    .addTag('contacts', 'Shared party model')
    .addTag('crm', 'CRM — Leads, Opportunities, Pipelines')
    .addTag('sales', 'Sales — Quotations & Orders')
    .addTag('inventory', 'Inventory — Products, Warehouses, Stock')
    .addTag('accounting', 'Accounting — Invoices & Payments')
    .addTag('hr', 'HR — Employees, Leave, Attendance')
    .addTag('projects', 'Projects — Tasks & Timesheets')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ── Start ───────────────────────────────────────────────
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`\n🚀 Bahi API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs\n`);
}

bootstrap();
