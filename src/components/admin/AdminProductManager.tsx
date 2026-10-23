'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, Edit, Package, Trash2, CheckCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductProvider';
import { useRouter } from 'next/navigation';

/**
 * Unified Admin Product Manager v3.0:
 * Streamlined for speed, reliability, and full Supabase integration.
 * Displays images accurately and handles focused editing page navigation.
 */
export default function AdminProductManager() {
  const { toast } = useToast();
  const router = useRouter();
  const { addProduct, deleteProduct, products, loading: productsLoading } = useProducts();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State (Purely for creation)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockCount, setStockCount] = useState('50');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const unique = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
      setCategories(unique);
    }
  }, [products]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      
      toast({ title: 'Asset Ready', description: 'Image hosted in Supabase storage.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addProduct({
        name,
        price: parseFloat(price) || 0,
        category,
        description,
        longDescription: description,
        imageUrls: imageUrl ? [imageUrl] : [],
        stockCount: parseInt(stockCount) || 0,
        isFeatured: isFeatured,
      });

      toast({ title: 'Product Created', description: `"${name}" added to inventory.` });
      resetForm();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setImageUrl('');
    setStockCount('50');
    setIsFeatured(false);
  };

  const handleEditClick = (id: string) => {
    // Focused navigation as requested: Go to a page with that item's editable details
    router.push(`/admin/products/edit/${id}`);
  };

  const handleDeleteClick = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;
    
    try {
      await deleteProduct(id);
      toast({ title: 'Record Removed', description: 'Product deleted from inventory.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Deletion Error', description: err.message });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Inventory Master</h2>
          <p className="text-muted-foreground text-sm font-medium">Full Access to Supabase Database & Storage</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Supabase Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NEW ITEM FORM (Persistent Position) */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateProduct} className="sticky top-24 bg-card p-6 rounded-3xl border shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-headline text-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Catalogue Item
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Kentank 5000L" className="rounded-xl h-11" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price (KES)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stock</label>
                  <Input type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required className="rounded-xl h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category</label>
                <div className="relative">
                  <Input 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    required 
                    placeholder="Type or select..." 
                    className="rounded-xl h-11 pr-10"
                  />
                  {categories.length > 0 && (
                    <select 
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none text-[10px] uppercase font-bold opacity-40 focus:ring-0 outline-none w-1/3"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">History</option>
                      {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Media</label>
                <div className="relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 hover:border-primary transition-colors bg-muted/30 text-center min-h-[140px] flex flex-col items-center justify-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase">Pushing to Bucket...</span>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="h-32 w-full object-contain rounded-lg border bg-white" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground opacity-60">
                      <Upload className="h-8 w-8" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Capture & Upload Asset</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting || uploading} className="w-full rounded-full font-black h-14 shadow-lg transition-transform active:scale-95 bg-primary hover:bg-primary/90 text-white">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
              SAVE TO CATALOGUE
            </Button>
          </form>
        </div>

        {/* INVENTORY LIST (Right Side) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-3xl border shadow-xl overflow-hidden flex flex-col h-[800px]">
            <div className="p-6 border-b bg-muted/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold font-headline text-accent uppercase tracking-tighter">Current Inventory ({products.length})</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Realtime Table View</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search catalogue..." 
                  className="pl-10 rounded-full h-10 text-xs border-muted-foreground/20" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-20 bg-muted/90 backdrop-blur-sm border-b">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="p-4 w-[100px]">Media</th>
                    <th className="p-4">Product Details</th>
                    <th className="p-4 text-right">Price (KES)</th>
                    <th className="p-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {productsLoading ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                        <p className="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Database...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border bg-white shadow-sm flex items-center justify-center">
                          {/* SELF-HEALING MEDIA: Accurate image display in admin panel */}
                          <img 
                            src={p.imageUrls?.[0] || '/placeholder.jpg'} 
                            alt="" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-accent leading-tight line-clamp-1">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-primary">{p.category}</span>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                          <span className="text-[10px] font-bold text-muted-foreground">Stock: {p.stockCount || 0}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-mono font-bold text-primary text-sm">
                          {new Intl.NumberFormat('en-KE').format(p.price || 0)}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(p.id)} 
                            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all border border-blue-100 hover:scale-110 active:scale-95" 
                            title="Open Editing Mode"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(p.id, p.name)} 
                            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all border border-red-100 hover:scale-110 active:scale-95" 
                            title="Remove Record"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && !productsLoading && (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto opacity-20 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">No matching products found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
