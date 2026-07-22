import { LayoutDashboard, Package, Search, Tags } from 'lucide-react';

export const ADMIN_NAV_ITEMS = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    shortLabel: 'Accueil',
    breadcrumb: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/admin/search',
    label: 'Recherche',
    shortLabel: 'Recherche',
    breadcrumb: 'Recherche',
    icon: Search,
  },
  {
    to: '/admin/products',
    label: 'Produits',
    shortLabel: 'Produits',
    breadcrumb: 'Produits',
    icon: Package,
  },
  {
    to: '/admin/categories',
    label: 'Catégories',
    shortLabel: 'Catégories',
    breadcrumb: 'Catégories',
    icon: Tags,
  },
];

export function getAdminNavItem(pathname) {
  return ADMIN_NAV_ITEMS.find((item) => pathname.startsWith(item.to)) || null;
}
