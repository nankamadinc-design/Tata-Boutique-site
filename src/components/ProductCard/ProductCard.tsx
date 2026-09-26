import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPriceGNF, generateWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function ProductCard({ product }: { product: Product }) {
  const { settings } = useSettings();
  const hasDiscount = !!product.oldPrice && product.oldPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / (product.oldPrice as number)) * 100)
    : 0;
  const isOutOfStock = product.status === 'rupture' || !product.available;

  return (
    <div className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md" data-testid={`card-product-${product.id}`}>
      <Link to={`/produit/${product.slug}`} className="relative block aspect-square overflow-hidden bg-surface-offset">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-text">
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="rounded-full bg-error px-2.5 py-1 text-xs font-semibold text-white">
              -{discountPct}%
            </span>
          )}
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4">
        {product.categoryName && (
          <span className="text-xs font-medium uppercase tracking-wide text-text-faint">
            {product.categoryName}
          </span>
        )}
        <Link to={`/produit/${product.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-primary sm:text-base">
          {product.name}
        </Link>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-primary sm:text-lg">{formatPriceGNF(product.price)} GNF</span>
          {hasDiscount && (
            <span className="text-xs text-text-faint line-through">{formatPriceGNF(product.oldPrice as number)} GNF</span>
          )}
        </div>

        <a
          href={generateWhatsAppLink(product, settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-disabled={isOutOfStock}
          className={`btn mt-2.5 w-full ${isOutOfStock ? 'btn-outline pointer-events-none opacity-50' : 'btn-whatsapp'}`}
        >
          {isOutOfStock ? 'Indisponible' : 'Commander'}
        </a>
      </div>
    </div>
  );
}
