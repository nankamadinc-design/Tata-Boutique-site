import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getAdminProduct, listAdminCategories } from '../../services/api';
import type { Category, ProductStatus } from '../../types';
import ImageUploader from '../components/ImageUploader';
import Spinner from '../../components/Loading/Spinner';

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'publie', label: 'Publié' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'masque', label: 'Masqué' },
  { value: 'rupture', label: 'Rupture de stock' },
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const EMPTY = {
  name: '', slug: '', description: '', shortDescription: '', price: 0, oldPrice: null as number | null,
  categoryId: '', images: [] as string[], mainImage: '', stock: 0, available: true,
  status: 'publie' as ProductStatus, badge: '' as string | null, featured: false,
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    listAdminCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    getAdminProduct(id)
      .then((p) => {
        setForm({
          name: p.name, slug: p.slug, description: p.description, shortDescription: p.shortDescription,
          price: p.price, oldPrice: p.oldPrice, categoryId: p.categoryId, images: p.images,
          mainImage: p.mainImage, stock: p.stock, available: p.available, status: p.status,
          badge: p.badge, featured: p.featured,
        });
        setSlugTouched(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    setField('name', name);
    if (!slugTouched) setField('slug', slugify(name));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Le nom est requis.';
    if (!form.slug.trim()) errs.slug = "L'URL (slug) est requise.";
    if (!form.categoryId) errs.categoryId = 'Choisissez une catégorie.';
    if (form.price <= 0) errs.price = 'Le prix doit être supérieur à 0.';
    if (form.oldPrice !== null && form.oldPrice <= form.price) errs.oldPrice = "L'ancien prix doit être supérieur au prix actuel.";
    if (form.stock < 0) errs.stock = 'Le stock ne peut pas être négatif.';
    if (!form.mainImage) errs.mainImage = 'Ajoutez au moins une image.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      navigate('/admin/produits');
    } catch (err) {
      setErrors({ submit: 'Erreur lors de l\'enregistrement. Vérifiez les champs et réessayez.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">{isEdit ? 'Modifier le produit' : 'Ajouter un produit'}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nom du produit *</label>
          <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" data-testid="input-product-name" />
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">URL (slug) *</label>
          <input
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); setField('slug', slugify(e.target.value)); }}
            className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
          <p className="mt-1 text-xs text-text-faint">/produit/{form.slug || '...'}</p>
          {errors.slug && <p className="mt-1 text-xs text-error">{errors.slug}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description courte</label>
          <input value={form.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} maxLength={160} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description complète</label>
          <textarea rows={4} value={form.description} onChange={(e) => setField('description', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Prix (GNF) *</label>
            <input type="number" min={0} value={form.price} onChange={(e) => setField('price', Number(e.target.value))} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" data-testid="input-product-price" />
            {errors.price && <p className="mt-1 text-xs text-error">{errors.price}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Ancien prix (promo)</label>
            <input type="number" min={0} value={form.oldPrice ?? ''} onChange={(e) => setField('oldPrice', e.target.value ? Number(e.target.value) : null)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
            {errors.oldPrice && <p className="mt-1 text-xs text-error">{errors.oldPrice}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Catégorie *</label>
            <select value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary">
              <option value="">Choisir…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-error">{errors.categoryId}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Stock *</label>
            <input type="number" min={0} value={form.stock} onChange={(e) => setField('stock', Number(e.target.value))} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
            {errors.stock && <p className="mt-1 text-xs text-error">{errors.stock}</p>}
          </div>
        </div>

        <ImageUploader
          images={form.images}
          onChange={(images) => setField('images', images)}
          mainImage={form.mainImage}
          onMainImageChange={(url) => setField('mainImage', url)}
        />
        {errors.mainImage && <p className="text-xs text-error">{errors.mainImage}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Badge (optionnel)</label>
            <input value={form.badge || ''} onChange={(e) => setField('badge', e.target.value || null)} placeholder="Ex : Nouveau, Promo" className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Statut</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value as ProductStatus)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary">
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.available} onChange={(e) => setField('available', e.target.checked)} className="h-4 w-4 accent-primary" />
            Disponible à la vente
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} className="h-4 w-4 accent-primary" />
            Produit vedette
          </label>
        </div>

        {errors.submit && <p className="text-sm text-error">{errors.submit}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60" data-testid="button-save-product">
            {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </button>
          <button type="button" onClick={() => navigate('/admin/produits')} className="btn btn-outline">Annuler</button>
        </div>
      </form>
    </div>
  );
}
