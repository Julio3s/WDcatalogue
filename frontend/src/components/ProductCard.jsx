import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useSelectionStore } from '../store/selectionStore';
import { getProductImage } from '../utils/media';

export function ProductCard({ product, badgeLabel, className = '' }) {
  const image = getProductImage(product);
  const addItem = useSelectionStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article
      data-product-id={product.id}
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white transition-all duration-200',
        'shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]',
        className,
      ].join(' ')}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative h-[210px] w-full overflow-hidden bg-[#F1ECE6] sm:h-[230px] lg:h-[250px]">
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
            <span className="absolute left-3 top-3 inline-flex rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              {badgeLabel}
            </span>
          ) : null}
        </div>
      </Link>

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

        <button
          onClick={handleAdd}
          className={`mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition ${
            added ? 'bg-green-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {added ? 'Ajouté à la sélection' : 'Ajouter à la sélection'}
        </button>
      </div>
    </article>
  );
}
