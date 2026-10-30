import { ApplicationManifest } from '@bahi/types';

export const inventoryManifest: ApplicationManifest = {
  id: 'inventory',
  name: 'Stock & Inventory',
  description: 'Track items in storage, get low stock alerts, and record shipments.',
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
    { label: 'Items & Warehouses', href: '/inventory', icon: 'CubeIcon' },
  ],
};

export default inventoryManifest;
