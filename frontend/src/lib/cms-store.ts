// ═══════════════════════════════════════════════════════════
// Bahi SaaS Platform — Central CMS & Knowledge Store
// ═══════════════════════════════════════════════════════════

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Product' | 'Engineering' | 'Business Ops' | 'Security';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  content: string;
}

export interface DocArticle {
  slug: string;
  title: string;
  category: 'Getting Started' | 'CRM & Sales' | 'Inventory & Stock' | 'Accounting & Tax' | 'API & Webhooks';
  description: string;
  content: string;
  lastUpdated: string;
}

export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  department: 'Engineering' | 'Product & Design' | 'Sales & Solutions' | 'Customer Success';
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isOpen: boolean;
}

export interface LegalDocument {
  id: 'terms' | 'privacy' | 'cookies' | 'refund';
  title: string;
  version: string;
  lastUpdated: string;
  summary: string;
  content: string;
}

export interface SystemServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptimePercent: number;
  description: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  impact: 'None' | 'Minor' | 'Major';
  status: 'Resolved' | 'Monitoring' | 'Investigating';
  date: string;
  description: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  badge: 'Feature' | 'Improvement' | 'Security' | 'Fix';
  description: string;
  highlights: string[];
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetPlans: string[];
  updatedAt: string;
}

