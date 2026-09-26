import { useEffect } from 'react';
import { SITE_URL } from '../../config/env';

interface Props {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

/** Lightweight SEO manager — sets title, meta description, canonical, OG/Twitter tags, and JSON-LD per page. */
export default function SEO({ title, description, path = '/', image, jsonLd }: Props) {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${SITE_URL}${path}`);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${path}`);

    let ld = document.getElementById('page-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement('script');
        ld.id = 'page-jsonld';
        ld.type = 'application/ld+json';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(jsonLd);
    } else if (ld) {
      ld.remove();
    }

    return () => {
      const cleanupLd = document.getElementById('page-jsonld');
      if (cleanupLd) cleanupLd.remove();
    };
  }, [title, description, path, image, jsonLd]);

  return null;
}
