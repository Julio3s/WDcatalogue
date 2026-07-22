import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid } from 'lucide-react';

import { CategoryCard } from '../components/CategoryCard';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { PageTransition } from '../components/PageTransition';
import { SectionHeading } from '../components/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';
import { getCategories } from '../api/catalog';

export default function CategoriesPage() {
  usePageTitle('Catégories');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      setError(err?.message || 'Impossible de charger les catégories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F6F1EA] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Univers"
            title="Toutes les catégories"
            description="Explorez notre catalogue par univers pour trouver plus facilement les pièces qui correspondent à votre projet."
          />

          <div className="mt-12">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-[24px] bg-[#F8F5F0]" />
                ))}
              </div>
            ) : error ? (
              <ErrorState description={error} onRetry={loadCategories} />
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aucune catégorie disponible"
                description="Créez des catégories depuis l'administration pour structurer la vitrine du catalogue."
                action={(
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Voir le catalogue
                  </Link>
                )}
              />
            )}
          </div>

          {!loading && categories.length > 0 ? (
            <div className="mt-16 text-center">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#171311] px-7 py-4 text-sm font-bold text-white transition-all hover:bg-[#2A241F] active:scale-[0.98]"
              >
                Voir tous les produits
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}