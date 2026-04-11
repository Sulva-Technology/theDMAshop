import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Truck, RotateCcw, ShieldCheck, ChevronRight, ChevronLeft, Plus, Minus, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Seo } from '@/components/Seo';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useStore } from '@/lib/store';
import { buildCartItem, findVariant, getDefaultVariant, getProductGallery, getProductPrimaryImage } from '@/lib/product-helpers';
import { absoluteUrl, buildBreadcrumbList } from '@/lib/seo';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, productsError, addToCart, wishlist, toggleWishlist, cmsContent } = useStore();
  const product = products.find((item) => item.slug === slug);
  const defaultVariant = useMemo(() => (product ? getDefaultVariant(product) : null), [product]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(defaultVariant?.color ?? '');
  const [selectedSize, setSelectedSize] = useState(defaultVariant?.size ?? '');
  const [quantity, setQuantity] = useState(1);

  React.useEffect(() => {
    setSelectedImage(0);
    setSelectedColor(defaultVariant?.color ?? '');
    setSelectedSize(defaultVariant?.size ?? '');
    setQuantity(1);
  }, [defaultVariant?.id, product?.id]);

  const selectedVariant = product ? findVariant(product, selectedColor, selectedSize) ?? defaultVariant : null;
  const gallery = product ? getProductGallery(product, selectedVariant) : [];
  const relatedProducts = product ? products.filter((item) => item.id !== product.id).slice(0, 4) : [];
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast.error('Select an available variant before adding to cart');
      return;
    }

    if (selectedVariant.inventoryQuantity < quantity) {
      toast.error('This variant does not have enough inventory');
      return;
    }

    addToCart(buildCartItem(product, selectedVariant, quantity));
    toast.success('Added to cart');
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-20">
          <div className="rounded-3xl border border-border/50 bg-secondary/10 p-10 text-center text-muted-foreground">
            Loading product details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Seo
          title="Catalog Unavailable | theDMAshop"
          description="The product catalog is temporarily unavailable."
          canonicalPath={slug ? `/products/${slug}` : '/shop'}
          noindex
        />
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-20">
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-10 text-center space-y-3">
            <h1 className="text-3xl font-heading font-bold">Catalog unavailable</h1>
            <p className="text-muted-foreground">{productsError}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || product.status !== 'active' || product.variants.every((variant) => variant.status !== 'active')) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Seo
          title="Product Not Available | theDMAshop"
          description="This product is unavailable or no longer published."
          canonicalPath={slug ? `/products/${slug}` : '/shop'}
          noindex
        />
        <Navbar />
        <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-20">
          <div className="rounded-3xl border border-border/50 bg-secondary/10 p-10 text-center space-y-4">
            <h1 className="text-3xl font-heading font-bold">Product not available</h1>
            <p className="text-muted-foreground">
              This product is unpublished, missing active variants, or no longer exists.
            </p>
            <Button className="rounded-full" onClick={() => navigate('/shop')}>
              Back to shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={product.seoTitle || `${product.name} | theDMAshop`}
        description={product.seoDescription || product.summary || product.description || `Shop ${product.name} at theDMAshop.`}
        image={gallery[0]?.url || product.image}
        canonicalPath={`/products/${product.slug}`}
        type="product"
        keywords={[product.name, product.category, ...product.colors, ...product.sizes, 'theDMAshop']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Product',
              name: product.name,
              description: product.description || product.summary || '',
              image: gallery.map((item) => absoluteUrl(item.url)).slice(0, 8),
              sku: selectedVariant?.sku || defaultVariant?.sku,
              brand: {
                '@type': 'Brand',
                name: 'theDMAshop',
              },
              offers: {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: selectedVariant?.price ?? product.price,
                availability:
                  (selectedVariant?.inventoryQuantity ?? 0) > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                url: absoluteUrl(`/products/${product.slug}`),
              },
            },
            buildBreadcrumbList([
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: product.name, path: `/products/${product.slug}` },
            ]),
          ],
        }}
      />
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary premium-shadow">
              <AnimatePresence mode="wait">
                <motion.img
                  key={gallery[selectedImage]?.url}
                  src={gallery[selectedImage]?.url}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {gallery.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" onClick={prevImage} className="rounded-full glass">
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={nextImage} className="rounded-full glass">
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {gallery.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={image.url} alt={image.altText ?? `${product.name} ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold">
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tighter break-words">{product.name}</h1>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">${selectedVariant?.price.toFixed(2) ?? product.price.toFixed(2)}</p>
                  {selectedVariant?.compareAtPrice ? (
                    <p className="text-sm text-muted-foreground line-through">${selectedVariant.compareAtPrice.toFixed(2)}</p>
                  ) : null}
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{product.summary || product.description}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Color: <span className="text-muted-foreground font-medium">{selectedColor || 'Select'}</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <Button key={color} variant={selectedColor === color ? 'default' : 'outline'} onClick={() => setSelectedColor(color)} className="rounded-full">
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Size: <span className="text-muted-foreground font-medium">{selectedSize || 'Select'}</span>
                </h3>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const sizeVariant = findVariant(product, selectedColor || undefined, size);
                  const disabled = !sizeVariant || sizeVariant.inventoryQuantity === 0;
                  return (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className="rounded-xl h-12 font-bold"
                      disabled={disabled}
                    >
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-secondary/10 p-4 text-sm text-muted-foreground">
              {selectedVariant ? `${selectedVariant.inventoryQuantity} units available for this variant.` : 'Choose a valid color and size combination.'}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap sm:flex-nowrap gap-4">
                <div className="flex items-center bg-secondary/30 rounded-full px-2 border border-border shrink-0">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="flex-grow rounded-full h-14 text-base sm:text-lg font-bold premium-shadow-hover gap-2" onClick={handleAddToCart} disabled={!selectedVariant}>
                  <ShoppingCart className="h-5 w-5 shrink-0" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full h-14 w-14 shrink-0 ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 px-4 bg-secondary/10 rounded-3xl border border-border/50">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{cmsContent.policies[0]?.title ?? 'Shipping'}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{cmsContent.policies[1]?.title ?? 'Returns'}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-[10px] uppercase tracking-widest font-bold">{cmsContent.policies[2]?.title ?? 'Secure checkout'}</span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description" className="border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Description</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {product.description || 'No product description has been added yet.'}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details" className="border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Details & Fit</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {product.details.length > 0 ? (
                      product.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">Product details have not been added yet.</li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-none">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                  <p>{cmsContent.policies[0]?.content ?? 'Shipping policy coming soon.'}</p>
                  <p>{cmsContent.policies[1]?.content ?? 'Returns policy coming soon.'}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="py-24 border-t border-border mt-24">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Discovery</span>
                <h2 className="text-4xl font-heading font-bold tracking-tight">You may also like</h2>
              </div>
              <Button variant="link" className="group text-lg" onClick={() => navigate('/shop')}>
                View Collection
                <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={`$${relatedProduct.price.toFixed(2)}`}
                  category={relatedProduct.category}
                  image={getProductPrimaryImage(relatedProduct)}
                  isNew={relatedProduct.isNew}
                  onAddToCart={() => {
                    const variant = getDefaultVariant(relatedProduct);
                    if (!variant) {
                      toast.error('This product is currently unavailable');
                      return;
                    }
                    addToCart(buildCartItem(relatedProduct, variant));
                    toast.success('Added to cart');
                  }}
                  onToggleWishlist={() => toggleWishlist(relatedProduct.id)}
                  isWishlisted={wishlist.includes(relatedProduct.id)}
                  onClick={() => navigate(`/products/${relatedProduct.slug}`)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
