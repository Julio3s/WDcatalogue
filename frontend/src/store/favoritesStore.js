import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductImage } from '../utils/media';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (product) => {
        if (!product?.id) return;
        const exists = get().favorites.some((fav) => fav.productId === product.id);

        if (exists) {
          set({
            favorites: get().favorites.filter((fav) => fav.productId !== product.id),
          });
        } else {
          set({
            favorites: [
              ...get().favorites,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                image: getProductImage(product),
                reference: product.reference || `WD${String(product.id).padStart(4, '0')}`,
              },
            ],
          });
        }
      },

      isFavorite: (productId) => get().favorites.some((fav) => fav.productId === productId),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'world-design-favorites',
    }
  )
);