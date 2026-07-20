import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductImage } from '../utils/media';

export const useSelectionStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, customText = '', modelValue = '') => {
        const items = [...get().items];
        const key = `${product.id}::${customText}::${modelValue}`;
        const existingIndex = items.findIndex((item) => item.key === key);

        if (existingIndex >= 0) {
          items[existingIndex] = {
            ...items[existingIndex],
            quantity: items[existingIndex].quantity + quantity,
          };
        } else {
          items.push({
            key,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: getProductImage(product),
            reference: product.reference || `WD${String(product.id).padStart(4, '0')}`,
            quantity,
            customText: customText || '',
            modelValue: modelValue || '',
            isCustomizable: product.is_customizable || false,
            customizationHint: product.customization_hint || '',
          });
        }

        set({ items });
      },

      removeItem: (key) => {
        set({ items: get().items.filter((item) => item.key !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.key === key ? { ...item, quantity } : item
          ),
        });
      },

      updateCustomText: (key, customText) => {
        set({
          items: get().items.map((item) =>
            item.key === key ? { ...item, customText } : item
          ),
        });
      },

      clearSelection: () => {
        set({ items: [] });
      },

      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      generateWhatsAppMessage: (phoneNumber) => {
        const items = get().items;
        if (items.length === 0) return '';

        let message = 'Bonjour,\n\nNous sommes intéressés par les produits suivants :\n\n';

        items.forEach((item, index) => {
          message += `${index + 1}.\n`;
          message += `Nom : ${item.name}\n`;
          message += `Référence : ${item.reference}\n`;
          message += `Quantité : ${item.quantity}\n`;
          message += `Informations complémentaires : ${item.customText || ''}\n`;
          message += '------------------------------------\n\n';
        });

        message += 'Merci de nous transmettre un devis.';

        const encoded = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encoded}`;
      },
    }),
    {
      name: 'world-design-selection',
    }
  )
);
