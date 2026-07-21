import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, SearchX, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { getCategories, getProducts } from '../api/catalog';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Pagination } from '../components/Pagination';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/skeletons/ProductGridSkeleton';
import { SectionHeading } from '../components/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  usePageTitle('Catalogue');

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [productsData, setProductsData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debounceRef = useRef(null);

  const currentPage = Math.max(1, Number(searchParams.get('page') || 1));
  const searchParamsString = searchParams.toString();
  const totalPages = Math.max(1, Math.ceil(Number(productsData.count || 0) / PAGE_SIZE));
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const nextCategories = await getCategories();
        if (!isMounted) return;
        setCategories(nextCategories);
      } catch {
        if (!isMounted) return;
        setCategories([]);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }

    loadCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const selectedCategory = location.state?.selectedCategory;
    if (selectedCategory) {
      window.history.replaceState({}, '', location.pathname + location.search);
    }
  }, [location.state, location.pathname, location.search]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        page_size: PAGE_SIZE,
      };

      if (searchParams.get('category')) {
        params.category = searchParams.get('category');
      }
      if (searchParams.get('search')) {
        params.search = searchParams.get('search');
      }

      try {
        const data = await getProducts(params);
        if (!isMounted) return;
        setProductsData({
          count: Number(data.count || 0),
          next: data.next || null,
          previous: data.previous || null,
          results: Array.isArray(data.results) ? data.results : [],
        });
      } catch (caughtError) {
        if (!isMounted) return;
        setError(caughtError?.message || 'Impossible de charger le catalogue.');
        setProductsData({ count: 0, next: null, previous: null, results: [] });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();
    return () => { isMounted = false; };
  }, [currentPage, searchParamsString]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams();
      if (value.trim()) nextParams.set('search', value.trim());
      if (activeCategory) nextParams.set('category', activeCategory);
      nextParams.set('page', '1');
      setSearchParams(nextParams, { replace: false });
    }, 400);
  };

  const handleCategoryChange = (value) => {
    const nextParams = new URLSearchParams();
    if (value) nextParams.set('category', value);
    if (searchParams.get('search')) nextParams.set('search', searchParams.get('search'));
    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: false });
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: false });
  };

  const activeCategoryLabel = useMemo(() => {
    if (!activeCategory) return 'toutes les catégories';
    return categories.find((c) => c.slug === activeCategory)?.name || activeCategory;
  }, [categories, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F6F1EA]">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[#E5DDD4] bg-white shadow-[0_20px_60px_rgba(19,16,13,0.06)]">
          <div className="border-b border-[#F0E8DE] bg-gradient-to-br from-[#FFFDF8] via-[#FFF8F0] to-[#F7EFE4] px-6 py-8 sm:px-8 sm:py-10">
            <SectionHeading
              eyebrow="Catalogue"
              title="Des objets pensés pour représenter votre marque"
              description="Filtrez les pièces, explorez les visuels et conservez celles qui vous ressemblent dans votre sélection."
            />
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_auto]">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#8D8175]">
                  Rechercher
                </span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
                  <input
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Nom du produit, mot-clé, référence..."
                    className="h-12 w-full rounded-full border border-[#E5DDD4] bg-[#FCFAF6] pl-11 pr-4 text-sm text-[#171311] outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#8D8175]">
                  Catégorie
                </span>
                <div className="relative">
                  <select
                    value={activeCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="h-12 w-full appearance-none rounded-full border border-[#E5DDD4] bg-[#FCFAF6] px-4 pr-10 text-sm text-[#171311] outline-none transition focus:border-[#171311]"
                  >
                    <option value="">Toutes les catégories</option>
                    {loadingCategories ? (
                      <option value="">Chargement...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
                </div>
              </label>

              <div className="flex items-end">
                {(activeCategory || searchParams.get('search')) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-[#E5DDD4] bg-white px-4 text-sm font-semibold text-[#171311] transition hover:border-[#A58A63] hover:text-[#A58A63]"
                  >
                    <SearchX className="h-4 w-4" />
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#6F6257]">
                {loading
                  ? 'Chargement des pièces...'
                  : `${productsData.count} résultat(s) dans ${activeCategoryLabel}`}
              </p>
              {!loading && totalPages > 1 && (
                <p className="text-sm text-[#6F6257]">
                  Page {currentPage} sur {totalPages}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-8">
            {loading ? (
              <div className="mt-2">
                <ProductGridSkeleton count={6} />
              </div>
            ) : error ? (
              <div className="mt-2">
                <ErrorState description={error} onRetry={() => window.location.reload()} />
              </div>
            ) : productsData.results.length > 0 ? (
              <div className="mt-2">
                {Array.from({ length: Math.ceil(productsData.results.length / 7) }).map((_, rowIndex) => {
                  const row = productsData.results.slice(rowIndex * 7, rowIndex * 7 + 7);
                  return (
                    <div key={rowIndex} className="group/row relative mt-6 first:mt-0">
                      <div
                        id={`product-row-${rowIndex}`}
                        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <style>{`#product-row-${rowIndex}::-webkit-scrollbar { display: none; }`}</style>
                        {row.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>

                      {row.length >= 7 && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`product-row-${rowIndex}`);
                              if (el) el.scrollBy({ left: -700, behavior: 'smooth' });
                            }}
                            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white group-hover/row:block"
                            aria-label="Défiler vers la gauche"
                          >
                            <ArrowRight className="h-5 w-5 rotate-180" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`product-row-${rowIndex}`);
                              if (el) el.scrollBy({ left: 700, behavior: 'smooth' });
                            }}
                            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:bg-white group-hover/row:block"
                            aria-label="Défiler vers la droite"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2">
                <EmptyState
                  title="Aucun résultat"
                  description="Essayez une autre catégorie ou un autre mot-clé pour découvrir davantage de pièces."
                  action={(
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 rounded-full bg-[#171311] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2A241F]"
                    >
                      Retour à l'accueil
                    </Link>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
