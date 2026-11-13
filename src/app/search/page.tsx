
'use client';

import { useProducts } from '@/context/ProductProvider';
import { getCategories } from '@/lib/data';
import ProductList from '@/components/products/ProductList';
import { Suspense, useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category, Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const COLORS = [
  "Black", "White", "Chrome", "Gold", "Silver", "Gray", "Red", "Blue"
];

function SearchPageContent() {
  const { products, loading: productsLoading } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recommend');

  const query = searchParams.get('q') || '';

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedColors([]);
    setSortBy('recommend');
  };

  // Advanced Filtering Logic
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter(p => {
      // Search Query
      const matchesSearch = !query || 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase());
      
      // Price Filter
      const price = p.price || 0;
      const matchesMin = !minPrice || price >= parseFloat(minPrice);
      const matchesMax = !maxPrice || price <= parseFloat(maxPrice);
      
      // Color Filter (Assuming 'colors' or looking into description for now)
      const matchesColor = selectedColors.length === 0 || 
        selectedColors.some(c => 
          p.name.toLowerCase().includes(c.toLowerCase()) || 
          p.description.toLowerCase().includes(c.toLowerCase())
        );

      return matchesSearch && matchesMin && matchesMax && matchesColor;
    });

    // Sorting
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result.sort((a, b) => (b.id > a.id ? 1 : -1)); // Proxy for newest

    return result;
  }, [products, query, minPrice, maxPrice, selectedColors, sortBy]);

  if (productsLoading) return <ProductListSkeleton />;

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* SIDEBAR FILTERS */}
      <aside className="w-full lg:w-72 shrink-0 space-y-10">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
            <SlidersHorizontal size={16} /> Filters
          </h3>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-[10px] font-black uppercase text-primary hover:bg-transparent">
            Clear All
          </Button>
        </div>

        {/* Price Filter */}
        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Shop by Price</Label>
          <div className="flex items-center gap-3">
            <Input 
              placeholder="Min" 
              type="number" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 rounded-xl bg-muted/20 border-none text-xs font-bold"
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              placeholder="Max" 
              type="number" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 rounded-xl bg-muted/20 border-none text-xs font-bold"
            />
          </div>
        </div>

        {/* Color Filter */}
        <div className="space-y-4">
          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Shop by Color</Label>
          <div className="grid grid-cols-1 gap-3">
            {COLORS.map((color) => (
              <div key={color} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleColorToggle(color)}>
                <Checkbox 
                  checked={selectedColors.includes(color)} 
                  onCheckedChange={() => handleColorToggle(color)}
                  className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary"
                />
                <span className="text-xs font-bold text-accent group-hover:text-primary transition-colors">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Banner */}
        <div className="p-6 rounded-[2rem] bg-accent text-white space-y-3 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/20 rounded-full blur-2xl" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Alpha Pro</p>
          <p className="text-sm font-bold leading-tight">Need expert technical advice?</p>
          <Button asChild size="sm" className="w-full bg-white text-accent hover:bg-white/90 rounded-full font-black uppercase text-[10px]">
            <a href="https://wa.me/254117484887" target="_blank">Chat on WhatsApp</a>
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-accent uppercase tracking-tighter">
              {filteredAndSortedProducts.length} Results
              {query && <span className="text-muted-foreground normal-case font-medium ml-1">for "{query}"</span>}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-9 border-none bg-muted/30 rounded-full text-[11px] font-bold">
                  <SelectValue placeholder="Recommend" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="recommend">Recommend</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProductListCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center space-y-4 bg-muted/10 rounded-[3rem] border-2 border-dashed">
              <X size={48} className="mx-auto text-muted-foreground/20" />
              <h3 className="text-2xl font-black text-accent uppercase tracking-tighter">No items match</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">Try adjusting your price range or colors to find what you're looking for.</p>
              <Button variant="outline" onClick={clearFilters} className="rounded-full font-bold">Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Optimized Card for Search List
function ProductListCard({ product }: { product: Product }) {
  const formatPrice = (p: number) => `KES ${p.toLocaleString()}`;
  const productLink = `/products/${product.slug || product.id}`;
  
  return (
    <div className="group bg-white rounded-[2rem] border overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
      <Link href={productLink} className="block relative aspect-square bg-muted/10">
        <img 
          src={product.imageUrls?.[0] || '/placeholder.jpg'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
           {product.isFeatured && (
             <Badge className="bg-primary text-white border-none font-black uppercase text-[8px] tracking-widest px-3 py-1">Flash Sale</Badge>
           )}
        </div>
      </Link>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <Link href={productLink}>
            <h3 className="font-black text-accent uppercase tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{product.category}</p>
        </div>
        
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-black text-accent">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-50">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-full font-black uppercase text-[10px] tracking-widest border-2">
            <Link href={productLink}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function SearchPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={<ProductListSkeleton />}>
          <SearchPageContent />
        </Suspense>
      </div>
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="w-72 hidden lg:block space-y-10">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
      <div className="flex-1 space-y-8">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
