import type { CartItem, Product, ProductImage, ProductVariant } from '@/lib/types';

export function getActiveVariants(product: Product): ProductVariant[] {
  return product.variants.filter((variant) => variant.status === 'active');
}

export function getDefaultVariant(product: Product): ProductVariant | null {
  return getActiveVariants(product).find((variant) => variant.inventoryQuantity > 0) ?? getActiveVariants(product)[0] ?? null;
}

export function findVariant(product: Product, color?: string, size?: string): ProductVariant | null {
  const normalizedColor = color?.trim().toLowerCase();
  const normalizedSize = size?.trim().toLowerCase();

  return (
    getActiveVariants(product).find((variant) => {
      const colorMatches = normalizedColor ? variant.color.toLowerCase() === normalizedColor : true;
      const sizeMatches = normalizedSize ? variant.size.toLowerCase() === normalizedSize : true;
      return colorMatches && sizeMatches;
    }) ?? null
  );
}

export function getProductPrimaryImage(product: Product, variant?: ProductVariant | null): string {
  if (variant?.imageUrl) {
    return variant.imageUrl;
  }

  if (variant) {
    const variantImage = product.images.find((image) => image.variantId === variant.id);
    if (variantImage?.url) {
      return variantImage.url;
    }
  }

  return product.images[0]?.url ?? product.image;
}

export function getProductGallery(product: Product, variant?: ProductVariant | null): ProductImage[] {
  if (variant) {
    const variantImages = product.images.filter((image) => image.variantId === variant.id);
    if (variantImages.length > 0) {
      return variantImages;
    }
  }

  return product.images.length > 0
    ? product.images
    : [
        {
          id: `${product.id}-fallback`,
          productId: product.id,
          variantId: variant?.id ?? null,
          url: getProductPrimaryImage(product, variant),
          sortOrder: 0,
          altText: product.name,
        },
      ];
}

export function getAvailableCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.category).filter(Boolean))].sort();
}

export function getAvailableColors(products: Product[]): string[] {
  return [...new Set(products.flatMap((product) => getActiveVariants(product).map((variant) => variant.color)).filter(Boolean))].sort();
}

export function getAvailableSizes(products: Product[]): string[] {
  return [...new Set(products.flatMap((product) => getActiveVariants(product).map((variant) => variant.size)).filter(Boolean))].sort();
}

export function getPriceRange(products: Product[]): [number, number] {
  const prices = products.flatMap((product) => getActiveVariants(product).map((variant) => variant.price));

  if (prices.length === 0) {
    return [0, 0];
  }

  return [Math.min(...prices), Math.max(...prices)];
}

export function buildCartItem(product: Product, variant: ProductVariant, quantity = 1): CartItem {
  return {
    id: `${product.id}:${variant.id}`,
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    name: product.name,
    price: variant.price,
    image: getProductPrimaryImage(product, variant),
    color: variant.color,
    size: variant.size,
    quantity,
  };
}
