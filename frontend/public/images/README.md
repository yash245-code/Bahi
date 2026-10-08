# Bahi ERP — Brand & Image Assets

This directory contains the core brand marks, application logos, and graphic assets for **Bahi ERP**.

---

## 🎨 Asset Catalog

### 1. Brand Logos
| File | Format | Description | Dimensions |
| :--- | :---: | :--- | :--- |
| [`logo.svg`](./logo.svg) | SVG | Primary Bahi emblem in terracotta/rust with artisan ledger detailing | 256 × 256 |
| [`logo-white.svg`](./logo-white.svg) | SVG | Clean white vector mark for dark surfaces | 256 × 256 |
| [`logo-horizontal.svg`](./logo-horizontal.svg) | SVG | Horizontal lockup (Icon + "Bahi" serif + "ERP" badge) for light themes | 380 × 64 |
| [`logo-horizontal-dark.svg`](./logo-horizontal-dark.svg) | SVG | Horizontal lockup optimized for dark navbar (`#222222`) | 380 × 64 |
| [`favicon.svg`](./favicon.svg) | SVG | Scalable browser favicon | 64 × 64 |

### 2. Module & Application Logos
| File | Module | Palette / Hex |
| :--- | :--- | :--- |
| [`module-crm.svg`](./module-crm.svg) | CRM & Deal Pipelines | Terracotta Rust (`#C2542F`) |
| [`module-inventory.svg`](./module-inventory.svg) | Inventory & Stock | Sapphire Blue (`#3E7FBF`) |
| [`module-accounting.svg`](./module-accounting.svg) | General Ledger & Finance | Emerald Green (`#2E9169`) |
| [`module-sales.svg`](./module-sales.svg) | Sales & Growth Metrics | Warm Coral (`#D96B43`) |
| [`module-hr.svg`](./module-hr.svg) | HR & People Management | Mulberry Rose (`#C24A6B`) |
| [`module-projects.svg`](./module-projects.svg) | Projects & Gantt Milestones | Amber Gold (`#D1A536`) |
| [`module-billing.svg`](./module-billing.svg) | Invoices & Tax Billing | Slate Platinum (`#8B8D85`) |

### 3. Tech Integrations & Badges
| File | Description |
| :--- | :--- |
| [`mongodb-atlas.svg`](./mongodb-atlas.svg) | MongoDB Atlas Leaf Database Badge |
| [`turborepo.svg`](./turborepo.svg) | Turborepo Monorepo Badge |

### 4. UI Previews
| File | Format | Description |
| :--- | :---: | :--- |
| [`dashboard-preview.jpg`](./dashboard-preview.jpg) | JPEG | High-resolution dark artisan ERP dashboard preview |

---

## 💻 Usage in Next.js

### Direct Path (Public Folder)
Next.js automatically serves files in `public/` from root:
```tsx
import Image from 'next/image';

// In JSX:
<Image 
  src="/images/logo-horizontal-dark.svg" 
  alt="Bahi ERP" 
  width={190} 
  height={32} 
/>
```

### Typed Asset Import
```tsx
import { IMAGES } from '@/assets/images';

<img src={IMAGES.logo} alt="Bahi" className="w-8 h-8" />
<img src={IMAGES.modules.crm} alt="CRM" className="w-10 h-10" />
```
