'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/context/ProductProvider';
import { Rating } from '@/components/ui/rating';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import BuyNowButton from '@/components/products/ContactSellerForm';
import { Truck, Wrench, MessageCircle, Star, Loader2, Package } from 'lucide-react';
import AddToCartButton from '@/components/products/AddToCartButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import QuantitySelector from '@/components/products/QuantitySelector';
import { cn } from '@/lib/utils';
import WishlistButton from '@/components/products/WishlistButton';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReviewForm from '@/components/reviews/ReviewForm';

/**
 * Unified Product Engine v6.3.1:
 * Resolves Next.js routing conflicts by consolidating all product logic here.
 * Features: Dual-lookup (Slug/ID), Intelligent Redirection, and SEO normalization.
 */
function ProductContent({ identifier }: { identifier: string }) {
  const { products, loading, refreshProducts } = useProducts();
  const router = useRouter();
  
  // 1. Unified Search: Find by Slug OR ID
  const product = useMemo(() => {
    return products.find(p => p.slug === identifier || p.id === identifier);
  }, [products, identifier]);

  // 2. SEO Redirection Engine: 
  // If we found a product using a legacy UUID but it has a professional Slug, 
  // we redirect to the Slug URL to normalize the link for search engines.
  useEffect(() => {
    if (product && product.slug && product.id === identifier) {
      console.log(`[SEO Sync] Redirecting legacy ID ${identifier} to slug ${product.slug}`);
      router.replace(`/products/${product.slug}`);
    }
  }, [product, identifier, router]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    setActiveImageIndex(0);
    setFailedUrls(new Set());
  }, [identifier]);

  const uniqueImages = useMemo(() => {
    if (!product) return [];
    const seen = new Set<string>();
    return (product.imageUrls || []).filter((url) => {
      const lower = url.toLowerCase();
      if (seen.has(lower) || failedUrls.has(url)) return false;
      seen.add(lower);
      return true;
    });
  }, [product, failedUrls]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    if (!loading) {
        return (
             <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">Product Not Found</h1>
                <p className="text-muted-foreground mt-4 text-lg">The item reference "{identifier}" does not exist in our current inventory.</p>
                <Button onClick={() => router.push('/')} size="lg" className="mt-8 rounded-full px-12">Return Home</Button>
            </div>
        );
    }
    return null;
  }
  
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact for Price';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
    }).format(price);
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = '254117484887';
    const message = `Alpha Inquiry: ${product.name} (Ref: ${product.id}). Price: ${formatPrice(product.price)}. Is this ready for delivery?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleImageError = (url: string) => {
    setFailedUrls(prev => {
        const next = new Set(prev);
        next.add(url);
        return next;
    });
  };

  const handleReviewSuccess = () => {
    refreshProducts();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          <div className="lg:col-span-7 space-y-6">
             <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[3rem] bg-secondary/10 border border-white/20 shadow-2xl group">
                {uniqueImages.length > 0 && (
                  <Image
                    key={product.id + activeImageIndex}
                    src={uniqueImages[activeImageIndex] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    onError={() => handleImageError(uniqueImages[activeImageIndex])}
                    priority={activeImageIndex === 0}
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                )}
                
                <div className="absolute top-6 right-6">
                    <WishlistButton 
                        productId={product.id} 
                        className="h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 transition-all duration-500 shadow-2xl" 
                    />
                </div>
            </div>
            
            {uniqueImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {uniqueImages.map((img, index) => (
                        <button 
                            key={`${img}-${index}`} 
                            onClick={() => setActiveImageIndex(index)}
                            className={cn(
                                "relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-2 transition-all duration-500 snap-center",
                                activeImageIndex === index ? "border-primary shadow-2xl scale-105 ring-4 ring-primary/10" : "border-transparent opacity-40 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" sizes="96px" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">SKU: {product.barcode || 'ALPHA-PR'}</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black font-headline leading-[0.9] text-accent tracking-tighter">{product.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-3xl w-fit">
                        <Rating rating={product.rating} size={18} />
                        <span className="text-xs font-black uppercase tracking-tighter text-accent">{product.reviews} VERIFIED REVIEWS</span>
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="lg" className="rounded-3xl h-14 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                                <Star className="mr-2 h-4 w-4" /> Rate This Item
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0 rounded-3xl border-none shadow-2xl" side="bottom" align="end">
                            <ReviewForm productId={product.id} productTitle={product.name} onReviewSubmitted={handleReviewSuccess} />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-accent text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-primary/40" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Investment Price</p>
                <div className="flex items-baseline gap-4">
                    <p className="text-5xl font-black font-headline tracking-tighter">{formatPrice(product.price)}</p>
                    {product.unit && product.unit !== 'item' && <span className="text-xl font-bold opacity-40">/ {product.unit}</span>}
                </div>
                {product.oldPrice && product.oldPrice > product.price && (
                  <p className="text-sm font-bold text-white/40 line-through mt-1">Was {formatPrice(product.oldPrice)}</p>
                )}
            </div>

            <div className="space-y-6">
                <div className="p-8 rounded-[3rem] bg-secondary/5 border border-dashed border-muted-foreground/20">
                     <p className="text-lg leading-relaxed text-muted-foreground font-medium">{product.longDescription || product.description}</p>
                </div>
                <div className="p-6 rounded-[2.5rem] bg-muted/20 border border-white/50 shadow-sm">
                    <QuantitySelector unit={product.unit || 'item'} onQuantityChange={setQuantity} />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-6 sm:flex-row min-h-20 items-stretch">
                    <div className="flex-1 relative group rounded-full p-[3.5px] overflow-hidden bg-muted/20 shadow-2xl transition-all hover:scale-[1.02] flex">
                        <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,#00f2ea,#1877f2,#7000ff,#00f2ea)] animate-ai-spin opacity-60 animate-rhythmic-dim" />
                        <div className="absolute inset-[2.5px] rounded-full bg-white z-0" />
                        <div className="relative z-10 flex-1 flex w-full">
                            <AddToCartButton product={product} quantity={quantity}/>
                        </div>
                    </div>

                    <div className="flex-1 relative group rounded-full p-[3.5px] overflow-hidden bg-muted/20 shadow-2xl transition-all hover:scale-[1.02] flex">
                        <div className="absolute top-1/2 left-1/2 w-[300%] h-[300%] bg-[conic-gradient(from_0deg,#ff0000,#ff8c00,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00c8,#ff0000)] animate-ai-spin opacity-60 animate-rhythmic-dim" />
                        <div className="absolute inset-[2.5px] rounded-full bg-white z-0" />
                        <div className="relative z-10 flex-1 flex w-full">
                            <BuyNowButton product={product} quantity={quantity} />
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="xl" className="w-full border-green-500/50 text-green-600 hover:bg-green-600 hover:text-white rounded-full border-2" onClick={handleWhatsAppInquiry}>
                    <MessageCircle className="mr-3 h-8 w-8" /> 
                    <span className="font-black tracking-tight">Direct WhatsApp Inquiry</span>
                </Button>
            </div>
            
          </div>
        </div>
      </div>

      <div className="bg-white py-32 border-t">
        <div className="container mx-auto px-4">
          <ProductRecommendations productTitle={product.name} productId={product.id} category={product.category} />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const identifier = (params.slug || params.id) as string;

  if (!identifier) {
    return notFound();
  }
  
  return <ProductContent identifier={identifier} />;
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-[3rem]" />
          <div className="space-y-10">
            <Skeleton className="h-20 w-3/4 rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-[3rem]" />
            <Skeleton className="h-64 w-full rounded-[3rem]" />
          </div>
        </div>
    </div>
  );
}
