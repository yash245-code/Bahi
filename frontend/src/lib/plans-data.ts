// ═══════════════════════════════════════════════════════════
// Bahi SaaS Platform — Single Source of Truth for Plans
// Shared across Public Pricing, Customer Billing & Admin Plans
// ═══════════════════════════════════════════════════════════

export interface PlanFeatureItem {
  name: string;
  included: boolean;
  tooltip?: string;
}

export interface PlanTierData {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number; // per month billed annually
  popular?: boolean;
  enterprise?: boolean;
  trialDays: number;
  limits: {
    seats: number | 'Unlimited';
    storageGb: number | 'Unlimited';
    contacts: number | 'Unlimited';
    monthlyInvoices: number | 'Unlimited';
    apiRequestsMonth: string;
  };
  modulesIncluded: string[];
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface PlanFaqItem {
  question: string;
  answer: string;
  category: 'Billing' | 'Features' | 'Security';
}

export const INITIAL_PLANS: PlanTierData[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small teams and solopreneurs standardizing core business ops.',
    monthlyPrice: 29,
    annualPrice: 24,
    popular: false,
    trialDays: 14,
    limits: {
      seats: 3,
      storageGb: 10,
      contacts: 1000,
      monthlyInvoices: 100,
      apiRequestsMonth: '10,000 / mo',
    },
    modulesIncluded: ['Core CRM', 'Sales Pipeline', 'Lead Scoring', 'Basic Invoicing'],
    features: [
      'Up to 3 team members',
      'Unified CRM & Contact Directory',
      'Sales Deals & Visual Kanban Board',
      'Standard Quotations & Invoicing',
      'Email & Calendar Integration',
      'Community & Standard Email Support',
      '10 GB Encrypted File Storage',
    ],
    ctaLabel: 'Start 14-Day Free Trial',
    ctaHref: '/signup?plan=starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For fast-growing companies requiring inventory, multi-channel sales & accounting.',
    monthlyPrice: 79,
    annualPrice: 65,
    popular: true,
    trialDays: 14,
    limits: {
      seats: 15,
      storageGb: 100,
      contacts: 15000,
      monthlyInvoices: 1000,
      apiRequestsMonth: '100,000 / mo',
    },
    modulesIncluded: [
      'Core CRM',
      'Sales Suite',
      'Multi-Warehouse Inventory',
      'Double-Entry Accounting',
      'Document Signing',
      'Procurement',
    ],
    features: [
      'Up to 15 team members',
      'Everything in Starter',
      'Warehouse & Stock Move Tracking',
      'Automated Purchase Orders & Reorder Points',
      'General Ledger & Bank Reconciliation',
      'Multi-Currency Support (160+ Currencies)',
      'Automated Email & Webhook Sequences',
      'Priority 4-Hour Support SLA',
      '100 GB High-Speed Storage',
    ],
    ctaLabel: 'Start 14-Day Free Trial',
    ctaHref: '/signup?plan=growth',
  },
  {
    id: 'business',
    name: 'Enterprise / Business',
    tagline: 'Full unified enterprise OS with HR, Projects, dedicated account manager, & RLS.',
    monthlyPrice: 199,
    annualPrice: 165,
    popular: false,
    enterprise: true,
    trialDays: 30,
    limits: {
      seats: 'Unlimited',
      storageGb: 'Unlimited',
      contacts: 'Unlimited',
      monthlyInvoices: 'Unlimited',
      apiRequestsMonth: 'Unlimited (High-Rate)',
    },
    modulesIncluded: [
      'All 8 ERP Applications',
      'HR & Payroll Ledger',
      'Attendance & Leave Tracking',
      'Project Milestones & Timesheets',
      'Custom Roles & Field Permissions',
      'Dedicated Instance / Custom Domain',
    ],
    features: [
      'Unlimited team members',
      'Everything in Growth',
      'Employee Directory, Leaves & Payroll',
      'Gantt & Kanban Project Portfolio',
      'Custom Role-Based Access Control Matrix',
      'Audit Logs & Regulatory Compliance Export',
      'Custom Domain with Auto SSL',
      '1-Hour Dedicated Support SLA + Account Manager',
      'SSO (SAML, Okta, Google Workspace)',
    ],
    ctaLabel: 'Contact Sales / Custom Demo',
    ctaHref: '/contact?intent=enterprise',
  },
];

export const PRICING_FAQS: PlanFaqItem[] = [
  {
    question: 'Can I switch or upgrade my plan at any time?',
    answer:
      'Yes! You can instantly upgrade or switch plans inside your Billing dashboard. Upgrades take effect immediately with pro-rated billing calculation.',
    category: 'Billing',
  },
  {
    question: 'What happens when my 14-day free trial ends?',
    answer:
      'No credit card is required to begin. At the end of 14 days, you can choose to activate a paid subscription or export your data at any time without lock-in.',
    category: 'Billing',
  },
  {
    question: 'How does multi-tenant data privacy work on Bahi?',
    answer:
      'Each organization resides in isolated logical partitions with PostgreSQL Row-Level Security (RLS) and cryptographic tenant isolation. Enterprise tiers can also configure custom domains.',
    category: 'Security',
  },
  {
    question: 'Are there any hidden fees or per-user addon penalties?',
    answer:
      'No hidden fees. Every plan includes all specified modules, automatic nightly backups, SSL encryption, and API access up to the plan limit.',
    category: 'Billing',
  },
  {
    question: 'Can we integrate Bahi with our existing tools and payment gateways?',
    answer:
      'Yes. Bahi includes first-class webhook dispatchers, RESTful API keys, Zapier hooks, and native Stripe & Razorpay invoice synchronization.',
    category: 'Features',
  },
];

const STORAGE_KEY = 'bahi_plans_config_v1';

export function getActivePlans(): PlanTierData[] {
  if (typeof window === 'undefined') return INITIAL_PLANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PLANS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PLANS;
  } catch {
    return INITIAL_PLANS;
  }
}

export function saveActivePlans(plans: PlanTierData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    // Dispatch event so other tabs or components can react
    window.dispatchEvent(new Event('bahi_plans_updated'));
  } catch (e) {
    console.error('Failed to save plans to storage', e);
  }
}

