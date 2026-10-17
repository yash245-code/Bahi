-- ═══════════════════════════════════════════════════════════
-- Bahi Platform — PostgreSQL Row-Level Security (RLS) Policies
-- Enforces data isolation at the PostgreSQL storage engine layer.
-- ═══════════════════════════════════════════════════════════

-- Ensure pg_trgm & uuid extensions are installed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Helper function to fetch current tenant id from session context
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS uuid AS $$
BEGIN
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::uuid;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Define list of all multi-tenant tables
DO $$
DECLARE
    tbl_name text;
    tables text[] := ARRAY[
        'users',
        'roles',
        'teams',
        'territories',
        'companies',
        'contacts',
        'leads',
        'pipelines',
        'pipeline_stages',
        'opportunities',
        'stage_histories',
        'deal_line_items',
        'products',
        'price_lists',
        'quotes',
        'activities',
        'communications',
        'attachments',
        'custom_field_definitions',
        'saved_views',
        'automation_rules',
        'sequences',
        'web_forms',
        'import_jobs',
        'audit_logs',
        'goals',
        'lost_reasons',
        'lead_sources',
        'campaigns',
        'notifications',
        'approval_requests',
        'quotations',
        'sales_orders',
        'warehouses',
        'stock_moves',
        'invoices',
        'payments',
        'employees',
        'leave_requests',
        'projects'
    ];
BEGIN
    FOREACH tbl_name IN ARRAY tables LOOP
        -- Check if table exists before applying
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl_name) THEN
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl_name);
            EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', tbl_name);
            EXECUTE format(
                'CREATE POLICY tenant_isolation_policy ON %I ' ||
                'FOR ALL ' ||
                'USING ("tenantId" = current_tenant_id()) ' ||
                'WITH CHECK ("tenantId" = current_tenant_id());',
                tbl_name
            );
        END IF;
    END LOOP;
END;
$$;
