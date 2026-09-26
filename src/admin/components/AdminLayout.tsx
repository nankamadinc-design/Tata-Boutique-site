import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../../components/Header/Logo';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV = [
  { to: '/admin/tableau-de-bord', label: 'Tableau de bord', icon: '📊' },
  { to: '/admin/produits', label: 'Produits', icon: '🛍️' },
  { to: '/admin/categories', label: 'Catégories', icon: '🗂️' },
  { to: '/admin/parametres', label: 'Paramètres', icon: '⚙️' },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/connexion', { replace: true });
  };

  return (
    <div className="flex min-h-dvh bg-bg text-text">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-surface transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <Logo className="h-8 w-8" />
          <span className="font-display text-base font-semibold">Tata Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="Navigation administration">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-offset'
                }`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-error transition-colors hover:bg-error/10"
          >
            <span aria-hidden="true">🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Main */}
      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-border bg-surface px-4 lg:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="grid h-9 w-9 place-items-center rounded-md text-text-muted hover:bg-surface-offset lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <span className="text-sm font-semibold text-text-muted">Administration Tata Boutique</span>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
