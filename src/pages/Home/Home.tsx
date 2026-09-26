import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import SEO from '../../components/SEO/SEO';
import { listPublicProducts, listCategories } from '../../services/api';
import type { Product, Category } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';

export default function Home() {
  const { settings } = useSettings();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      listPublicProducts({ featured: true, pageSize: 8 }),
      listCategories(),
    ])
      .then(([productsRes, cats]) => {
        if (!active) return;
        setFeatured(productsRes.items);
        setCategories(cats.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Tata Boutique — Boutique en ligne en Guinée"
        description="Découvrez Tata Boutique, vos produits préférés en Guinée et commandez facilement directement sur WhatsApp."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'Tata Boutique',
          description: settings.description,
          url: 'https://www.tataboutique.com/',
          telephone: `+${settings.whatsappNumber}`,
          areaServed: 'GN',
        }}
      />
      <Hero />

      {categories.length > 0 && (
        <section className="container-page py-10 sm:py-14">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold sm:text-xl">Catégories populaires</h2>
            <Link to="/categories" className="text-sm font-semibold text-primary hover:underline">
              Voir tout &rarr;
            </Link>
          </div>
          {/* Gallery-style tiles (Alibaba-inspired): a photo cover per category
              instead of plain text pills, in a horizontally scrollable strip
              on mobile that becomes a fixed grid from sm: up. */}
          <div className="mt-5 flex min-w-0 gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:overflow-visible">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/boutique?categorie=${cat.slug}`}
                className="group relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-surface-offset shadow-sm transition-shadow hover:shadow-md sm:w-auto"
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-2xl">{cat.icon || '\ud83d\udecd\ufe0f'}</span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 px-2 py-2 text-center text-xs font-semibold text-white sm:text-sm">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-6 sm:py-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Produits en vedette</h2>
          <Link to="/boutique" className="text-sm font-semibold text-primary hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="mt-5">
          <ProductGrid products={featured} loading={loading} emptyMessage="Aucun produit en vedette pour le moment." />
        </div>
      </section>

      <section className="border-t border-border bg-surface-offset py-14">
        <div className="container-page text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Une question sur un produit ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            Notre équipe répond rapidement sur WhatsApp pour vous aider à choisir et confirmer la disponibilité.
          </p>
          <a
            href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-6"
          >
            Écrire sur WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
