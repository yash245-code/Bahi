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
    { label: 'Stock Items & Catalog', href: '/inventory', icon: 'CubeIcon' },
    { label: 'Rooms & Warehouses', href: '/inventory#warehouses', icon: 'BuildingStorefrontIcon' },
    { label: 'Stock Moves & Ledger', href: '/inventory#moves', icon: 'ArrowsRightLeftIcon' },
    { label: 'Low Stock Alerts', href: '/inventory#alerts', icon: 'ExclamationTriangleIcon' },
  ],
};

export default inventoryManifest;
