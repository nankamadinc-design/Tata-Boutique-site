import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/categories', label: 'Catégories' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { settings } = useSettings();
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(q ? `/boutique?q=${encodeURIComponent(q)}` : '/boutique');
  };

  const linkClass = (isActive: boolean) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-20">
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Tata Boutique — Accueil">
          <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            Tata Boutique
          </span>
        </NavLink>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => linkClass(isActive)}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Rechercher"
            aria-expanded={searchOpen}
            className="grid h-10 w-10 place-items-center rounded-md text-text-muted transition-colors hover:bg-surface-offset hover:text-primary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          <a
            href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp hidden sm:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.6 6.3A8.9 8.9 0 0 0 12 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.1A9 9 0 1 0 17.6 6.3ZM12 19.5a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5Zm4.1-5.6c-.2-.1-1.3-.7-1.5-.7s-.4-.1-.5.1-.6.7-.7.9-.3.2-.5.1a6 6 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.5c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.6-1.5c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 0 0-.6 1.5c0 .9.6 1.8 1.4 2.8a9.5 9.5 0 0 0 3.6 3c1.4.6 1.9.5 2.3.4a2 2 0 0 0 1.2-1c.2-.4.2-.7.1-.8Z" />
            </svg>
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-md text-text-muted transition-colors hover:bg-surface-offset lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 sm:px-6">
          <form onSubmit={submitSearch} className="container-page flex gap-2 !px-0">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              className="flex-1 rounded-md border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="btn btn-primary">
              Rechercher
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 lg:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2.5 text-sm font-semibold ${
                      isActive ? 'bg-surface-offset text-primary' : 'text-text-muted hover:bg-surface-offset'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full"
              >
                Commander sur WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
