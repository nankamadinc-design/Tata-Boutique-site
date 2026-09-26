import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import type { DashboardStats } from '../../types';
import { formatPriceGNF } from '../../utils/whatsapp';
import Spinner from '../../components/Loading/Spinner';

const STATUS_LABELS: Record<string, string> = {
  publie: 'Publié', brouillon: 'Brouillon', masque: 'Masqué', rupture: 'Rupture',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Chargement du tableau de bord…" />;
  if (error || !stats) return <p className="text-error">Impossible de charger les statistiques.</p>;

  const cards = [
    { label: 'Total produits', value: stats.totalProducts, color: 'text-primary' },
    { label: 'Publiés', value: stats.published, color: 'text-success' },
    { label: 'Masqués', value: stats.hidden, color: 'text-text-muted' },
    { label: 'Rupture de stock', value: stats.outOfStock, color: 'text-error' },
    { label: 'Brouillons', value: stats.drafts, color: 'text-warning' },
    { label: 'Catégories', value: stats.totalCategories, color: 'text-primary' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold">Tableau de bord</h1>
      <p className="mt-1 text-sm text-text-muted">Vue d'ensemble de la boutique Tata Boutique.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="card p-4" data-testid={`stat-${c.label}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-text-faint">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Produits récents</h2>
        <Link to="/admin/produits" className="text-sm font-semibold text-primary hover:underline">Voir tout →</Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-offset text-left text-xs uppercase tracking-wide text-text-faint">
            <tr>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {stats.recentProducts.map((p) => (
              <tr key={p.id} className="bg-surface">
                <td className="flex items-center gap-3 px-4 py-3">
                  <img src={p.mainImage} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-4 py-3">{formatPriceGNF(p.price)} GNF</td>
                <td className="px-4 py-3">{STATUS_LABELS[p.status]}</td>
                <td className="px-4 py-3">{p.stock}</td>
              </tr>
            ))}
            {stats.recentProducts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-text-muted">Aucun produit encore.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link to="/admin/ajouter-produit" className="btn btn-primary">+ Ajouter un produit</Link>
      </div>
    </div>
  );
}
