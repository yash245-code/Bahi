/**
 * Bahi ERP — Static Image & Logo Asset Registry
 *
 * All files are located in `public/images/` and served at `/images/...`
 */

export const IMAGES = {
  // Brand Logos
  logo: '/images/logo.svg',
  logoWhite: '/images/logo-white.svg',
  logoHorizontal: '/images/logo-horizontal.svg',
  logoHorizontalDark: '/images/logo-horizontal-dark.svg',
  favicon: '/images/favicon.svg',

  // Suite & Module Logos
  modules: {
    crm: '/images/module-crm.svg',
    inventory: '/images/module-inventory.svg',
    accounting: '/images/module-accounting.svg',
    sales: '/images/module-sales.svg',
    hr: '/images/module-hr.svg',
    projects: '/images/module-projects.svg',
    billing: '/images/module-billing.svg',
  },

  // Tech & Integration Badges
  integrations: {
    mongodbAtlas: '/images/mongodb-atlas.svg',
    turborepo: '/images/turborepo.svg',
  },

  // UI Previews & Showcase
  previews: {
    dashboardPreview: '/images/dashboard-preview.jpg',
  },
} as const;

export type ImageAssetKey = keyof typeof IMAGES;
export type ModuleLogoKey = keyof typeof IMAGES.modules;
