import { Link } from 'react-router-dom';

import { getCategoryImage } from '../utils/media';

export function CategoryCard({ category }) {
  const image = getCategoryImage(category);

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.slug)}`}
      className="group flex overflow-hidden rounded-[24px] border border-[#E0DBD5] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      state={{ selectedCategory: category.slug }}
    >
      <div className="h-44 w-24 flex-none overflow-hidden sm:h-56 sm:w-28">
        <img
          src={image}
          alt={category.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Univers
          </p>
          <h3 className="break-words text-lg font-semibold leading-tight text-text-dark">
            {category.name}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
          Voir les produits
        </span>
      </div>
    </Link>
  );
}
