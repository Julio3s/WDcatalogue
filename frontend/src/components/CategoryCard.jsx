import { Link } from 'react-router-dom';

import { getCategoryImage } from '../utils/media';

export function CategoryCard({ category }) {
  const image = getCategoryImage(category);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
      <Link
        to={`/products?category=${encodeURIComponent(category.slug)}`}
        className="block"
        state={{ selectedCategory: category.slug }}
      >
        <div className="relative h-[220px] w-full overflow-hidden bg-[#F1ECE6] sm:h-[240px] lg:h-[260px]">
          {image ? (
            <img
              src={image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className="absolute left-3 top-3 inline-flex bg-gray-900 px-3 py-1 text-xs font-semibold tracking-wide text-white">
            Univers
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-4.5">
        <Link
          to={`/products?category=${encodeURIComponent(category.slug)}`}
          className="block"
          state={{ selectedCategory: category.slug }}
        >
          <h3 className="text-sm font-semibold leading-tight text-gray-900 sm:text-base">
            {category.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
            Voir les produits
          </p>
        </Link>
      </div>
    </article>
  );
}