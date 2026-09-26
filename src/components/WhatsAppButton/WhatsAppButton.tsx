import { useSettings } from '../../context/SettingsContext';
import { generateWhatsAppLinkGeneric } from '../../utils/whatsapp';

/** Floating WhatsApp button, present on every public page. Works on Android, iPhone, desktop via wa.me. */
export default function WhatsAppButton() {
  const { settings } = useSettings();

  return (
    <a
      href={generateWhatsAppLinkGeneric(settings.whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Tata Boutique sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 hover:bg-whatsapp-hover active:scale-95 sm:bottom-6 sm:right-6"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.6 6.3A8.9 8.9 0 0 0 12 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.1A9 9 0 1 0 17.6 6.3ZM12 19.5a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.7.8.8-2.6-.2-.3A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5Zm4.1-5.6c-.2-.1-1.3-.7-1.5-.7s-.4-.1-.5.1-.6.7-.7.9-.3.2-.5.1a6 6 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.5c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.6-1.5c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a2 2 0 0 0-.6 1.5c0 .9.6 1.8 1.4 2.8a9.5 9.5 0 0 0 3.6 3c1.4.6 1.9.5 2.3.4a2 2 0 0 0 1.2-1c.2-.4.2-.7.1-.8Z" />
      </svg>
      <span className="sr-only">Commander sur WhatsApp</span>
    </a>
  );
}
