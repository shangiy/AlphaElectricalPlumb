
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Upload, Edit, Package, Trash2, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductProvider';

/**
 * Unified Admin Product Manager v2.4.1
 * Fully integrated with Supabase Storage and Postgres.
 * Features: Bidirectional sync, defensive schema mapping, and real-time feedback.
 */
export default function AdminProductManager() {
  const { toast } = useToast();
  const { products, loading: contextLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  
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
  const [unit, setUnit] = useState('item');

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
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      
      toast({ 
        title: 'Asset Synchronized', 
        description: 'Image is now hosted in Supabase Storage and ready to be linked to inventory.' 
      });
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Upload Failed', 
        description: error.message || 'Ensure "product-images" bucket exists and is public.'
      });
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
      description: description,
      longDescription: description,
      imageUrls: imageUrl ? [imageUrl] : [],
      stockCount: parseInt(stockCount) || 0,
      unit: unit,
      isFeatured: selectedProduct?.isFeatured || false,
    };

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
        toast({ title: 'Product Updated', description: `"${name}" changes have been pushed to Supabase.` });
      } else {
        await addProduct(productData);
        toast({ title: 'Product Created', description: `"${name}" has been added to the live catalog.` });
      }
      
      resetForm();
    } catch (err: any) {
      console.error("Save error:", err);
      toast({ 
        variant: 'destructive', 
        title: 'Database Error', 
        description: err.message || 'Check if the "category" column exists in your products table.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setSelectedProduct(p);
    setName(p.name || '');
    setPrice(p.price?.toString() || '');
    setCategory(p.category || '');
    setDescription(p.longDescription || p.description || '');
    setImageUrl(p.imageUrls?.[0] || p.image_url || '');
    setStockCount(p.stockCount?.toString() || '50');
    setUnit(p.unit || 'item');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    toast({
        title: "Editing Mode Active",
        description: `Now modifying "${p.name}".`,
    });
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setImageUrl('');
    setStockCount('50');
    setUnit('item');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Inventory Master</h2>
          <p className="text-muted-foreground text-sm font-medium">Real-time Bidirectional Sync with Supabase Postgres & Storage</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 shadow-sm">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Integration</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Management Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSaveProduct} className="sticky top-24 bg-card p-6 rounded-3xl border shadow-xl space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline text-primary flex items-center gap-2">
                {selectedProduct ? <Edit className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                {selectedProduct ? 'Edit Details' : 'New Catalog Item'}
                </h3>
                {selectedProduct && (
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded shadow-sm">ID: {selectedProduct.id.toString().slice(0, 8)}</span>
                )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Alpha Kentank 5000L" className="rounded-xl border-muted-foreground/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price (KES)</label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="rounded-xl border-muted-foreground/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Unit</label>
                  <select 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)} 
                    className="w-full h-10 px-3 rounded-xl border border-muted-foreground/20 bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="item">item</option>
                    <option value="meter">meter</option>
                    <option value="roll">roll</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Category</label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g., Tanks" className="rounded-xl border-muted-foreground/20" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Technical Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full min-h-[120px] p-3 rounded-xl border border-muted-foreground/20 bg-background text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Describe dimensions, material, and capacity..."
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
                      <span className="text-[10px] font-bold text-primary uppercase">Pushing to Supabase...</span>
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
                {selectedProduct ? 'Update Product' : 'Sync New Product'}
              </Button>
              {selectedProduct && (
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-full font-bold h-12">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Live Catalog Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
            <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-headline text-accent uppercase tracking-tighter">Live Inventory Catalog ({products.length})</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Postgres Products Table</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => window.location.reload()} title="Refresh Cache">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="p-4 w-[80px]">Preview</th>
                    <th className="p-4">Specifications</th>
                    <th className="p-4 text-right">Stock</th>
                    <th className="p-4 text-right">Price (KES)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {contextLoading && products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Querying Tables...</p>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Records Found</p>
                      </td>
                    </tr>
                  ) : products.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border bg-white shadow-sm">
                          <img src={p.imageUrls?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm text-accent leading-tight line-clamp-1">{p.name}</p>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">{p.category}</span>
                      </td>
                      <td className="p-4 text-right font-mono text-xs">
                        {p.stockCount || 0} <span className="text-[10px] opacity-50">{p.unit}s</span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-primary">
                        {new Intl.NumberFormat('en-KE').format(p.price || 0)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(p)} 
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-transparent hover:border-blue-200" 
                            title="Edit Database Record"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                                if(confirm(`Permanently delete "${p.name}"?`)) {
                                    deleteProduct(p.id).then(() => toast({ title: 'Record Purged', description: 'Item removed from database.' }));
                                }
                            }} 
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all border border-transparent hover:border-red-200" 
                            title="Delete Database Record"
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
