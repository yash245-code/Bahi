import { CrmProductsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Products & Pricing | Bahi CRM',
  description: 'View your product catalog, standard pricing, recurring plans, and add items directly to quotes.',
};

export default function ProductsPage() {
  return <CrmProductsView />;
}
