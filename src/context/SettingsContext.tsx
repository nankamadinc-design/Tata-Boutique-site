import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Settings } from '../types';
import { getSettings } from '../services/api';
import { DEFAULT_WHATSAPP_NUMBER, SOCIAL_LINKS } from '../config/site';

const FALLBACK_SETTINGS: Settings = {
  shopName: 'Tata Boutique',
  slogan: 'La qualité au meilleur prix',
  description:
    'Tata Boutique propose une sélection de produits du quotidien en Guinée, à commander facilement sur WhatsApp.',
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  contactEmail: null,
  facebookUrl: SOCIAL_LINKS.facebook,
  tiktokUrl: SOCIAL_LINKS.tiktok,
  youtubeUrl: SOCIAL_LINKS.youtube,
  logoUrl: null,
  address: null,
};

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: FALLBACK_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch {
      // API unreachable — keep the safe fallback so the site stays usable.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
