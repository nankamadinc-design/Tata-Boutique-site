import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAdminProducts, deleteProduct, setProductStatus } from '../../services/api';
import type { Product, ProductStatus } from '../../types';
import { formatPriceGNF } from '../../utils/whatsapp';
import Spinner from '../../components/Loading/Spinner';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_LABELS: Record<ProductStatus, string> = {
  publie: 'Publié', brouillon: 'Brouillon', masque: 'Masqué', rupture: 'Rupture',
};
const STATUS_STYLES: Record<ProductStatus, string> = {
  publie: 'bg-success/10 text-success', brouillon: 'bg-warning/10 text-warning',
  masque: 'bg-text-faint/20 text-text-muted', rupture: 'bg-error/10 text-error',
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    listAdminProducts({ status: statusFilter, search })
      .then((res) => setProducts(res.items))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const toggleStatus = async (p: Product, next: ProductStatus) => {
    setBusyId(p.id);
    try {
      await setProductStatus(p.id, next);
      load();
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    try {
      await deleteProduct(toDelete.id);
      setToDelete(null);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Produits</h1>
        <Link to="/admin/ajouter-produit" className="btn btn-primary" data-testid="link-add-product">+ Ajouter un produit</Link>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit…"
            className="flex-1 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button type="submit" className="btn btn-outline">Rechercher</button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'all')}
          className="rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="all">Tous les statuts</option>
          <option value="publie">Publié</option>
          <option value="brouillon">Brouillon</option>
          <option value="masque">Masqué</option>
          <option value="rupture">Rupture</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-offset text-left text-xs uppercase tracking-wide text-text-faint">
              <tr>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Vedette</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {products.map((p) => (
                <tr key={p.id} className="bg-surface" data-testid={`row-product-${p.id}`}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.mainImage} alt="" className="h-10 w-10 rounded-md object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-text-faint">{p.categoryName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPriceGNF(p.price)} GNF</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.featured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link to={`/admin/modifier-produit/${p.id}`} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10">
                        Modifier
                      </Link>
                      {p.status === 'publie' ? (
                        <button disabled={busyId === p.id} onClick={() => toggleStatus(p, 'masque')} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:bg-surface-offset">
                          Masquer
                        </button>
                      ) : (
                        <button disabled={busyId === p.id} onClick={() => toggleStatus(p, 'publie')} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-success hover:bg-success/10">
                          Publier
                        </button>
                      )}
                      <button disabled={busyId === p.id} onClick={() => toggleStatus(p, p.status === 'rupture' ? 'publie' : 'rupture')} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-warning hover:bg-warning/10">
                        {p.status === 'rupture' ? 'Réapprovisionner' : 'Rupture'}
                      </button>
                      <button disabled={busyId === p.id} onClick={() => setToDelete(p)} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-error hover:bg-error/10" data-testid={`button-delete-${p.id}`}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">Aucun produit trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer ce produit ?"
        message={`« ${toDelete?.name} » sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
