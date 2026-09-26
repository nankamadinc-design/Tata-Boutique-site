import { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';
import { submitContactForm } from '../../services/api';

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContactForm(form);
      setStatus('sent');
      setForm({ name: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <SEO title="Contact — Tata Boutique" description="Contactez Tata Boutique par WhatsApp, réseaux sociaux ou via notre formulaire de contact." path="/contact" />
      <div className="container-page py-8 sm:py-10">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Contact</h1>
        <p className="mt-2 max-w-lg text-text-muted">
          La façon la plus rapide de nous joindre reste WhatsApp. Vous pouvez aussi nous laisser un message ci-dessous.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <a
              href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-whatsapp text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A8.9 8.9 0 0 0 12 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.1A9 9 0 1 0 17.6 6.3Z" /></svg>
              </div>
              <div>
                <p className="font-semibold">WhatsApp</p>
                <p className="text-sm text-text-muted">+{settings.whatsappNumber}</p>
              </div>
            </a>

            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.1A16 16 0 0 0 14.3 5c-2.4 0-4 1.5-4 4.1v2.1H7.9V14h2.4v7Z" /></svg>
              </div>
              <div>
                <p className="font-semibold">Facebook</p>
                <p className="text-sm text-text-muted">@tatadjina</p>
              </div>
            </a>

            <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-text text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.1a4.3 4.3 0 0 1-2.6-1V15a5 5 0 1 1-4.2-4.9v2.2a2.8 2.8 0 1 0 2 2.7V2h2.2a4.3 4.3 0 0 0 3.7 3.7Z" /></svg>
              </div>
              <div>
                <p className="font-semibold">TikTok</p>
                <p className="text-sm text-text-muted">@ladjilatata</p>
              </div>
            </a>

            <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-error text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.8a2.7 2.7 0 0 0-1.9-1.9C18 5.4 12 5.4 12 5.4s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.8 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.2 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.2ZM10 15V9l5.2 3Z" /></svg>
              </div>
              <div>
                <p className="font-semibold">YouTube</p>
                <p className="text-sm text-text-muted">@guineeisback</p>
              </div>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            <h2 className="text-lg font-semibold">Envoyer un message</h2>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Nom</label>
              <input
                id="name" required value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">Téléphone</label>
              <input
                id="phone" required value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
              <textarea
                id="message" required rows={4} value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full disabled:opacity-60">
              {status === 'sending' ? 'Envoi…' : 'Envoyer'}
            </button>
            {status === 'sent' && <p className="text-sm text-success">Message envoyé. Nous vous répondrons rapidement.</p>}
            {status === 'error' && <p className="text-sm text-error">Une erreur est survenue. Essayez WhatsApp directement.</p>}
          </form>
        </div>
      </div>
    </>
  );
}
