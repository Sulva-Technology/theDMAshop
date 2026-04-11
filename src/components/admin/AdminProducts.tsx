import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Image as ImageIcon,
  Edit,
  Trash2,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

export default function AdminProducts() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const { products, saveProduct, archiveProduct } = useStore();
  
  const [newProduct, setNewProduct] = useState({
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
    images: [] as string[]
  });

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({
      title: product.name,
      summary: product.summary || '',
      desc: product.description || '',
      details: product.details ? product.details.join('\n') : '',
      price: product.price.toString(),
      compare: '',
      inventory: product.inventory.toString(),
      category: product.category,
      colors: product.colors.join(', ') || 'Default',
      sizes: product.sizes.join(', ') || 'One Size',
      image: product.image,
      images: product.images || []
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!newProduct.title || !newProduct.price) {
      toast.error("Title and price are required");
      return;
    }

    try {
      const productId = editingProductId || crypto.randomUUID();
      const slug = newProduct.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existing = products.find((product) => product.id === editingProductId);
      const colors = newProduct.colors.split(',').map((value) => value.trim()).filter(Boolean);
      const sizes = newProduct.sizes.split(',').map((value) => value.trim()).filter(Boolean);
      const normalizedColors = colors.length > 0 ? colors : ['Default'];
      const normalizedSizes = sizes.length > 0 ? sizes : ['One Size'];
      const inventory = parseInt(newProduct.inventory, 10) || 0;
      const price = parseFloat(newProduct.price);
      const compareAtPrice = newProduct.compare ? parseFloat(newProduct.compare) : null;
      const gallery = [newProduct.image, ...newProduct.images].filter(Boolean);
      const uniqueGallery = [...new Set(gallery)];

      const nextProduct: Product = {
        id: productId,
        slug,
        name: newProduct.title,
        price,
        image: uniqueGallery[0] || existing?.image || "https://picsum.photos/seed/new-product/800/1000",
        inventory,
        colors: normalizedColors,
        sizes: normalizedSizes,
        summary: newProduct.summary,
        description: newProduct.desc,
        category: newProduct.category,
        status: 'active',
        isFeatured: existing?.isFeatured ?? false,
        isNew: existing?.isNew ?? true,
        seoTitle: `${newProduct.title} | theDMAshop`,
        seoDescription: newProduct.summary || newProduct.desc || undefined,
        details: newProduct.details.split('\n').filter((detail) => detail.trim() !== ''),
        images: uniqueGallery.map((url, index) => ({
          id: existing?.images[index]?.id || crypto.randomUUID(),
          productId,
          variantId: null,
          url,
          sortOrder: index,
          altText: newProduct.title,
        })),
        variants: normalizedColors.flatMap((color) =>
          normalizedSizes.map((size, index) => ({
            id: existing?.variants.find((variant) => variant.color === color && variant.size === size)?.id || crypto.randomUUID(),
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

      await saveProduct(nextProduct);
      toast.success(editingProductId ? "Product updated successfully" : "Product added successfully");
      setIsAddProductOpen(false);
      setEditingProductId(null);
      setNewProduct({
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
        images: []
      });
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await archiveProduct(productId);
      toast.success("Product archived successfully");
    } catch (error: any) {
      toast.error(error?.message ?? 'Unable to archive product');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'inventory') return a.inventory - b.inventory;
    return 0; // Default to newest
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory, pricing, and product details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full bg-background border-border/50">
            Export
          </Button>
          <Sheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full font-bold premium-shadow-sm gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-l-0 sm:border-l border-border/50">
              <SheetHeader className="p-6 border-b border-border/50">
                <SheetTitle className="text-2xl font-heading font-bold">{editingProductId ? 'Edit Product' : 'Add New Product'}</SheetTitle>
              </SheetHeader>
              <div className="p-6 space-y-8">
                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Main Product Image</Label>
                    <ImageUpload 
                      value={newProduct.image} 
                      onChange={(url) => setNewProduct({...newProduct, image: url as string})} 
                      bucket="product-media"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Gallery (Multiple Images)</Label>
                    <ImageUpload 
                      value={newProduct.images} 
                      onChange={(urls) => setNewProduct({...newProduct, images: urls as string[]})} 
                      bucket="product-media"
                      multiple
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input id="title" placeholder="e.g. Premium Cotton Tee" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Short Summary</Label>
                    <textarea id="summary" className="w-full min-h-[60px] p-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" placeholder="Short summary for the product..." value={newProduct.summary} onChange={(e) => setNewProduct({...newProduct, summary: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <textarea id="desc" className="w-full min-h-[100px] p-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" placeholder="Describe the product..." value={newProduct.desc} onChange={(e) => setNewProduct({...newProduct, desc: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="details">Details & Fit (One per line)</Label>
                    <textarea id="details" className="w-full min-h-[100px] p-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" placeholder="100% Cotton&#10;Slim fit&#10;Machine wash cold" value={newProduct.details} onChange={(e) => setNewProduct({...newProduct, details: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" placeholder="0.00" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compare">Compare at Price</Label>
                    <Input id="compare" type="number" placeholder="0.00" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={newProduct.compare} onChange={(e) => setNewProduct({...newProduct, compare: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory Quantity</Label>
                    <Input id="inventory" type="number" placeholder="0" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={newProduct.inventory} onChange={(e) => setNewProduct({...newProduct, inventory: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select id="category" className="w-full h-12 px-3 rounded-xl bg-secondary/10 border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                      <option>Tops</option>
                      <option>Bottoms</option>
                      <option>Outerwear</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="colors">Colors (comma separated)</Label>
                    <Input id="colors" placeholder="Navy, Black" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={newProduct.colors} onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes (comma separated)</Label>
                    <Input id="sizes" placeholder="S, M, L" className="h-12 rounded-xl bg-secondary/10 border-border/50" value={newProduct.sizes} onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})} />
                  </div>
                </div>
              </div>
              <SheetFooter className="p-6 border-t border-border/50 bg-background sticky bottom-0">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)} className="rounded-xl h-12">Cancel</Button>
                <Button className="rounded-xl h-12 font-bold premium-shadow-hover" onClick={handleSaveProduct}>Save Product</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-background p-4 rounded-2xl border border-border/50 premium-shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 bg-secondary/10 border-none rounded-xl h-10 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-10 gap-2 border-border/50">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <select 
            className="h-10 px-3 rounded-xl bg-background border border-border/50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-low">Sort by: Price (Low to High)</option>
            <option value="inventory">Sort by: Inventory</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-background rounded-2xl border border-border/50 premium-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/20">
              <tr>
                <th className="px-6 py-4 font-medium w-12">
                  <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                </th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Inventory</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProducts.map((product) => {
                const inventory = product.inventory;
                const status: string = inventory === 0 ? 'Out of Stock' : inventory < 20 ? 'Low Stock' : 'Active';
                
                return (
                <tr key={product.id} className="hover:bg-secondary/10 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-border/50 text-primary focus:ring-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-secondary overflow-hidden shrink-0 border border-border/50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-[250px]">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`border-none ${
                      status === 'Active' ? 'bg-green-500/10 text-green-600' : 
                      status === 'Draft' ? 'bg-secondary text-muted-foreground' : 
                      status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                        <Archive className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-600" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground bg-secondary/5">
          <span>Showing 1-{filteredProducts.length} of {products.length} products</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
