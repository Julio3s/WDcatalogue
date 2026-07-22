export function getWhatsAppNumber() {
  return (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
}

export function buildWhatsAppUrl(message = '', phoneNumber = getWhatsAppNumber()) {
  if (!phoneNumber) {
    return '';
  }

  const baseUrl = `https://wa.me/${phoneNumber}`;
  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}