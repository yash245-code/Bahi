import { ApplicationManifest } from '@bahi/types';

export const inventoryManifest: ApplicationManifest = {
  id: 'inventory',
  name: 'Inventory & Stock',
  description: 'Multi-warehouse stock movements, SKU tracking, batches, and reorder levels.',
  icon: 'CubeIcon',
  colorToken: 'module-inventory',
  version: '2.0.1',
  backendModule: 'InventoryModule',
  routePrefix: '/inventory',
  permissions: [
    'view:products',
    'manage:products',
    'view:stock',
    'manage:stock',
  ],
  plans: ['growth', 'enterprise'],
  defaultFeatureFlags: {
    'inventory.multiWarehouse': true,
    'inventory.batchTracking': false,
  },
  navigation: [
    { label: 'Products & Warehouses', href: '/inventory', icon: 'CubeIcon' },
  ],
};

export default inventoryManifest;
