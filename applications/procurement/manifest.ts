import { ApplicationManifest } from '@bahi/types';

export const procurementManifest: ApplicationManifest = {
  id: 'procurement',
  name: 'Purchases',
  description: 'Order supplies from vendors, compare prices, and check shipments when they arrive.',
  icon: 'TruckIcon',
  colorToken: 'module-procurement',
  version: '1.0.0',
  backendModule: 'ProcurementModule',
  routePrefix: '/procurement',
  permissions: [
    'view:procurement',
    'manage:procurement',
    'view:purchase_orders',
    'manage:purchase_orders',
    'view:suppliers',
    'manage:suppliers',
    'view:shipments',
    'manage:shipments',
  ],
  plans: ['starter', 'growth', 'enterprise'],
  defaultFeatureFlags: {
    'procurement.orders': true,
    'procurement.suppliers': true,
    'procurement.receiving': true,
    'procurement.rfq': true,
  },
  navigation: [
    { label: 'Purchase Orders', href: '/procurement', icon: 'DocumentTextIcon' },
    { label: 'Suppliers & Vendors', href: '/procurement#suppliers', icon: 'BuildingStorefrontIcon' },
    { label: 'Shipment Receiving', href: '/procurement#receiving', icon: 'TruckIcon' },
    { label: 'Price Comparison', href: '/procurement#pricing', icon: 'ScaleIcon' },
  ],
};

export default procurementManifest;

