import { LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AdminBreadcrumb } from './AdminBreadcrumb';
import { getProductImage } from '../../utils/media';

const AUTH_KEY = 'world-design-admin-auth';

function getStoredUser() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const auth = JSON.parse(stored);
    return auth?.state?.user || null;
  } catch {
    return null;
  }
}

function getUserDisplayName(user) {
  if (!user) return 'Administrateur';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.email || 'Administrateur';
}

export function AdminHeader() {
  const navigate = useNavigate();
  const user = getStoredUser();

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
      const { getAdminProducts } = await import('../../api/adminProducts');
      const data = await getAdminProducts({ search: query.trim(), page_size: 8 });
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
      setValue(results[highlightIndex].name);
      setIsOpen(false);
      return;
    }
    if (value.trim()) {
      navigate(`/admin/products?search=${encodeURIComponent(value.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSelect = (product) => {
    setValue(product.name);
    setIsOpen(false);
    navigate(`/admin/products?search=${encodeURIComponent(product.name)}`);
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

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    navigate('/admin', { replace: true });
  };

  const hasResults = results.length > 0;
  const showPanel = isOpen && (loading || hasResults || (value.trim() && !hasResults));

  return (
    <header className="border-b border-[#E0DBD5] bg-white">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <AdminBreadcrumb />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher un produit (nom, réf, ID)..."
                className="h-9 w-full rounded-[8px] border border-[#E0DBD5] bg-[#F8F5F0] pl-9 pr-8 text-sm text-text-dark outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311] focus:bg-white focus:shadow-[0_0_0_3px_rgba(23,19,17,0.06)]"
              />
              {value ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A9A095] transition hover:text-[#171311]"
                  aria-label="Effacer"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </form>

            {showPanel ? (
              <div
                ref={panelRef}
                className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-[10px] border border-[#E0DBD5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
              >
                {loading ? (
                  <div className="space-y-2 p-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex animate-pulse items-center gap-3">
                        <div className="h-7 w-7 rounded-[4px] bg-[#F1ECE6]" />
                        <div className="h-3.5 flex-1 rounded bg-[#F1ECE6]" />
                      </div>
                    ))}
                  </div>
                ) : hasResults ? (
                  <div>
                    <div className="border-b border-[#F1ECE6] px-3 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A9A095]">
                        {results.length} résultat{results.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <ul className="max-h-64 overflow-y-auto py-0.5">
                      {results.map((product, index) => (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(product)}
                            onMouseEnter={() => setHighlightIndex(index)}
                            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition ${
                              highlightIndex === index
                                ? 'bg-[#F8F5F0] text-text-dark'
                                : 'text-text-dark hover:bg-[#F8F5F0]'
                            }`}
                          >
                            <img
                              src={getProductImage(product) || '/placeholder.svg'}
                              alt=""
                              className="h-8 w-8 shrink-0 rounded-[4px] object-cover bg-[#F1ECE6]"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{product.name}</p>
                              <p className="truncate text-[10px] text-[#A9A095]">
                                {product.reference || `WD${String(product.id).padStart(4, '0')}`}
                                {product.category_name ? ` · ${product.category_name}` : ''}
                              </p>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              product.is_active
                                ? 'bg-[#D1FAE5] text-[#065F46]'
                                : 'bg-[#FEE2E2] text-[#991B1B]'
                            }`}>
                              {product.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-[#A9A095]">
                    Aucun produit trouvé
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <p className="hidden text-sm font-medium text-text-dark sm:block">{getUserDisplayName(user)}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:opacity-90"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
