import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import { listCategories } from '../../services/api';
import type { Category } from '../../types';

const ICONS: Record<string, string> = {
  vetements: '👗', chaussures: '👟', accessoires: '👜', beaute: '💄',
  telephones: '📱', electronique: '🔌', maison: '🏠', enfants: '🧸', autres: '🛍️',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Catégories — Tata Boutique" description="Parcourez toutes les catégories de produits disponibles chez Tata Boutique en Guinée." path="/categories" />
      <div className="container-page py-8 sm:py-10">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Catégories</h1>
        <p className="mt-2 text-text-muted">Choisissez une catégorie pour découvrir les produits associés.</p>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-surface-offset" />
            ))}
          </div>
        ) : (
          // Gallery-style tiles (Alibaba-inspired): a full-bleed cover photo per
          // category with a bottom gradient and the label overlaid, instead of
          // plain icon pills — makes the catalog feel like a real marketplace.
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            <Link
              to="/boutique"
              className="group relative aspect-square overflow-hidden rounded-xl bg-surface-offset shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="absolute inset-0 grid place-items-center text-4xl">🛒</span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 py-3 text-center text-sm font-semibold text-white">
                Tous
              </span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/boutique?categorie=${cat.slug}`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-surface-offset shadow-sm transition-shadow hover:shadow-md"
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-4xl">
                    {cat.icon || ICONS[cat.slug] || '🛍️'}
                  </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 px-3 py-3 text-center text-sm font-semibold text-white">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
