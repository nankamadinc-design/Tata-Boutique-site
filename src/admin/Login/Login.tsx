import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Header/Logo';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ApiRequestError } from '../../services/api';

export default function Login() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const from = (location.state as { from?: string })?.from || '/admin/tableau-de-bord';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/tableau-de-bord', { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 429) {
        setError('Trop de tentatives. Réessayez dans quelques minutes.');
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-offset px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="font-display text-xl font-semibold">Administration Tata Boutique</h1>
          <p className="text-sm text-text-muted">Connectez-vous pour gérer la boutique.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              id="email" type="email" required autoComplete="username" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              data-testid="input-admin-email"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Mot de passe</label>
            <input
              id="password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              data-testid="input-admin-password"
            />
          </div>
          {error && <p className="text-sm text-error" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60" data-testid="button-admin-login">
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
