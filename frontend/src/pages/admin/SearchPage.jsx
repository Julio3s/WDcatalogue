import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { AdminPage } from '../../components/admin/AdminPage';
import { ErrorState } from '../../components/ErrorState';
import { usePageTitle } from '../../hooks/usePageTitle';
import { getProductImage } from '../../utils/media';

function ProductDetailView({ product, onBack }) {
  return (
    <div className="animate-fadeIn">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#A58A63] transition hover:text-[#8E734D]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux résultats
      </button>

      <div className="overflow-hidden rounded-[16px] border border-[#E0DBD5] bg-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="bg-[#F8F5F0]">
            {product.image_url || product.image ? (
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center text-[#B9ADA0]">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-text-dark">{product.name}</h2>
                <p className="mt-1 text-sm text-[#A9A095]">
                  {product.reference || `WD${String(product.id).padStart(4, '0')}`}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  product.is_active
                    ? 'bg-[#D1FAE5] text-[#065F46]'
                    : 'bg-[#FEE2E2] text-[#991B1B]'
                }`}
              >
                {product.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>

            {product.category_name ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A9A095]">Catégorie</p>
                <p className="mt-0.5 text-sm font-medium text-text-dark">{product.category_name}</p>
              </div>
            ) : null}

            {product.description ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A9A095]">Description</p>
                <p className="mt-0.5 text-sm leading-7 text-text-muted">{product.description}</p>
              </div>
            ) : null}

            <div className="mt-auto flex flex-wrap gap-3 pt-4">
              <Link
                to={`/products/${product.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-[#171311] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A241F]"
              >
                Voir sur le site
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                to={`/admin/products?search=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#E0DBD5] bg-white px-5 py-2.5 text-sm font-semibold text-text-dark transition hover:border-[#A58A63]"
              >
                Modifier dans la liste
              </Link>
            </div>

            {product.models && product.models.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A9A095]">
                  Modèles ({product.models.length})
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {product.models.map((m) => (
                    <span
                      key={m.id}
                      className="rounded-full border border-[#E0DBD5] bg-white px-3 py-1 text-xs font-medium text-text-dark"
                    >
                      {m.model_value}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {product.is_customizable ? (
              <div className="rounded-[8px] bg-[#FEF3C7] px-4 py-2 text-xs font-medium text-[#92400E]">
                Produit personnalisable
                {product.customization_hint ? ` — ${product.customization_hint}` : ''}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  usePageTitle('Recherche admin');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);
    setSelectedProduct(null);

    try {
      const { getAdminProducts } = await import('../../api/adminProducts');
      const data = await getAdminProducts({ search: searchQuery.trim(), page_size: 50 });
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (caughtError) {
      setError(caughtError?.message || 'Erreur lors de la recherche.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(val);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setSelectedProduct(null);
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (selectedProduct) {
    return (
      <AdminPage title="Détail du produit" description={selectedProduct.name}>
        <ProductDetailView product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Recherche"
      description="Trouvez rapidement un produit par son nom, sa référence (WDxxxx) ou son ID."
    >
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A9A095]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Rechercher par nom, référence (WD0001) ou ID..."
          className="h-14 w-full rounded-[14px] border border-[#E0DBD5] bg-white pl-12 pr-12 text-base text-text-dark outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311] focus:shadow-[0_0_0_4px_rgba(23,19,17,0.06)]"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A9A095] transition hover:text-[#171311]"
            aria-label="Effacer"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 rounded-[12px] border border-[#F1ECE6] bg-white p-4">
                <div className="h-14 w-14 shrink-0 rounded-[8px] bg-[#F1ECE6]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-[#F1ECE6]" />
                  <div className="h-3 w-1/2 rounded bg-[#F1ECE6]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState description={error} onRetry={() => doSearch(query)} />
        ) : searched && results.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#E0DBD5] bg-white px-6 py-12 text-center">
            <Search className="mx-auto h-10 w-10 text-[#D4CCC2]" />
            <p className="mt-3 text-sm font-medium text-text-dark">
              Aucun résultat pour "{query}"
            </p>
            <p className="mt-1 text-xs text-[#A9A095]">
              Essayez avec un autre terme, une référence (WD0001) ou un ID
            </p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="mb-3 text-sm text-[#A9A095]">
              {results.length} résultat{results.length > 1 ? 's' : ''} pour "{query}"
            </p>
            <div className="grid gap-3">
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className="flex w-full items-center gap-4 rounded-[12px] border border-[#E0DBD5] bg-white p-4 text-left transition hover:border-[#A58A63] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <img
                    src={getProductImage(product) || '/placeholder.svg'}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-[8px] object-cover bg-[#F1ECE6]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-dark">{product.name}</p>
                    <p className="mt-0.5 text-xs text-[#A9A095]">
                      {product.reference || `WD${String(product.id).padStart(4, '0')}`}
                      {product.category_name ? ` · ${product.category_name}` : ''}
                    </p>
                    {product.description ? (
                      <p className="mt-1 line-clamp-1 text-xs text-text-muted">{product.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        product.is_active
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : 'bg-[#FEE2E2] text-[#991B1B]'
                      }`}
                    >
                      {product.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="text-[10px] text-[#B9ADA0]">
                      ID: {product.id}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : !searched ? (
          <div className="rounded-[12px] border border-dashed border-[#E0DBD5] bg-white px-6 py-16 text-center">
            <Search className="mx-auto h-12 w-12 text-[#D4CCC2]" />
            <p className="mt-4 text-sm font-medium text-text-dark">
              Commencez à taper pour rechercher
            </p>
            <p className="mt-1 text-xs text-[#A9A095]">
              Vous pouvez chercher par nom, référence (ex: WD0042) ou ID numérique
            </p>
          </div>
        ) : null}
      </div>
    </AdminPage>
  );
}