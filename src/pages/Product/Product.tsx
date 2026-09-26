import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import Spinner from '../../components/Loading/Spinner';
import { getProductBySlug } from '../../services/api';
import type { Product as ProductType } from '../../types';
import { formatPriceGNF, generateWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);
    getProductBySlug(slug)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner label="Chargement du produit…" />;

  if (notFound || !product) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Produit introuvable</h1>
        <p className="text-text-muted">Ce produit n'existe pas ou n'est plus disponible.</p>
        <Link to="/boutique" className="btn btn-primary">Retour à la boutique</Link>
      </div>
    );
  }

  const hasDiscount = !!product.oldPrice && product.oldPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / (product.oldPrice as number)) * 100) : 0;
  const isOutOfStock = product.status === 'rupture' || !product.available;
  const images = product.images.length > 0 ? product.images : [product.mainImage];

  return (
    <>
      <SEO
        title={`${product.name} — Tata Boutique`}
        description={product.shortDescription || product.description.slice(0, 155)}
        path={`/produit/${product.slug}`}
        image={product.mainImage}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: images,
          sku: product.id,
          category: product.categoryName,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'GNF',
            price: product.price,
            availability: isOutOfStock
              ? 'https://schema.org/OutOfStock'
              : 'https://schema.org/InStock',
            url: `https://www.tataboutique.com/produit/${product.slug}`,
          },
        }}
      />

      <div className="container-page py-8 sm:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-text-muted" aria-label="Fil d'ariane">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <Link to="/boutique" className="hover:text-primary">Boutique</Link>
          {product.categoryName && (
            <>
              <span>/</span>
              <Link to={`/boutique?categorie=${product.categorySlug}`} className="hover:text-primary">{product.categoryName}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-text">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="aspect-square overflow-hidden rounded-xl bg-surface-offset">
              <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Voir la photo ${i + 1}`}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                      i === activeImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.categoryName && (
              <span className="text-xs font-semibold uppercase tracking-wide text-text-faint">{product.categoryName}</span>
            )}
            <h1 className="mt-1.5 font-display text-2xl font-semibold sm:text-3xl">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {product.badge && (
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-text">{product.badge}</span>
              )}
              {hasDiscount && (
                <span className="rounded-full bg-error px-2.5 py-1 text-xs font-semibold text-white">-{discountPct}%</span>
              )}
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isOutOfStock ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                {isOutOfStock ? 'Rupture de stock' : 'Disponible'}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold text-primary">{formatPriceGNF(product.price)} GNF</span>
              {hasDiscount && (
                <span className="text-lg text-text-faint line-through">{formatPriceGNF(product.oldPrice as number)} GNF</span>
              )}
            </div>

            {product.stock > 0 && (
              <p className="mt-2 text-sm text-text-muted">Stock disponible : {product.stock}</p>
            )}

            <p className="mt-6 whitespace-pre-line text-text-muted">{product.description}</p>

            <a
              href={generateWhatsAppLink(product, settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={isOutOfStock}
              className={`btn mt-8 w-full text-base sm:w-auto ${isOutOfStock ? 'btn-outline pointer-events-none opacity-50' : 'btn-whatsapp'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A8.9 8.9 0 0 0 12 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.1A9 9 0 1 0 17.6 6.3ZM12 19.5a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5Z" /></svg>
              {isOutOfStock ? 'Produit indisponible' : 'Commander sur WhatsApp'}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