// ─── Initial Seed Content ───────────────────────────────────

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'scaling-sme-operations-with-unified-erp',
    title: 'Why Point Solutions Fragment Teams (And How Unified ERP Fixes It)',
    excerpt:
      'Learn how mid-market businesses replace 6 disconnected SaaS subscriptions with an integrated real-time ledger and CRM.',
    category: 'Business Ops',
    author: {
      name: 'Aditi Sharma',
      role: 'VP of Product Strategy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    },
    publishedAt: '2026-10-18',
    readTime: '6 min read',
    featured: true,
    content: `Running a modern business across six disconnected SaaS tools drains productivity and leads to data discrepancies. When a sale closes in CRM, your inventory in warehouse software remains unaware until a batch script runs. 

With Bahi's Unified Enterprise OS, every quote, order, stock movement, and double-entry transaction operates over the exact same schema. Real-time synchronization eliminates reconciliations and guarantees auditable clarity.`,
  },
  {
    slug: 'modern-multi-tenancy-with-postgresql-rls',
    title: 'Architecting High-Trust Multi-Tenancy with PostgreSQL RLS',
    excerpt:
      'A deep-dive into how Bahi isolates enterprise workspaces cryptographically and logically without ballooning database infrastructure.',
    category: 'Engineering',
    author: {
      name: 'Rohan Mehra',
      role: 'Principal Database Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    },
    publishedAt: '2026-10-04',
    readTime: '9 min read',
    featured: false,
    content: `Tenancy isolation in SaaS has traditionally been a choice between high-cost single-tenant databases or error-prone WHERE clause filtering in application code.

Bahi leverages PostgreSQL Row-Level Security (RLS) policies tied directly to authenticated JWT tenant claims. Even if application code errs, the database engine guarantees that query results never leak outside the caller's tenant boundary.`,
  },
  {
    slug: 'automating-quotes-to-cash-workflow',
    title: 'From Quotation to Cash: 5 Steps to Halve Your Sales Cycle',
    excerpt:
      'Turn custom price books, digital customer signatures, and automated payment receipts into an effortless pipeline.',
    category: 'Product',
    author: {
      name: 'Karan Patel',
      role: 'Lead CRM Specialist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    },
    publishedAt: '2026-09-22',
    readTime: '5 min read',
    featured: false,
    content: `Slow quoting kills conversions. In this guide, discover how Bahi's integrated Sales Orders module allows instant quotation approvals with embedded Stripe links, auto-reserving stock the moment an order is accepted.`,
  },
];

export const INITIAL_DOCS: DocArticle[] = [
  {
    slug: 'quickstart-setup',
    title: 'Platform Quickstart & Organization Provisioning',
    category: 'Getting Started',
    description: 'Everything you need to create your tenant, invite team members, and select your active business modules.',
    lastUpdated: 'October 2026',
    content: `1. Sign up for an account at /signup.\n2. Choose your organization subdomain slug.\n3. Complete the onboarding wizard to pick active modules (CRM, Sales, Inventory, Accounting).\n4. Invite colleagues with granular role permissions.\n5. You're ready to create your first pipeline and customer account!`,
  },
  {
    slug: 'pipeline-and-lead-scoring',
    title: 'Configuring CRM Pipelines & Algorithmic Lead Scoring',
    category: 'CRM & Sales',
    description: 'Learn how to set up multi-stage visual sales funnels and automated activity decay algorithms.',
    lastUpdated: 'September 2026',
    content: `Bahi CRM includes multi-pipeline support. Each pipeline can have customized win-probability multipliers and SLA breach indicators. Lead scores are automatically re-calculated as contacts engage with sent proposals and emails.`,
  },
  {
    slug: 'multi-warehouse-inventory',
    title: 'Multi-Warehouse Inventory & Reorder Rules',
    category: 'Inventory & Stock',
    description: 'Managing lot tracking, stock transfers between locations, and automatic purchase requisitions.',
    lastUpdated: 'October 2026',
    content: `Track raw materials, assemblies, and finished stock across multiple fulfillment centers. Set automated min/max reorder points that trigger procurement drafts when stock dips below safe thresholds.`,
  },
  {
    slug: 'developer-webhooks-and-api',
    title: 'REST API Authentication & Real-Time Webhooks',
    category: 'API & Webhooks',
    description: 'Integrating external services, generating scoped API keys, and handling HMAC signed webhooks.',
    lastUpdated: 'October 2026',
    content: `All API requests require a Bearer token or api_key header. Webhook notifications are delivered with an HMAC SHA-256 signature in the X-Bahi-Signature header for guaranteed integrity.`,
  },
];

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'job-1',
    slug: 'senior-fullstack-engineer',
    title: 'Senior Full-Stack Engineer (Next.js & NestJS)',
    department: 'Engineering',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    experience: '5+ years',
    salary: '₹28L – ₹42L + Equity',
    description: 'Help architect our multi-tenant Next.js 15 frontends and NestJS enterprise microservices.',
    requirements: [
      'Strong proficiency in TypeScript, React 19, Next.js App Router, and Tailwind CSS.',
      'Extensive experience building robust backend systems in NestJS, Node.js, and PostgreSQL.',
      'Deep understanding of database indexes, query optimization, and schema migrations with Prisma.',
    ],
    responsibilities: [
      'Design and ship end-to-end features across CRM, Sales, and ERP micro-applications.',
      'Collaborate on platform performance, caching, and database query optimization.',
      'Champion code quality, accessibility, and automated integration testing.',
    ],
    isOpen: true,
  },
  {
    id: 'job-2',
    slug: 'principal-product-designer',
    title: 'Lead Product Designer (Design Systems & UI)',
    department: 'Product & Design',
    location: 'Remote (Global)',
    type: 'Full-time',
    experience: '6+ years',
    salary: '$110,000 – $145,000 + Equity',
    description: 'Design intuitive, high-density business interfaces and maintain our Atlas design system.',
    requirements: [
      'Demonstrated portfolio designing complex B2B desktop and mobile productivity tools.',
      'Mastery of Figma, token-based design systems, and WCAG AA accessibility.',
      'Ability to code prototypes or partner closely with frontend engineers.',
    ],
    responsibilities: [
      'Own product ergonomics across all Bahi business modules.',
      'Conduct user research with small business operators and finance controllers.',
      'Refine micro-interactions and dark/light mode token hierarchies.',
    ],
    isOpen: true,
  },
  {
    id: 'job-3',
    slug: 'solutions-architect-enterprise',
    title: 'Enterprise Solutions Architect',
    department: 'Sales & Solutions',
    location: 'Mumbai / Hybrid',
    type: 'Full-time',
    experience: '4+ years',
    salary: '₹22L – ₹35L + Commission',
    description: 'Partner with enterprise clients migrating off legacy SAP, Odoo, and custom ERP software.',
    requirements: [
      'Background in enterprise software implementation and data migrations.',
      'Excellent verbal and written communication with C-suite and finance directors.',
      'Technical comfort reading SQL scripts and mapping REST APIs.',
    ],
    responsibilities: [
      'Conduct customized product demonstrations and proof-of-concept deployments.',
      'Author migration scripts and assist clients with historical data onboarding.',
    ],
    isOpen: true,
  },
];

