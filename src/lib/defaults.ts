import type { CMSContent } from '@/lib/types';

export const EMPTY_CMS_CONTENT: CMSContent = {
  hero: {
    title: '',
    slogan: '',
    description: '',
    buttonText: '',
    buttonLink: '/shop',
    image: '',
  },
  aboutUs: {
    title: '',
    content: '',
    image: '',
  },
  footer: {
    description: '',
    socialLinks: [],
    shopLinks: [],
    supportLinks: [],
    copyright: '',
  },
  navigation: {
    links: [],
    promoText: '',
  },
  policies: [],
  contactUs: {
    email: '',
    phone: '',
    address: '',
  },
  seo: {
    title: 'theDMAshop',
    description: '',
  },
};
