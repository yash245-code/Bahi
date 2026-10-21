import { CrmProductsView } from '@bahi/app-crm/web';

export const metadata = {
  title: 'Products & Price Book | Bahi CRM',
  description: 'Catalog products, pricing tiers, recurring license SKUs, and active proposal attachments.',
};

export default function ProductsPage() {
  return <CrmProductsView />;
}
