import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getProductImage } from '../../utils/media';

export function AdminSearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const panelRef = useRef(null);

  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Use the admin API search with a small page size for quick results
      const { getAdminProducts } = await import('../../api/adminProducts');
      const data = await getAdminProducts({ search: query.trim(), page_size: 10 });
      const items = Array.isArray(data.results) ? data.results : [];
      setResults(items);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setHighlightIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchProducts(val);
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (highlightIndex >= 0 && results[highlightIndex]) {
      onSearch?.(results[highlightIndex].name);
      setIsOpen(false);
      return;
    }
    onSearch?.(value.trim());
    setIsOpen(false);
  };

  const handleSelect = (product) => {
    setValue(product.name);
    setIsOpen(false);
    onSearch?.(product.name);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setValue('');
    setResults([]);
    setIsOpen(false);
    onSearch?.('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = results.length > 0;
  const showPanel = isOpen && (loading || hasResults || (value.trim() && !hasResults));

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher par nom, référence (WDxxxx) ou ID..."
          className="h-11 w-full rounded-[10px] border border-[#E0DBD5] bg-white pl-10 pr-10 text-sm text-text-dark outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311] focus:shadow-[0_0_0_3px_rgba(23,19,17,0.06)]"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9A095] transition hover:text-[#171311]"
            aria-label="Effacer la recherche"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </form>

      {showPanel ? (
        <div
          ref={panelRef}
          className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-[12px] border border-[#E0DBD5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        >
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-3">
                  <div className="h-8 w-8 rounded-[6px] bg-[#F1ECE6]" />
                  <div className="h-4 flex-1 rounded bg-[#F1ECE6]" />
                </div>
              ))}
            </div>
          ) : hasResults ? (
            <div>
              <div className="border-b border-[#F1ECE6] px-4 py-2">
                <span className="text-xs font-semibold text-[#A9A095]">
                  {results.length} résultat{results.length > 1 ? 's' : ''}
                </span>
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((product, index) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(product)}
                      onMouseEnter={() => setHighlightIndex(index)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                        highlightIndex === index
                          ? 'bg-[#F8F5F0] text-text-dark'
                          : 'text-text-dark hover:bg-[#F8F5F0]'
                      }`}
                    >
                      <img
                        src={getProductImage(product) || '/placeholder.svg'}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-[6px] object-cover bg-[#F1ECE6]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="truncate text-xs text-[#A9A095]">
                          {product.reference || `WD${String(product.id).padStart(4, '0')}`}
                          {product.category_name ? ` · ${product.category_name}` : ''}
                        </p>
                      </div>
                      {product.is_active ? (
                        <span className="shrink-0 rounded-full bg-[#D1FAE5] px-2 py-0.5 text-[10px] font-semibold text-[#065F46]">
                          Actif
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-semibold text-[#991B1B]">
                          Inactif
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#F1ECE6] px-4 py-2 text-center">
                <span className="text-xs text-[#A9A095]">
                  ↵ pour rechercher tout le catalogue
                </span>
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[#A9A095]">
              Aucun produit trouvé pour "{value.trim()}"
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}