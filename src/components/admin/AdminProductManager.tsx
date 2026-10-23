'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, Edit, Package, Trash2, CheckCircle, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockCount, setStockCount] = useState('50');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Sync Error', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    } catch (e) {
      // fallback
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name,
      price: parseFloat(price) || 0,
      category,
      description,
      long_description: description,
      image_url: imageUrl,
      image: imageUrl,
      image_urls: [imageUrl],
      stock_count: parseInt(stockCount) || 0,
      is_featured: isFeatured,
      updated_at: new Date().toISOString()
    };

    try {
      let error;
      if (selectedProduct) {
        const res = await supabase.from('products').update(productData).eq('id', selectedProduct.id);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([productData]);
        error = res.error;
      }

      if (error) throw error;

      toast({ 
        title: selectedProduct ? 'Product Synchronized' : 'Product Created', 
        description: `"${name}" changes have been saved.` 
      });
      
      resetForm();
      fetchProducts();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Database Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Record Removed', description: 'Product deleted from inventory.' });
      if (selectedProduct?.id === id) resetForm();
      fetchProducts();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Deletion Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setSelectedProduct(p);
    setName(p.name || '');
    setPrice(p.price?.toString() || '');
    setCategory(p.category || '');
    setDescription(p.description || p.long_description || '');
    setImageUrl(p.image_url || p.image || (p.image_urls && p.image_urls[0]) || '');
    setStockCount(p.stock_count?.toString() || '50');
    setIsFeatured(!!p.is_featured);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: "Editing Active", description: `Now modifying "${p.name}".` });
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setImageUrl('');
    setStockCount('50');
    setIsFeatured(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Inventory Master</h2>
          <p className="text-muted-foreground text-sm font-medium">Full Bidirectional Access to Supabase Database & Storage</p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full" onClick={fetchProducts} disabled={loading}>
                <RefreshCw className={loading ? "animate-spin mr-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                Force Sync
            </Button>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Integration</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSaveProduct} className="sticky top-24 bg-card p-6 rounded-3xl border shadow-xl space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline text-primary flex items-center gap-2">
                {selectedProduct ? <Edit className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                {selectedProduct ? 'Update Item' : 'New Catalog Item'}
                </h3>
                {selectedProduct && (
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">ID: {selectedProduct.id.toString().slice(0, 8)}</span>
                )}
            </div>
            
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
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stock Count</label>
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
                  {categories.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="Electricals">Electricals</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Home & Decor">Home & Decor</option>
                  <option value="Tanks">Tanks</option>
                  <option value="Roofing & Construction">Roofing & Construction</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border cursor-pointer" onClick={() => setIsFeatured(!isFeatured)}>
                <input 
                  type="checkbox" 
                  checked={isFeatured} 
                  onChange={(e) => setIsFeatured(e.target.checked)} 
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-accent cursor-pointer block">Featured Product</label>
                  <p className="text-[11px] text-muted-foreground">Display this item in the webapp featured section.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Technical Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full min-h-[100px] p-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Engineered specifications..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Media</label>
                <div className="relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 hover:border-primary transition-colors bg-muted/30">
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
                    <div className="relative aspect-video rounded-lg overflow-hidden border bg-white shadow-inner">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                          <Upload className="text-white h-8 w-8" />
                          <span className="text-[10px] text-white font-bold uppercase mt-2">Replace Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                      <Upload className="h-8 w-8 opacity-50" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Click to Upload Asset</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || uploading} className="flex-1 rounded-full font-bold h-12 shadow-lg transition-transform active:scale-95">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {selectedProduct ? 'Update Product' : 'Synchronize Product'}
              </Button>
              {selectedProduct && (
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-full font-bold h-12">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
            <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
              <h3 className="text-lg font-bold font-headline text-accent uppercase tracking-tighter">Live Supabase Catalog ({products.length})</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Postgres Table View</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="p-4 w-[80px]">Media</th>
                    <th className="p-4">Product Details</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-right">Stock</th>
                    <th className="p-4 text-right">Price (KES)</th>
                    <th className="p-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading && products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Re-fetching Tables...</p>
                      </td>
                    </tr>
                  ) : products.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border bg-white shadow-sm">
                          <img src={p.image_url || p.image || (p.image_urls && p.image_urls[0]) || '/placeholder.jpg'} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-accent leading-tight line-clamp-1">{p.name}</p>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">{p.category}</span>
                      </td>
                      <td className="p-4 text-center">
                        {p.is_featured ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono text-xs">
                        {p.stock_count || p.stock || 0}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-primary">
                        {new Intl.NumberFormat('en-KE').format(p.price || 0)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(p)} 
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-200" 
                            title="Edit Record"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id, p.name)} 
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