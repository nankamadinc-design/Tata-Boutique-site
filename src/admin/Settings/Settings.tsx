import { useEffect, useState } from 'react';
import { updateSettings } from '../../services/api';
import type { Settings as SettingsType } from '../../types';
import Spinner from '../../components/Loading/Spinner';
import { sanitizeWhatsAppNumber } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
  // Read from the shared SettingsContext (the same source header/footer/
  // WhatsApp buttons use) instead of an independent fetch, and call its
  // refresh() after saving so every consumer site-wide updates immediately
  // without requiring a full page reload.
  const { settings, loading: contextLoading, refresh } = useSettings();
  const [form, setForm] = useState<SettingsType | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contextLoading && !form) {
      setForm(settings);
    }
  }, [contextLoading, settings, form]);

  const loading = contextLoading && !form;

  const setField = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError(null);
    setSaving(true);
    try {
      const updated = await updateSettings({
        ...form,
        whatsappNumber: sanitizeWhatsAppNumber(form.whatsappNumber),
      });
      setForm(updated);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">Paramètres</h1>
      <p className="mt-1 text-sm text-text-muted">
        Ces informations s'appliquent immédiatement sur tout le site public, y compris les boutons WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nom de la boutique</label>
          <input value={form.shopName} onChange={(e) => setField('shopName', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Slogan</label>
          <input value={form.slogan} onChange={(e) => setField('slogan', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Numéro WhatsApp</label>
          <input
            value={form.whatsappNumber}
            onChange={(e) => setField('whatsappNumber', e.target.value)}
            placeholder="224622063419"
            className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
          <p className="mt-1 text-xs text-text-faint">Format international sans le « + » (ex : 224622063419).</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email de contact (optionnel)</label>
          <input type="email" value={form.contactEmail || ''} onChange={(e) => setField('contactEmail', e.target.value || null)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Facebook</label>
          <input value={form.facebookUrl} onChange={(e) => setField('facebookUrl', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">TikTok</label>
          <input value={form.tiktokUrl} onChange={(e) => setField('tiktokUrl', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">YouTube</label>
          <input value={form.youtubeUrl} onChange={(e) => setField('youtubeUrl', e.target.value)} className="w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-primary" />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}
        {saved && <p className="text-sm text-success">Paramètres enregistrés.</p>}

        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
