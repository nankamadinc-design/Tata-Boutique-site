import { Link } from 'react-router-dom';
import Logo from '../Header/Logo';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-offset">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-lg font-semibold">{settings.shopName}</span>
          </div>
          <p className="mt-3 text-sm text-text-muted">{settings.slogan}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-faint">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/boutique" className="text-text-muted hover:text-primary">Boutique</Link></li>
            <li><Link to="/categories" className="text-text-muted hover:text-primary">Catégories</Link></li>
            <li><Link to="/a-propos" className="text-text-muted hover:text-primary">À propos</Link></li>
            <li><Link to="/contact" className="text-text-muted hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-faint">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-text-muted">
            <li>
              <a href={generateWhatsAppLinkGeneric(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                WhatsApp : +{settings.whatsappNumber.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')}
              </a>
            </li>
            {settings.contactEmail && (
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary">{settings.contactEmail}</a>
              </li>
            )}
            <li>Guinée</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-faint">Réseaux sociaux</h3>
          <div className="mt-4 flex gap-3">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Tata Boutique"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.1A16 16 0 0 0 14.3 5c-2.4 0-4 1.5-4 4.1v2.1H7.9V14h2.4v7Z" /></svg>
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Tata Boutique"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.1a4.3 4.3 0 0 1-2.6-1V15a5 5 0 1 1-4.2-4.9v2.2a2.8 2.8 0 1 0 2 2.7V2h2.2a4.3 4.3 0 0 0 3.7 3.7Z" /></svg>
            </a>
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Tata Boutique"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.8a2.7 2.7 0 0 0-1.9-1.9C18 5.4 12 5.4 12 5.4s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.8 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.2 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.2ZM10 15V9l5.2 3Z" /></svg>
            </a>
            <a
              href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Tata Boutique"
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A8.9 8.9 0 0 0 12 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.1A9 9 0 1 0 17.6 6.3ZM12 19.5a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5Z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-divider py-5">
        <p className="container-page text-center text-xs text-text-faint">
          © {year} {settings.shopName} — Tous droits réservés. « {settings.slogan} »
        </p>
      </div>
    </footer>
  );
}
