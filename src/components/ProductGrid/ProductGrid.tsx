import type { Product } from '../../types';
import ProductCard from '../ProductCard/ProductCard';
import { ProductGridSkeleton } from '../Loading/Skeleton';

interface Props {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export default function ProductGrid({ products, loading, emptyMessage, onResetFilters }: Props) {
  if (loading) return <ProductGridSkeleton />;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-faint">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <p className="text-sm text-text-muted">{emptyMessage || 'Aucun produit trouvé.'}</p>
        {onResetFilters && (
          <button type="button" onClick={onResetFilters} className="btn btn-outline mt-1">
            Réinitialiser la recherche
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="grid-products">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
