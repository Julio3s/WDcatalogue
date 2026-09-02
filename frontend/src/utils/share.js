/**
 * Helpers for sharing products (WhatsApp preview, copy link, native share).
 *
 * L'aperçu des liens sur WhatsApp est généré par son crawler qui lit le HTML brut
 * (sans exécuter le JavaScript de la SPA). On partage donc l'URL du backend qui
 * sert une page Open Graph statique (titre + photo + description), puis redirige
 * vers la fiche produit frontend.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export function getBackendBaseUrl() {
  return API_BASE_URL.replace(/\/api$/, '');
}

/** URL /og/products/<slug>/ — page d'aperçu avec métadonnées Open Graph. */
export function getOgShareUrl(slug) {
  return `${getBackendBaseUrl()}/og/products/${encodeURIComponent(slug)}/`;
}

/** URL canonique de la fiche produit sur le frontend. */
export function getProductFrontendUrl(slug) {
  if (typeof window === 'undefined') return `/products/${encodeURIComponent(slug)}/`;
  return `${window.location.origin}/products/${encodeURIComponent(slug)}/`;
}

export function buildWhatsAppShareMessage(product) {
  if (!product) return '';
  const reference = product.reference || `WD${String(product.id).padStart(4, '0')}`;
  return (
    `Bonjour,\n\nJe vous partage ce produit WORLD DESIGN :\n\n` +
    `${product.name}\n` +
    `Réf. ${reference}\n` +
    `${getOgShareUrl(product.slug)}`
  );
}

export function buildWhatsAppShareUrl(product) {
  const message = buildWhatsAppShareMessage(product);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export async function copyToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
  return true;
}