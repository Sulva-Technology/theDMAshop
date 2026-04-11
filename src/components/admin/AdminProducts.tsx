import React, { useMemo, useState } from 'react';
import { Archive, Edit, Filter, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ImageUpload } from '@/components/ui/ImageUpload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/types';

const EMPTY_PRODUCT_FORM = {
  title: '',
  summary: '',
  desc: '',
  details: '',
  price: '',
  compare: '',
  inventory: '',
  category: 'Tops',
  colors: 'Default',
  sizes: 'One Size',
  image: '',
  images: [] as string[],
};

export default function AdminProducts() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isSaving, setIsSaving] = useState(false);
  const { products, saveProduct, archiveProduct, productsLoading, productsError } = useStore();

  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  const resetEditor = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setIsEditorOpen(false);
  };

  const openNewProductEditor = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setIsEditorOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      title: product.name,
      summary: product.summary || '',
      desc: product.description || '',
      details: product.details.join('\n'),
      price: product.price.toString(),
      compare: product.variants[0]?.compareAtPrice?.toString() || '',
      inventory: product.inventory.toString(),
      category: product.category,
      colors: product.colors.join(', ') || 'Default',
      sizes: product.sizes.join(', ') || 'One Size',
      image: product.image,
      images: product.images.map((image) => image.url).filter((url) => url !== product.image),
    });
    setIsEditorOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!searchQuery) {
          return true;
        }

        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) || product.id.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'inventory') return a.inventory - b.inventory;
        return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      });
  }, [products, searchQuery, sortBy]);

  const handleSaveProduct = async () => {
    if (!productForm.title.trim() || !productForm.price.trim()) {
      toast.error('Title and price are required');
      return;
    }

    const price = Number.parseFloat(productForm.price);
    const compareAtPrice = productForm.compare.trim() ? Number.parseFloat(productForm.compare) : null;
    const inventory = Number.parseInt(productForm.inventory, 10) || 0;

    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Enter a valid price');
      return;
    }

    if (compareAtPrice !== null && !Number.isFinite(compareAtPrice)) {
      toast.error('Enter a valid compare-at price');
      return;
    }

    const existing = products.find((product) => product.id === editingProductId);
    const productId = editingProductId || crypto.randomUUID();
    const slug = productForm.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const colors = productForm.colors.split(',').map((value) => value.trim()).filter(Boolean);
    const sizes = productForm.sizes.split(',').map((value) => value.trim()).filter(Boolean);
    const normalizedColors = colors.length > 0 ? colors : ['Default'];
    const normalizedSizes = sizes.length > 0 ? sizes : ['One Size'];
    const gallery = [productForm.image, ...productForm.images].filter(Boolean);
    const uniqueGallery = [...new Set(gallery)];

    const nextProduct: Product = {
      id: productId,
      slug,
      name: productForm.title.trim(),
      price,
      image: uniqueGallery[0] || existing?.image || 'https://picsum.photos/seed/new-product/800/1000',
      inventory,
      colors: normalizedColors,
      sizes: normalizedSizes,
      summary: productForm.summary.trim() || undefined,
      description: productForm.desc.trim() || undefined,
      category: productForm.category,
      status: existing?.status ?? 'active',
      isFeatured: existing?.isFeatured ?? false,
      isNew: existing?.isNew ?? true,
      seoTitle: `${productForm.title.trim()} | theDMAshop`,
      seoDescription: productForm.summary.trim() || productForm.desc.trim() || undefined,
      details: productForm.details.split('\n').map((line) => line.trim()).filter(Boolean),
      images: uniqueGallery.map((url, index) => ({
        id: existing?.images[index]?.id || crypto.randomUUID(),
        productId,
        variantId: null,
        url,
        sortOrder: index,
        altText: productForm.title.trim(),
      })),
      variants: normalizedColors.flatMap((color) =>
        normalizedSizes.map((size, index) => ({
          id:
            existing?.variants.find((variant) => variant.color === color && variant.size === size)?.id ||
            crypto.randomUUID(),
          productId,
          sku: `${slug}-${color}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, '-'),
          color,
          size,
          price,
          compareAtPrice,
          inventoryQuantity: inventory,
          imageUrl: uniqueGallery[index] || uniqueGallery[0] || null,
          status: 'active' as const,
        })),
      ),
    };

    setIsSaving(true);
    try {
      await saveProduct(nextProduct);
      toast.success(editingProductId ? 'Product updated successfully' : 'Product added successfully');
      resetEditor();
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveProduct = async (productId: string) => {
    try {
      await archiveProduct(productId);
      toast.success('Product archived successfully');
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to archive product');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full bg-background border-border/50" disabled>
            Export
          </Button>
          <Sheet
            open={isEditorOpen}
            onOpenChange={(open) => {
              if (!open) {
                resetEditor();
                return;
              }

              setIsEditorOpen(true);
            }}
          >
            <SheetTrigger asChild>
              <Button className="rounded-full font-bold premium-shadow-sm gap-2" onClick={openNewProductEditor}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-l-0 sm:border-l border-border/50">
              <SheetHeader className="p-6 border-b border-border/50">
                <SheetTitle className="text-2xl font-heading font-bold">{editingProductId ? 'Edit Product' : 'Add New Product'}</SheetTitle>
              </SheetHeader>
              <div className="p-6 space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Main Product Image</Label>
                    <ImageUpload value={productForm.image} onChange={(url) => setProductForm({ ...productForm, image: url as string })} bucket="product-media" />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Gallery</Label>
                    <ImageUpload value={productForm.images} onChange={(urls) => setProductForm({ ...productForm, images: urls as string[] })} bucket="product-media" multiple />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input id="title" placeholder="Premium Cotton Tee" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Short Summary</Label>
                    <textarea id="summary" className="w-full min-h-[60px] p-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" value={productForm.summary} onChange={(e) => setProductForm({ ...productForm, summary: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <textarea id="desc" className="w-full min-h-[100px] p-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" value={productForm.desc} onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Details & Fit</Label>
                    <textarea id="details" className="w-full min-h-[100px] p-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" placeholder="100% Cotton&#10;Slim fit" value={productForm.details} onChange={(e) => setProductForm({ ...productForm, details: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="0.00" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compare">Compare at Price</Label>
                    <Input id="compare" type="number" placeholder="0.00" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={productForm.compare} onChange={(e) => setProductForm({ ...productForm, compare: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory Quantity</Label>
                    <Input id="inventory" type="number" placeholder="0" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={productForm.inventory} onChange={(e) => setProductForm({ ...productForm, inventory: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select id="category" className="w-full h-12 px-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                      <option>Tops</option>
                      <option>Bottoms</option>
                      <option>Outerwear</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colors</Label>
                    <Input id="colors" placeholder="Navy, Black" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={productForm.colors} onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes</Label>
                    <Input id="sizes" placeholder="S, M, L" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} />
                  </div>
                </div>
              </div>
              <SheetFooter className="p-6 border-t border-border/50 bg-background sticky bottom-0">
                <Button variant="outline" onClick={resetEditor} className="rounded-xl h-12">
                  Cancel
                </Button>
                <Button className="rounded-xl h-12 font-bold premium-shadow-hover" onClick={handleSaveProduct} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Product'}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-background p-4 rounded-2xl border border-border/50 premium-shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9 bg-secondary/10 border-none rounded-xl h-10 focus-visible:ring-primary" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10 gap-2 border-border/50" disabled>
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <select className="h-10 px-3 rounded-xl bg-background border border-border/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Sort by: Price (Low to High)</option>
            <option value="inventory">Sort by: Inventory</option>
          </select>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Inventory</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {productsLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading products...</td>
                </tr>
              )}
              {!productsLoading && productsError && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-600">{productsError}</td>
                </tr>
              )}
              {!productsLoading && !productsError && filteredProducts.map((product) => {
                const inventory = product.inventory;
                const status = inventory === 0 ? 'Out of Stock' : inventory < 20 ? 'Low Stock' : 'Active';

                return (
                  <tr key={product.id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border/50">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[150px] sm:max-w-[250px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`border-none ${status === 'Active' ? 'bg-green-500/10 text-green-600' : status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'}`}>
                        {status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={inventory === 0 ? 'text-red-500 font-medium' : inventory < 20 ? 'text-yellow-600 font-medium' : ''}>
                        {inventory} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 font-medium">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary" onClick={() => handleArchiveProduct(product.id)}>
                          <Archive className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-600" onClick={() => handleArchiveProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!productsLoading && !productsError && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No products match this view.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground bg-secondary/5">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
