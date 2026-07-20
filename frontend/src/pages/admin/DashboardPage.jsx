import { useCallback, useEffect, useState } from 'react';
import { Package, FolderOpen, RefreshCw } from 'lucide-react';

import { getAdminProducts } from '../../api/adminProducts';
import { getCategories } from '../../api/catalog';
import { AdminPage } from '../../components/admin/AdminPage';
import { ErrorState } from '../../components/ErrorState';
import { DashboardSkeleton } from '../../components/skeletons/DashboardSkeleton';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function DashboardPage() {
  usePageTitle('Admin dashboard');

  const [stats, setStats] = useState({ productsCount: 0, categoriesCount: 0, activeProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productsData, categories] = await Promise.all([
        getAdminProducts({ page_size: 1 }),
        getCategories(),
      ]);

      const productsCount = Number(productsData?.count || 0);
      const categoriesCount = categories.length || 0;

      // Get active products count
      const activeData = await getAdminProducts({ page_size: 1, is_active: 'true' });
      const activeProducts = Number(activeData?.count || 0);

      setStats({ productsCount, categoriesCount, activeProducts });
    } catch (err) {
      setError(err?.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState description={error} onRetry={loadStats} />;

  return (
    <AdminPage title="Tableau de bord">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total produits</p>
              <p className="text-2xl font-bold text-gray-900">{stats.productsCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Produits actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Catégories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categoriesCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={loadStats}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>
    </AdminPage>
  );
}