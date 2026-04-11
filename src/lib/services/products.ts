import { requireSupabase } from '@/lib/supabase';
import type { Product, ProductImage, ProductVariant } from '@/lib/types';

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  category: string;
  status: string;
  is_featured: boolean;
  is_new: boolean;
  seo_title: string | null;
  seo_description: string | null;
  details: string[] | null;
  created_at?: string;
  updated_at?: string;
  product_images?: any[];
  product_variants?: any[];
};

function mapProduct(row: ProductRow): Product {
  const images: ProductImage[] = (row.product_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({
      id: image.id,
      productId: image.product_id,
      variantId: image.variant_id,
      url: image.url,
      sortOrder: image.sort_order ?? 0,
      altText: image.alt_text ?? undefined,
    }));

  const variants: ProductVariant[] = (row.product_variants ?? []).map((variant) => ({
    id: variant.id,
    productId: variant.product_id,
    sku: variant.sku,
    color: variant.color,
    size: variant.size,
    price: Number(variant.price),
    compareAtPrice: variant.compare_at_price ? Number(variant.compare_at_price) : null,
    inventoryQuantity: Number(variant.inventory_quantity ?? 0),
    imageUrl: variant.image_url,
    status: variant.status,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: variants[0]?.price ?? 0,
    image: images[0]?.url ?? variants[0]?.imageUrl ?? '',
    inventory: variants.reduce((sum, variant) => sum + variant.inventoryQuantity, 0),
    colors: [...new Set(variants.map((variant) => variant.color))],
    sizes: [...new Set(variants.map((variant) => variant.size))],
    summary: row.summary ?? undefined,
    description: row.description ?? undefined,
    category: row.category,
    status: row.status as Product['status'],
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    details: row.details ?? [],
    images,
    variants,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const PRODUCT_SELECT = `
  id,
  slug,
  name,
  summary,
  description,
  category,
  status,
  is_featured,
  is_new,
  seo_title,
  seo_description,
  details,
  created_at,
  updated_at,
  product_images (
    id,
    product_id,
    variant_id,
    url,
    sort_order,
    alt_text
  ),
  product_variants (
    id,
    product_id,
    sku,
    color,
    size,
    price,
    compare_at_price,
    inventory_quantity,
    image_url,
    status
  )
`;

export async function fetchProducts(includeArchived = false): Promise<Product[]> {
  const supabase = requireSupabase();
  let query = supabase.from('products').select(PRODUCT_SELECT).order('created_at', { ascending: false });
  if (!includeArchived) {
    query = query.eq('status', 'active');
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data as ProductRow[]).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('slug', slug).maybeSingle();
  if (error) {
    throw error;
  }

  return data ? mapProduct(data as ProductRow) : null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  const supabase = requireSupabase();
  const productPayload = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    summary: product.summary ?? null,
    description: product.description ?? null,
    category: product.category,
    status: product.status,
    is_featured: product.isFeatured,
    is_new: product.isNew,
    seo_title: product.seoTitle ?? null,
    seo_description: product.seoDescription ?? null,
    details: product.details,
  };

  const { error: productError } = await supabase.from('products').upsert(productPayload).select('id').single();
  if (productError) {
    throw productError;
  }

  const imagesPayload = product.images.map((image, index) => ({
    id: image.id,
    product_id: product.id,
    variant_id: image.variantId ?? null,
    url: image.url,
    sort_order: index,
    alt_text: image.altText ?? null,
  }));

  const variantsPayload = product.variants.map((variant) => ({
    id: variant.id,
    product_id: product.id,
    sku: variant.sku,
    color: variant.color,
    size: variant.size,
    price: variant.price,
    compare_at_price: variant.compareAtPrice ?? null,
    inventory_quantity: variant.inventoryQuantity,
    image_url: variant.imageUrl ?? null,
    status: variant.status,
  }));

  if (imagesPayload.length > 0) {
    const { error } = await supabase.from('product_images').upsert(imagesPayload);
    if (error) {
      throw error;
    }
  }

  if (variantsPayload.length > 0) {
    const { error } = await supabase.from('product_variants').upsert(variantsPayload);
    if (error) {
      throw error;
    }
  }

  return product;
}

export async function archiveProduct(productId: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('products').update({ status: 'archived' }).eq('id', productId);
  if (error) {
    throw error;
  }
}
