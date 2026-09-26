import SEO from '../../components/SEO/SEO';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';

export default function About() {
  const { settings } = useSettings();

  return (
    <>
      <SEO
        title="À propos — Tata Boutique"
        description="Découvrez Tata Boutique, une boutique en ligne guinéenne dédiée à des produits de qualité au meilleur prix."
        path="/a-propos"
      />
      <div className="container-page py-8 sm:py-10">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">À propos de {settings.shopName}</h1>

        <div className="mt-6 max-w-2xl space-y-5 text-text-muted">
          <p>
            {settings.description}
          </p>
          <p>
            Notre mission est simple : proposer des produits utiles et soignés — vêtements, chaussures,
            accessoires, produits de beauté, téléphones, articles électroniques et pour la maison — à des
            prix accessibles, avec un service client réactif directement sur WhatsApp.
          </p>
          <p>
            Nous mettons à jour régulièrement notre catalogue avec de nouvelles arrivées et des promotions.
            Pour toute question sur un produit ou sa disponibilité, notre équipe reste joignable rapidement.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface-offset p-6">
          <h2 className="text-lg font-semibold">Notre engagement</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            <li>• « {settings.slogan} » — un engagement de qualité à chaque commande.</li>
            <li>• Commande simple et rapide directement par WhatsApp.</li>
            <li>• Un service basé en Guinée, à l'écoute de sa clientèle.</li>
          </ul>
        </div>

        <a
          href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp mt-8"
        >
          Nous écrire sur WhatsApp
        </a>
      </div>
    </>
  );
}
