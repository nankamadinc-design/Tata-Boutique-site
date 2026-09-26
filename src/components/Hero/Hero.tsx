import { Link } from 'react-router-dom';
import Slideshow from '../Slideshow/Slideshow';
import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-offset to-bg">
      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="order-2 lg:order-1">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Boutique en ligne en Guinée
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {settings.shopName}
          </h1>
          <p className="mt-3 font-display text-xl italic text-primary sm:text-2xl">« {settings.slogan} »</p>
          <p className="mt-5 max-w-lg text-base text-text-muted">
            Découvrez une sélection soignée de vêtements, chaussures, accessoires, produits de beauté,
            téléphones et articles pour la maison — livrée avec le sourire, directement commandée sur
            WhatsApp, partout en Guinée.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/boutique" className="btn btn-primary">
              Découvrir la boutique
            </Link>
            <a
              href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Slideshow />
        </div>
      </div>
    </section>
  );
}
