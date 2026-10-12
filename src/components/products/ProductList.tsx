'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package } from 'lucide-react';
import Link from 'next/link';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading catalog...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-background/50 border-primary/20">
        <Package className="mx-auto h-16 w-16 text-muted-foreground opacity-30" />
        <h3 className="mt-4 text-2xl font-bold text-muted-foreground">No Products Found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">We are currently updating our inventory. Please check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold font-headline text-[#28235f]">Our Full Catalog</h2>
        <p className="text-muted-foreground mt-2">Quality electrical and plumbing equipment for every project.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => {
          // Image Path Resolution Logic
          const rawPath = product.image_path?.trim() ?? '';
          const cleanPath = rawPath.replace(/^Saved Pictures\//, '');
          
          let imageUrl = '/placeholder.jpg';
          if (cleanPath && supabase) {
            imageUrl = supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl;
          } else if (product.imageUrls && product.imageUrls[0]) {
            imageUrl = product.imageUrls[0];
          }

          return (
            <Card key={product.id} className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl bg-white group border-none shadow-sm">
              <CardHeader className="p-0 relative">
                <div className="relative aspect-square overflow-hidden bg-secondary/10">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Image+Not+Found";
                    }}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow p-5">
                <div className="mb-2">
                    <span className="text-[10px] font-black tracking-widest uppercase text-primary/60">{product.category}</span>
                </div>
                <Link href={`/products/${product.id}`} className="block">
                  <CardTitle className="mb-2 text-base font-bold leading-tight hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] font-headline">
                    {product.name}
                  </CardTitle>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
              </CardContent>
              
               <CardFooter className="flex-col items-start gap-4 p-5 pt-0">
                 <div className="flex items-baseline gap-2">
                    <p className="text-xl font-black text-primary">
                      KES {Number(product.price).toLocaleString()}
                    </p>
                 </div>
                  
                <div className="flex w-full gap-2">
                    <Button size="sm" variant="outline" className="flex-1 rounded-full border-primary/20 hover:bg-primary/5 font-semibold" asChild>
                        <Link href={`/products/${product.id}`}>Details</Link>
                    </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}