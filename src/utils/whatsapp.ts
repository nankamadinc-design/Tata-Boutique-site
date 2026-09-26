import type { Product } from '../types';
import { DEFAULT_WHATSAPP_NUMBER } from '../config/site';

/**
 * Centralized WhatsApp link generator, per spec section 12.
 * Always sanitizes the number to digits only and URL-encodes the message.
 */
export function sanitizeWhatsAppNumber(raw: string | null | undefined): string {
  const digits = (raw || '').replace(/\D/g, '');
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

export function formatPriceGNF(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(price));
}

/** Generic WhatsApp link with a custom message (used for the floating button / general contact). */
export function generateWhatsAppLinkGeneric(whatsappNumber: string, message?: string): string {
  const number = sanitizeWhatsAppNumber(whatsappNumber);
  const text =
    message ??
    'Bonjour Tata Boutique 👋\n\nJe souhaite avoir plus d\'informations sur vos produits.\n\nMerci.';
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds the WhatsApp order link for a specific product, per spec section 12.
 * generateWhatsAppLink(product) — message format is fixed by the spec.
 */
export function generateWhatsAppLink(
  product: Pick<Product, 'name' | 'price' | 'categoryName'>,
  whatsappNumber: string
): string {
  const number = sanitizeWhatsAppNumber(whatsappNumber);
  const categoryLabel = product.categoryName || 'Non catégorisé';
  const message = `Bonjour Tata Boutique 👋\n\nJe souhaite commander ce produit :\n\nProduit : ${product.name}\nPrix : ${formatPriceGNF(product.price)} GNF\nCatégorie : ${categoryLabel}\n\nEst-il disponible ?\n\nMerci.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
