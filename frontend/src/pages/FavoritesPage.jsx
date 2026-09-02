import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';

import { EmptyState } from '../components/EmptyState';
import { PageTransition } from '../components/PageTransition';
import { ProductCard } from '../components/ProductCard';
import { SectionHeading } from '../components/SectionHeading';
import { usePageTitle } from '../hooks/usePageTitle';
import { useFavoritesStore } from '../store/favoritesStore';

export default function FavoritesPage() {
  usePageTitle('Mes favoris');

  const favorites = useFavoritesStore((state) => state.favorites);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F6F1EA] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Favoris"
            title="Vos pièces préférées"
            description="Retrouvez ici les produits que vous avez mis en favoris avec le cœur, pour les retrouver rapidement."
          />

          {favorites.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                title="Aucun favori pour le moment"
                description="Utilisez le cœur sur une fiche produit ou sur une carte du catalogue pour retrouver vos pièces préférées ici."
                action={
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Ouvrir le catalogue
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              <div className="mt-10 flex items-center justify-between gap-4">
                <p className="text-sm text-[#6F6257]">
                  {favorites.length} pièce{favorites.length > 1 ? 's' : ''} en favori
                </p>
                <button
                  type="button"
                  onClick={clearFavorites}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E5DDD4] bg-white px-4 py-2 text-sm font-semibold text-[#6F6257] transition hover:border-[#E94560] hover:text-[#E94560]"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Vider les favoris
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {favorites.map((favorite) => (
                  <ProductCard
                    key={favorite.productId}
                    product={{
                      id: favorite.productId,
                      name: favorite.name,
                      slug: favorite.slug,
                      image_url: favorite.image,
                      reference: favorite.reference,
                    }}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171311] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#2A241F]"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  Découvrir d'autres pièces
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}