export const INITIAL_LEGAL_DOCS: Record<string, LegalDocument> = {
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    version: '3.2',
    lastUpdated: 'November 2, 2026',
    summary: 'Clear rules governing your subscription, acceptable use, billing cycles, and intellectual property.',
    content: `### 1. Acceptance of Terms
By creating an account or accessing the Bahi Platform ("Service"), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company, you represent that you have legal authority to bind that entity.

### 2. Subscriptions & Billing
Paid subscriptions are billed in advance on a monthly or annual cadence. Upgrades and downgrades will be prorated according to the remaining days in your billing cycle. All prices are exclusive of applicable local taxes.

### 3. Data Ownership & Customer Intellectual Property
You retain 100% full legal ownership of all data, customer files, invoices, and records entered into the Bahi platform. We will never sell, inspect, or share your proprietary business data with third parties.

### 4. Service Level Commitment
We commit to 99.9% uptime for core ledger and CRM access. Scheduled maintenance windows will be communicated at least 48 hours in advance via our public Status page.

### 5. Termination & Data Portability
You may terminate your subscription at any time via the Customer Billing settings. Upon cancellation, your tenant data will remain available for export for 60 days before being permanently removed according to our cryptographic data retention policies.`,
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    version: '2.8',
    lastUpdated: 'November 2, 2026',
    summary: 'How we collect, encrypt, and respect your personal and organizational business information.',
    content: `### 1. Information We Collect
We collect personal information necessary to provide the service: name, email address, password hash (via bcrypt/argon2), billing address, and payment provider transaction tokens. We do not store raw credit card numbers.

### 2. Use of Information
Your information is used strictly to authenticate sessions, fulfill ERP transactions, process billings, and notify you regarding critical security updates or product changes.

### 3. Data Protection & Encryption
All communications are encrypted in transit using TLS 1.3. Multi-tenant database records are encrypted at rest using AES-256 and logically isolated with PostgreSQL Row-Level Security.

### 4. Your Rights (GDPR & CCPA)
You have the right to request a full machine-readable export of all data stored in your tenant, or to submit a permanent account deletion request via /settings.`,
  },
  cookies: {
    id: 'cookies',
    title: 'Cookie & Tracking Policy',
    version: '1.4',
    lastUpdated: 'October 15, 2026',
    summary: 'Explanation of essential session tokens, preference cookies, and privacy-respecting analytics.',
    content: `### 1. Essential Cookies
We use secure, HttpOnly session cookies to keep you signed in across tabs and prevent Cross-Site Request Forgery (CSRF). These are essential for the operation of the application.

### 2. Preference Cookies
We store your light/dark theme preference and collapsed sidebar state locally in your browser (bahi-theme) to ensure instantaneous rendering without layout shifts.

### 3. Marketing & Analytics
We do not use invasive third-party advertising tracking cookies. Any telemetry collected is strictly aggregated and privacy-preserving to identify performance bottlenecks.`,
  },
  refund: {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    version: '1.2',
    lastUpdated: 'October 10, 2026',
    summary: 'Our fair 30-day money-back guarantee and transparent cancellation terms.',
    content: `### 1. 30-Day Money Back Guarantee
If you are not completely satisfied with Bahi within the first 30 days of activating a paid subscription, contact support@bahi.app for a full 100% refund—no questions asked.

### 2. Cancellations
You can cancel your subscription at any moment from your Billing dashboard. Once canceled, no further recurring charges will be initiated.

### 3. Prorated Upgrades
When switching between tiers, any unused balance from your previous plan will be credited against your new plan invoice automatically.`,
  },
};

export const INITIAL_SYSTEM_SERVICES: SystemServiceStatus[] = [
  { name: 'Core Web Application & App Router', status: 'operational', uptimePercent: 99.99, description: 'Next.js 15 edge clusters' },
  { name: 'REST API & GraphQL Engine', status: 'operational', uptimePercent: 99.98, description: 'NestJS microservices' },
  { name: 'PostgreSQL Multi-Tenant Database', status: 'operational', uptimePercent: 99.99, description: 'High-availability cluster with RLS' },
  { name: 'Redis Cache & Background Queues', status: 'operational', uptimePercent: 100.0, description: 'BullMQ async worker cluster' },
  { name: 'Payment Webhooks & Invoicing', status: 'operational', uptimePercent: 99.95, description: 'Stripe & Razorpay synchronizers' },
  { name: 'Object Storage & Document Attachments', status: 'operational', uptimePercent: 99.99, description: 'S3/MinIO signed URL CDN' },
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-101',
    title: 'Scheduled Database Index Maintenance Complete',
    impact: 'None',
    status: 'Resolved',
    date: 'November 8, 2026',
    description: 'All read replicas updated with pg_trgm indices without query interruption.',
  },
  {
    id: 'inc-100',
    title: 'Temporary Latency in Third-Party Webhook Delivery',
    impact: 'Minor',
    status: 'Resolved',
    date: 'October 24, 2026',
    description: 'Upstream provider experienced minor queue backlog. All events successfully re-delivered.',
  },
];

