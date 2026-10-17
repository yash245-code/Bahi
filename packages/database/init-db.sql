-- ═══════════════════════════════════════════════════════════
-- Bahi Database Initialization Script
-- Enables UUID generation and trigram indexing for full-text search.
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
