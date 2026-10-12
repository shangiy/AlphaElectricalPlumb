
'use client';

import { useProducts } from '@/context/ProductProvider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartProvider';

/**
 * ProductList Component
 * Displays the full product catalog fetched from Supabase.
 * Uses the ProductProvider context for efficient data management and real-time updates.
 */
export default function ProductList() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading Alpha Catalog...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-secondary/20 border-primary/20">
        <Package className="mx-auto h-16 w-16 text-muted-foreground opacity-30" />
        <h3 className="mt-4 text-2xl font-bold text-accent font-headline">No Products Found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Our digital catalog is currently being updated. Please check back shortly for our full inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold font-headline text-accent">Full Product Catalog</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-lg">
          Explore our complete range of high-performance electrical and plumbing solutions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <Card key={product.id} className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white group border-none shadow-md hover:-translate-y-1">
            <CardHeader className="p-0 relative aspect-square overflow-hidden bg-secondary/10">
              <img
                src={product.imageUrls?.[0] || "https://placehold.co/600x600?text=No+Image"}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=Image+Not+Found";
                }}
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black tracking-widest uppercase text-primary shadow-sm">
                  {product.category}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow p-6">
              <Link href={`/products/${product.id}`} className="block group/title">
                <CardTitle className="mb-2 text-lg font-bold leading-tight text-accent group-hover/title:text-primary transition-colors line-clamp-2 min-h-[3rem] font-headline">
                  {product.name}
                </CardTitle>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </CardContent>
            
            <CardFooter className="flex-col items-start gap-4 p-6 pt-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-primary">
                  {product.price > 0 ? `KES ${Number(product.price).toLocaleString()}` : 'Contact for Price'}
                </p>
              </div>
                
              <div className="flex w-full gap-3">
                <Button variant="outline" className="flex-1 rounded-full border-primary/20 hover:bg-primary/5 font-bold transition-all" asChild>
                  <Link href={`/products/${product.id}`}>DETAILS</Link>
                </Button>
                <Button className="flex-1 rounded-full font-bold shadow-lg hover:shadow-primary/20 transition-all" onClick={() => addToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> ADD
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
