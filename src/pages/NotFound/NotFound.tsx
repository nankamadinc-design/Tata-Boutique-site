import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page introuvable — Tata Boutique" description="Cette page n'existe pas sur Tata Boutique." path="/404" />
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="font-display text-6xl font-semibold text-primary">404</span>
        <h1 className="text-xl font-semibold">Page introuvable</h1>
        <p className="max-w-sm text-text-muted">
          La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil ou explorez la boutique.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
          <Link to="/boutique" className="btn btn-outline">Voir la boutique</Link>
        </div>
      </div>
    </>
  );
}
