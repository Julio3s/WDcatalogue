import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFavoritesStore } from '../store/favoritesStore';
import { getProductImage } from '../utils/media';

export function ProductCard({ product, badgeLabel, className = '' }) {
  const image = getProductImage(product);
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((fav) => fav.productId === product.id)
  );
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const handleToggleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <article
      data-product-id={product.id}
      className={[
        'group relative flex h-full flex-col overflow-hidden bg-white transition-all duration-200',
        'shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]',
        className,
      ].join(' ')}
    >
      <div className="relative">
        <Link to={`/products/${product.slug}`} className="block">
          <div className="relative h-[220px] w-full overflow-hidden bg-[#F1ECE6] sm:h-[240px] lg:h-[260px]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              </div>
            )}
            {badgeLabel ? (
              <span className="absolute left-3 top-3 inline-flex bg-gray-900 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                {badgeLabel}
              </span>
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={
            isFavorite ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`
          }
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={[
            'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-[0_4px_16px_rgba(23,19,17,0.12)] transition',
            isFavorite
              ? 'bg-[#E94560]/90 text-white hover:bg-[#E94560]'
              : 'bg-white/90 text-[#171311] backdrop-blur hover:bg-white hover:text-[#E94560]',
          ].join(' ')}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-current text-white' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-4.5">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold leading-tight text-gray-900 sm:text-base">
            {product.name}
          </h3>
          {product.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
              {product.description}
            </p>
          ) : null}
        </Link>

      </div>
    </article>
  );
}
