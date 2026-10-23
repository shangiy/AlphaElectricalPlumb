'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, Edit, Package, Trash2, CheckCircle, RefreshCw, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductProvider';
import { useRouter } from 'next/navigation';

export default function AdminProductManager() {
  const { toast } = useToast();
  const router = useRouter();
  const { addProduct, deleteProduct, products, loading: productsLoading } = useProducts();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State (Purely for creation)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockCount, setStockCount] = useState('50');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await supabase.from('products').select('category');
      if (data) {
        const unique = Array.from(new Set(data.map(d => d.category))).map(c => ({ name: c }));
        setCategories(unique);
      }
    } catch (e) {
      // fallback
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Inventory Master</h2>
          <p className="text-muted-foreground text-sm font-medium">Full Access to Supabase Database & Storage</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Live Integration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateProduct} className="sticky top-24 bg-card p-6 rounded-3xl border shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-headline text-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Catalog Item
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Kentank 5000L" className="rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price (KES)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stock</label>
                  <Input type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} required placeholder="50" className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required 
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Electricals">Electricals</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Tanks">Tanks</option>
                  <option value="Roofing">Roofing</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border">
                <input 
                  type="checkbox" 
                  checked={isFeatured} 
                  onChange={(e) => setIsFeatured(e.target.checked)} 
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                  id="featured-check"
                />
                <label htmlFor="featured-check" className="text-xs font-black uppercase tracking-widest text-accent cursor-pointer">Featured on Home</label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Short Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full min-h-[80px] p-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Engineered specifications..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Media</label>
                <div className="relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 hover:border-primary transition-colors bg-muted/30 text-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase">Pushing to Bucket...</span>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-32 object-contain rounded-lg border bg-white" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                      <Upload className="h-6 w-6 opacity-50" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Click to Upload Asset</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting || uploading} className="w-full rounded-full font-bold h-12 shadow-lg transition-transform active:scale-95">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Synchronize Product
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
            <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
              <h3 className="text-lg font-bold font-headline text-accent uppercase tracking-tighter">Inventory List ({products.length})</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Realtime Postgres View</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="p-4 w-[80px]">Media</th>
                    <th className="p-4">Product Details</th>
                    <th className="p-4 text-right">Stock</th>
                    <th className="p-4 text-right">Price (KES)</th>
                    <th className="p-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {productsLoading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Catalog...</p>
                      </td>
                    </tr>
                  ) : products.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white shadow-sm">
                          <img src={p.imageUrls?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-accent leading-tight line-clamp-1">{p.name}</p>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">{p.category}</span>
                      </td>
                      <td className="p-4 text-right font-mono text-xs">
                        {p.stockCount || 0}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-primary">
                        {new Intl.NumberFormat('en-KE').format(p.price || 0)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(p.id)} 
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-200" 
                            title="Navigate to Editing Mode"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(p.id, p.name)} 
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200" 
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
