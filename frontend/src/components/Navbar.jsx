import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X, House, LayoutGrid, Info, HelpCircle } from 'lucide-react';

import { useSelectionStore } from '../store/selectionStore';

const NAV_LINKS = [
  { to: '/', label: 'Accueil', end: true, icon: House },
  { to: '/products', label: 'Catalogue', end: false, icon: LayoutGrid },
  { to: '/info', label: 'À propos', end: false, icon: Info },
  { to: '/faq', label: 'FAQ', end: false, icon: HelpCircle },
];

function NavPill({ to, end, children, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition',
          isActive
            ? 'bg-[#171311] text-white shadow-[0_10px_30px_rgba(23,19,17,0.18)]'
            : 'text-[#4C4138] hover:bg-[#F4EFE8] hover:text-[#171311]',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  );
}

function MobileDockButton({ active = false, children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-semibold transition',
        active
          ? 'bg-[#171311] text-white shadow-[0_10px_24px_rgba(23,19,17,0.22)]'
          : 'text-[#5B5146] hover:bg-[#F4EFE8]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function MobileNavLink({ to, end, activeClassName = '', children, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 text-[11px] font-semibold transition',
          isActive
            ? `bg-[#171311] text-white shadow-[0_10px_24px_rgba(23,19,17,0.22)] ${activeClassName}`
            : 'text-[#5B5146] hover:bg-[#F4EFE8]',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const items = useSelectionStore((state) => state.items);

  const selectionCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const isHome = location.pathname === '/';
  const isCatalogue = location.pathname.startsWith('/products');
  const isSelection = location.pathname === '/ma-selection';
  const isInfo = location.pathname === '/info';
  const isFaq = location.pathname === '/faq';

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchValue.trim();
    if (!query) return;

    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchValue('');
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#E7DFD5] bg-[rgba(255,252,247,0.9)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 lg:px-5">
          <div className="flex items-center justify-between gap-2 py-2.5 md:py-3">
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-3 leading-none"
              aria-label="Accueil World Design"
            >
              <img
                src="/logo-wd.svg"
                alt="World Design"
                className="h-9 w-auto transition duration-200 group-hover:scale-[1.01] sm:h-10"
              />
            </Link>

            <nav className="hidden items-center gap-0.5 rounded-full border border-[#E7DFD5] bg-white px-1.5 py-1 shadow-[0_10px_30px_rgba(23,19,17,0.05)] md:flex">
              {NAV_LINKS.map((link) => (
                <NavPill key={link.to} to={link.to} end={link.end}>
                  {link.label}
                </NavPill>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <form onSubmit={handleSearchSubmit} className="hidden lg:block">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit, une référence ou une catégorie"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-10 w-[14rem] rounded-full border border-[#E7DFD5] bg-white pl-11 pr-4 text-sm text-[#171311] outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311]"
                  />
                </label>
              </form>

              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7DFD5] bg-white text-[#4C4138] transition hover:border-[#A58A63] hover:text-[#171311] lg:hidden"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to="/ma-selection"
                className="relative hidden items-center gap-2 rounded-full border border-[#E7DFD5] bg-white px-3 py-2 text-xs font-semibold text-[#171311] transition hover:border-[#A58A63] hover:text-[#A58A63] md:inline-flex"
                aria-label="Ma sélection"
              >
                <ShoppingBag className="h-4 w-4" />
                Ma sélection
                {selectionCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#171311] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {selectionCount > 99 ? '99+' : selectionCount}
                  </span>
                ) : null}
              </Link>

              <Link
                to="/admin/login"
                className="hidden rounded-full border border-[#171311] bg-[#171311] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2A241F] md:inline-flex"
              >
                Espace admin
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E7DFD5] bg-white text-[#4C4138] transition hover:border-[#A58A63] hover:text-[#171311] md:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {searchOpen ? (
            <div className="border-t border-[#E7DFD5] py-3 lg:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un produit, une référence ou une catégorie"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-12 w-full rounded-full border border-[#E7DFD5] bg-white pl-11 pr-4 text-sm text-[#171311] outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311]"
                />
              </form>
            </div>
          ) : null}
        </div>
      </header>

      <div className="md:hidden">
        <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#E7DFD5] bg-[rgba(255,252,247,0.94)] px-3 py-3 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-4 gap-2">
            <MobileNavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
            >
              <House className="h-5 w-5" />
              <span>Accueil</span>
            </MobileNavLink>

            <MobileNavLink
              to="/products"
              activeClassName="shadow-[0_12px_28px_rgba(23,19,17,0.28)] ring-1 ring-[#A58A63]/20"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutGrid className="h-5 w-5" />
              <span>Catalogue</span>
            </MobileNavLink>

            <MobileNavLink
              to="/ma-selection"
              onClick={() => setMobileOpen(false)}
            >
              <span className="relative">
                <ShoppingBag className="h-5 w-5" />
                {selectionCount > 0 ? (
                  <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-[#A58A63] px-1 py-0.5 text-[9px] font-bold leading-none text-white">
                    {selectionCount > 9 ? '9+' : selectionCount}
                  </span>
                ) : null}
              </span>
              <span>Sélection</span>
            </MobileNavLink>

            <MobileDockButton active={mobileOpen} onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
              <span>Menu</span>
            </MobileDockButton>
          </div>
        </nav>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#171311]/55 backdrop-blur-sm"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-hidden rounded-t-[32px] border-t border-[#E7DFD5] bg-[#FFFCF7] shadow-[0_-20px_80px_rgba(19,16,13,0.2)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E7DFD5] bg-gradient-to-br from-[#FFFDF8] via-[#FFF8F0] to-[#F7EFE4] px-5 py-5">
              <div className="flex items-center gap-3 leading-none">
                <img src="/logo-wd.svg" alt="World Design" className="h-10 w-auto" />
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7DFD5] bg-white text-[#4C4138] transition hover:border-[#171311] hover:text-[#171311]"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A9A095]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher un produit, une référence ou une catégorie"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-12 w-full rounded-full border border-[#E7DFD5] bg-white pl-11 pr-4 text-sm text-[#171311] outline-none transition placeholder:text-[#B9ADA0] focus:border-[#171311]"
                />
              </form>

              <nav className="mt-5 grid gap-3">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 rounded-2xl border px-4 py-4 text-base font-semibold transition',
                          isActive
                            ? 'border-[#171311] bg-[#171311] text-white shadow-[0_12px_30px_rgba(23,19,17,0.18)]'
                            : 'border-[#E7DFD5] bg-white text-[#171311] hover:border-[#A58A63]',
                        ].join(' ')
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex items-center justify-between rounded-[24px] border border-[#171311] bg-[#171311] px-5 py-4 text-white shadow-[0_16px_36px_rgba(23,19,17,0.2)]"
              >
                <span className="flex items-center gap-3">
                  <LayoutGrid className="h-5 w-5" />
                  <span className="text-base font-semibold">Aller au catalogue</span>
                </span>
                <span className="text-sm text-white/70">Explorer</span>
              </Link>

              <div className="mt-5 grid gap-3">
                <Link
                  to="/ma-selection"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-[#E7DFD5] bg-white px-4 py-4 text-base font-semibold text-[#171311] transition hover:border-[#A58A63]"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Ma sélection
                  {selectionCount > 0 ? (
                    <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-[#171311] px-2 py-0.5 text-xs font-bold text-white">
                      {selectionCount > 99 ? '99+' : selectionCount}
                    </span>
                  ) : null}
                </Link>

                <Link
                  to="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-[#171311] bg-[#171311] px-4 py-4 text-center text-base font-semibold text-white transition hover:bg-[#2A241F]"
                >
                  Espace admin
                </Link>
              </div>

              <div className="mt-6 rounded-[24px] bg-[#171311] px-4 py-4 text-white">
                <p className="text-sm font-semibold">Des objets choisis avec soin</p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Composez votre sélection et envoyez-la directement sur WhatsApp.
                </p>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
