import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  image?: string;
  canonicalPath?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: 'website' | 'product' | 'article';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function ensureMeta(selector: string, create: () => HTMLMetaElement) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  return element;
}

function ensureLink(selector: string, create: () => HTMLLinkElement) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }

  return element;
}

function resolveBaseUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }

  return 'https://thedmashop.com';
}

function resolveImageUrl(image?: string) {
  if (!image) {
    return undefined;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${resolveBaseUrl()}${image.startsWith('/') ? image : `/${image}`}`;
}

export function Seo({ title, description, image, canonicalPath, keywords, noindex = false, type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    const baseUrl = resolveBaseUrl();
    const canonicalUrl = `${baseUrl}${canonicalPath ?? window.location.pathname}`;
    const imageUrl = resolveImageUrl(image);
    const robotsValue = noindex ? 'noindex, nofollow' : 'index, follow';

    document.title = title;

    const descriptionMeta = ensureMeta('meta[name="description"]', () => {
      const meta = document.createElement('meta');
      meta.name = 'description';
      return meta;
    });
    descriptionMeta.content = description;

    const robotsMeta = ensureMeta('meta[name="robots"]', () => {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      return meta;
    });
    robotsMeta.content = robotsValue;

    const keywordsMeta = ensureMeta('meta[name="keywords"]', () => {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      return meta;
    });
    keywordsMeta.content = keywords?.join(', ') ?? '';

    const canonicalLink = ensureLink('link[rel="canonical"]', () => {
      const link = document.createElement('link');
      link.rel = 'canonical';
      return link;
    });
    canonicalLink.href = canonicalUrl;

    const ogTitleMeta = ensureMeta('meta[property="og:title"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      return meta;
    });
    ogTitleMeta.content = title;

    const ogDescriptionMeta = ensureMeta('meta[property="og:description"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      return meta;
    });
    ogDescriptionMeta.content = description;

    const ogTypeMeta = ensureMeta('meta[property="og:type"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:type');
      return meta;
    });
    ogTypeMeta.content = type;

    const ogUrlMeta = ensureMeta('meta[property="og:url"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      return meta;
    });
    ogUrlMeta.content = canonicalUrl;

    const ogSiteMeta = ensureMeta('meta[property="og:site_name"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:site_name');
      return meta;
    });
    ogSiteMeta.content = 'theDMAshop';

    const twitterCardMeta = ensureMeta('meta[name="twitter:card"]', () => {
      const meta = document.createElement('meta');
      meta.name = 'twitter:card';
      return meta;
    });
    twitterCardMeta.content = imageUrl ? 'summary_large_image' : 'summary';

    const twitterTitleMeta = ensureMeta('meta[name="twitter:title"]', () => {
      const meta = document.createElement('meta');
      meta.name = 'twitter:title';
      return meta;
    });
    twitterTitleMeta.content = title;

    const twitterDescriptionMeta = ensureMeta('meta[name="twitter:description"]', () => {
      const meta = document.createElement('meta');
      meta.name = 'twitter:description';
      return meta;
    });
    twitterDescriptionMeta.content = description;

    if (imageUrl) {
      const ogImageMeta = ensureMeta('meta[property="og:image"]', () => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:image');
        return meta;
      });
      ogImageMeta.content = imageUrl;

      const twitterImageMeta = ensureMeta('meta[name="twitter:image"]', () => {
        const meta = document.createElement('meta');
        meta.name = 'twitter:image';
        return meta;
      });
      twitterImageMeta.content = imageUrl;
    }

    const scriptId = 'seo-jsonld';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const currentScript = document.getElementById(scriptId);
      currentScript?.remove();
    };
  }, [canonicalPath, description, image, jsonLd, keywords, noindex, title, type]);

  return null;
}
