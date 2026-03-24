
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product, Category } from '@/lib/types';
import ProductCard from './ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  categories: Category[];
}

export default function ProductList({ products, categories }: ProductListProps) {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState('all');
  
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 15000), [products]);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [sortOption, setSortOption] = useState('relevance');

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        p.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        p.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortOption) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default: // 'relevance'
        return filtered;
    }
  }, [products, searchTerm, category, priceRange, sortOption]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', currencyDisplay: 'code', minimumFractionDigits: 0 }).format(price);
  };
  
  return (
    <div>
        <div className="mb-8">
            {searchTerm ? (
                <h1 className="text-3xl font-bold font-headline">Results for "{searchTerm}"</h1>
            ) : (
                <h1 className="text-3xl font-bold font-headline">All Products</h1>
            )}
            <p className="text-muted-foreground mt-1">{filteredAndSortedProducts.length} products found</p>
        </div>
        <div className="flex gap-8 items-start">
          <aside className="hidden w-64 flex-col gap-6 lg:flex sticky top-28">
            <h3 className="text-lg font-headline font-semibold">Filters</h3>
            
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
               <label htmlFor="price" className="mb-2 block text-sm font-medium">Price Range</label>
               <div className="flex justify-between text-sm text-muted-foreground">
                   <span>{formatPrice(priceRange[0])}</span>
                   <span>{formatPrice(priceRange[1])}</span>
               </div>
              <Slider
                id="price"
                min={0}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="mt-2"
              />
            </div>

            <Button onClick={() => {
                setCategory('all');
                setPriceRange([0, maxPrice]);
                setSortOption('relevance');
            }}>Clear Filters</Button>

          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort-by" className="text-sm font-medium shrink-0">Sort by</label>
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger id="sort-by" className="w-full md:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="rating-desc">Top Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                <h3 className="text-2xl font-headline font-semibold">No Products Found</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
