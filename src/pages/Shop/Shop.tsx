import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import SearchBar from '../../components/Search/SearchBar';
import SortSelect from '../../components/Search/SortSelect';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { listPublicProducts, listCategories } from '../../services/api';
import type { Category, Product, SortOption } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = params.get('categorie') || 'tous';
  const search = params.get('q') || '';
  const sort = (params.get('tri') as SortOption) || 'newest';
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listPublicProducts({ category: activeCategory, search: debouncedSearch, sort, pageSize: 48 })
      .then((res) => {
        if (active) setProducts(res.items);
      })
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [activeCategory, debouncedSearch, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'tous' && value !== 'newest') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const title = useMemo(
    () => (search ? `Recherche : ${search} — Tata Boutique` : 'Boutique — Tata Boutique'),
    [search]
  );

  return (
    <>
      <SEO title={title} description="Parcourez tous les produits Tata Boutique en Guinée : vêtements, chaussures, accessoires, beauté, téléphones et plus." path="/boutique" />

      <div className="container-page py-8 sm:py-10">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Boutique</h1>
        <p className="mt-2 text-text-muted">Trouvez le produit qui vous plaît et commandez en un clic sur WhatsApp.</p>

        <div className="mt-6 flex flex-col gap-4">
          <SearchBar value={search} onChange={(v) => updateParam('q', v)} onReset={() => updateParam('q', '')} />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 sm:flex-1">
              <CategoryFilter categories={categories} active={activeCategory} onChange={(slug) => updateParam('categorie', slug)} />
            </div>
            <SortSelect value={sort} onChange={(v) => updateParam('tri', v)} />
          </div>
        </div>

        <div className="mt-8">
          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage={search ? `Aucun résultat pour « ${search} ».` : 'Aucun produit dans cette catégorie pour le moment.'}
            onResetFilters={
              search || activeCategory !== 'tous'
                ? () => setParams(new URLSearchParams(), { replace: true })
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
}
