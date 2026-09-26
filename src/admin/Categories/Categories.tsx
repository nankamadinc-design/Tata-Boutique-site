import { useEffect, useState } from 'react';
import { listAdminCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';
import type { Category } from '../../types';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../../components/Loading/Spinner';

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listAdminCategories().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createCategory({
        name: name.trim(),
        slug: slugify(name),
        imageUrl: imageUrl.trim() || undefined,
        sortOrder: categories.length,
      });
      setName('');
      setImageUrl('');
      load();
    } catch {
      setError('Impossible de créer cette catégorie (nom déjà utilisé ?).');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setEditName(cat.name);
    setEditImageUrl(cat.imageUrl || '');
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editName.trim()) { setEditing(null); return; }
    await updateCategory(editing.id, {
      name: editName.trim(),
      slug: editName.trim() === editing.name ? editing.slug : slugify(editName),
      imageUrl: editImageUrl.trim() || null,
    });
    setEditing(null);
    load();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCategory(toDelete.id);
      setToDelete(null);
      load();
    } catch {
      setError('Impossible de supprimer : des produits utilisent encore cette catégorie.');
      setToDelete(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold">Catégories</h1>
      <p className="mt-1 text-sm text-text-muted">
        Gérez les catégories affichées sur la boutique. Ajoutez une image de couverture pour chacune —
        elle s'affiche en galerie sur la page d'accueil et la page « Catégories ».
      </p>

      <form onSubmit={handleAdd} className="mt-5 space-y-2 rounded-lg border border-border bg-surface p-4">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la nouvelle catégorie…"
            className="flex-1 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button type="submit" disabled={saving} className="btn btn-primary shrink-0 disabled:opacity-60">
            Ajouter
          </button>
        </div>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de l'image de couverture (optionnel)…"
          className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
        />
      </form>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <ul className="mt-5 divide-y divide-divider rounded-lg border border-border">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-3 bg-surface px-4 py-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-offset">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-lg">{cat.icon || '🛍️'}</span>
                )}
              </div>

              {editing?.id === cat.id ? (
                <div className="flex-1 space-y-1.5">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-md border border-primary bg-surface-2 px-2 py-1 text-sm outline-none"
                  />
                  <input
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="URL de l'image de couverture…"
                    className="w-full rounded-md border border-border bg-surface-2 px-2 py-1 text-xs outline-none focus:border-primary"
                  />
                </div>
              ) : (
                <span className="flex-1 font-medium">{cat.name}</span>
              )}

              <div className="flex shrink-0 gap-1.5">
                {editing?.id === cat.id ? (
                  <>
                    <button type="button" onClick={saveEdit} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-success hover:bg-success/10">Enregistrer</button>
                    <button type="button" onClick={() => setEditing(null)} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:bg-surface-offset">Annuler</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => startEdit(cat)} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10">Modifier</button>
                    <button type="button" onClick={() => setToDelete(cat)} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-error hover:bg-error/10">Supprimer</button>
                  </>
                )}
              </div>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-text-muted">Aucune catégorie encore.</li>
          )}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer cette catégorie ?"
        message={`« ${toDelete?.name} » sera supprimée. Cette action échouera si des produits l'utilisent encore.`}
        confirmLabel="Supprimer"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
