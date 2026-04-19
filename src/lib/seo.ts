export function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }

  return 'https://thedmashop.com';
}

export function absoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const siteUrl = getSiteUrl();
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildBreadcrumbList(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