export const INITIAL_CHANGELOG: ChangelogEntry[] = [
  {
    version: 'v2.4.0',
    date: 'November 2026',
    title: 'Unified Admin Console & Enterprise Support Desk',
    badge: 'Feature',
    description: 'Shipped a comprehensive staff management console with tenant impersonation, live analytics, and centralized plan management.',
    highlights: [
      'Role-based matrix management for multi-tenant organizations',
      'Unified Support Desk with internal staff notes and SLA breach tracking',
      'Instant plan limits synchronization across public pricing and billing',
    ],
  },
  {
    version: 'v2.3.2',
    date: 'October 2026',
    title: 'Double-Entry Accounting & Multi-Currency',
    badge: 'Improvement',
    description: 'Enhanced general ledger reconciliation with automated exchange rate sync for 160+ currencies.',
    highlights: [
      'Automated bank feed parser for CSV and OFX formats',
      'Real-time tax calculation for GST and VAT regimes',
    ],
  },
];

export const INITIAL_FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: 'beta_ai_copilot',
    name: 'AI Sales & Inventory Copilot',
    description: 'Natural language pipeline queries and automated stock restock forecasting.',
    enabled: true,
    rolloutPercentage: 25,
    targetPlans: ['growth', 'business'],
    updatedAt: '2026-11-01',
  },
  {
    key: 'biometric_2fa',
    name: 'WebAuthn / Passkey Biometric 2FA',
    description: 'Hardware key and Apple Touch ID / Windows Hello login support.',
    enabled: true,
    rolloutPercentage: 100,
    targetPlans: ['starter', 'growth', 'business'],
    updatedAt: '2026-10-20',
  },
  {
    key: 'audit_vault_export',
    name: 'SOC2 Immutable Audit Vault Export',
    description: 'Automated weekly S3 export of cryptographically signed audit logs.',
    enabled: false,
    rolloutPercentage: 0,
    targetPlans: ['business'],
    updatedAt: '2026-10-15',
  },
];

// ─── Local Storage Store Helpers ────────────────────────────

const BLOG_KEY = 'bahi_cms_blog_v1';
const JOBS_KEY = 'bahi_cms_jobs_v1';
const FLAGS_KEY = 'bahi_cms_flags_v1';
const CHANGELOG_KEY = 'bahi_cms_changelog_v1';

export function getBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return INITIAL_BLOG_POSTS;
  try {
    const raw = localStorage.getItem(BLOG_KEY);
    return raw ? JSON.parse(raw) : INITIAL_BLOG_POSTS;
  } catch {
    return INITIAL_BLOG_POSTS;
  }
}

export function saveBlogPosts(posts: BlogPost[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
}

export function getJobOpenings(): JobOpening[] {
  if (typeof window === 'undefined') return INITIAL_JOBS;
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_JOBS;
  } catch {
    return INITIAL_JOBS;
  }
}

export function saveJobOpenings(jobs: JobOpening[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getFeatureFlags(): FeatureFlag[] {
  if (typeof window === 'undefined') return INITIAL_FEATURE_FLAGS;
  try {
    const raw = localStorage.getItem(FLAGS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_FEATURE_FLAGS;
  } catch {
    return INITIAL_FEATURE_FLAGS;
  }
}

export function saveFeatureFlags(flags: FeatureFlag[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
}

export function getChangelogEntries(): ChangelogEntry[] {
  if (typeof window === 'undefined') return INITIAL_CHANGELOG;
  try {
    const raw = localStorage.getItem(CHANGELOG_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CHANGELOG;
  } catch {
    return INITIAL_CHANGELOG;
  }
}

export function saveChangelogEntries(entries: ChangelogEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHANGELOG_KEY, JSON.stringify(entries));
}

