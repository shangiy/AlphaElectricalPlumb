'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductProvider';
import { Rating } from '@/components/ui/rating';
import ProductRecommendations from '@/components/products/ProductRecommendations';
import BuyNowButton from '@/components/products/ContactSellerForm';
import { ShieldCheck, Truck, Wrench, MessageCircle, Share2, Info } from 'lucide-react';
import AddToCartButton from '@/components/products/AddToCartButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useMemo } from 'react';
import QuantitySelector from '@/components/products/QuantitySelector';
import { cn } from '@/lib/utils';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewCarousel from '@/components/reviews/ReviewCarousel';
import WishlistButton from '@/components/products/WishlistButton';
import { Badge } from '@/components/ui/badge';

/**
 * 2027 Premium Product Layout:
 * Features high-contrast modular sections, integrated wishlist overlay,
 * and holographic action cards.
 */
function ProductContent({ productId }: { productId: string }) {
  const { getProductById, loading } = useProducts();
  const router = useRouter();
  
  const product = getProductById(productId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [reviewsKey, setReviewsKey] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    setFailedUrls(new Set());
  }, [productId]);

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
                <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">Product Lost in Space</h1>
                <p className="text-muted-foreground mt-4 text-lg">The item you are looking for has been removed from our current inventory cycle.</p>
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

  const handleReviewSubmitted = () => {
    setReviewsKey(prev => prev + 1);
  };

  const technicalLabel = "text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground/60";

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Visual Showcase: 5 Columns */}
          <div className="lg:col-span-7 space-y-6">
             <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-[3rem] bg-secondary/10 border border-white/20 shadow-2xl group">
                <img
                    key={activeImageIndex}
                    src={uniqueImages[activeImageIndex] || '/placeholder.jpg'}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                    onError={() => handleImageError(uniqueImages[activeImageIndex])}
                />
                
                {/* Wishlist Overlay */}
                <div className="absolute top-6 right-6">
                    <WishlistButton 
                        productId={product.id} 
                        className="h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 transition-all duration-500 shadow-2xl" 
                    />
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center px-4 py-3 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Image {activeImageIndex + 1} of {uniqueImages.length}</p>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white"><Share2 size={16}/></Button>
                    </div>
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
                            <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Action Interface: 5 Columns */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">SKU: {product.barcode || 'ALPHA-PR'}</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black font-headline leading-[0.9] text-accent tracking-tighter">{product.name}</h1>
                <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-3xl w-fit">
                    <Rating rating={product.rating} size={18} />
                    <span className="text-xs font-black uppercase tracking-tighter text-accent">{product.reviews} VERIFIED REVIEWS</span>
                </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-accent text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-primary/40" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Investment Price</p>
                <div className="flex items-baseline gap-4">
                    <p className="text-5xl font-black font-headline tracking-tighter">
                        {formatPrice(product.price)}
                    </p>
                    {product.unit && product.unit !== 'item' && (
                        <span className="text-xl font-bold opacity-40">/ {product.unit}</span>
                    )}
                </div>
                {product.oldPrice && product.oldPrice > product.price && (
                    <p className="text-lg font-bold opacity-30 line-through mt-2">{formatPrice(product.oldPrice)}</p>
                )}
            </div>

            <div className="space-y-6">
                <div className="p-8 rounded-[3rem] bg-secondary/5 border border-dashed border-muted-foreground/20">
                     <p className="text-lg leading-relaxed text-muted-foreground font-medium">{product.longDescription}</p>
                </div>
                
                <div className="p-6 rounded-[2.5rem] bg-muted/20 border border-white/50 shadow-sm">
                    <QuantitySelector unit={product.unit || 'item'} onQuantityChange={setQuantity} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white border shadow-xl hover:shadow-2xl transition-all group">
                        <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center transition-colors group-hover:bg-green-500/20">
                            <Truck className="h-6 w-6 text-green-600"/>
                        </div>
                        <div>
                            <p className={technicalLabel}>Shipment</p>
                            <p className="font-black text-sm uppercase tracking-tighter">Priority Delivery</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white border shadow-xl hover:shadow-2xl transition-all group">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center transition-colors group-hover:bg-blue-500/20">
                            <Wrench className="h-6 w-6 text-blue-600"/>
                        </div>
                        <div>
                            <p className={technicalLabel}>Support</p>
                            <p className="font-black text-sm uppercase tracking-tighter">Expert Setup</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row h-20">
                    <AddToCartButton product={product} quantity={quantity}/>
                    <BuyNowButton product={product} quantity={quantity} />
                </div>
                <Button 
                    variant="outline" 
                    size="xl" 
                    className="w-full border-green-500/50 text-green-600 hover:bg-green-600 hover:text-white rounded-[2rem] h-20 border-2"
                    onClick={handleWhatsAppInquiry}
                >
                    <MessageCircle className="mr-3 h-8 w-8" /> 
                    <span className="font-black tracking-tight">Direct WhatsApp Inquiry</span>
                </Button>
            </div>
            
            <div className="flex items-center gap-4 p-8 rounded-[2.5rem] bg-primary text-white shadow-xl relative overflow-hidden">
                <ShieldCheck className="h-10 w-10 text-white shrink-0 z-10"/>
                <div className="z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Alpha Verified</p>
                    <p className="text-sm font-bold tracking-tight">12 Month Genuine Warranty & Support Included</p>
                </div>
                <Info className="absolute -right-4 -bottom-4 h-24 w-24 text-white opacity-10 rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Review Interaction Block */}
      <div className="bg-secondary/5 py-32 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                <div className="lg:col-span-4">
                    <div className="sticky top-32">
                        <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
                    </div>
                </div>
                <div className="lg:col-span-8 space-y-12">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-5xl font-black font-headline text-accent tracking-tighter">Owner Experiences</h2>
                            <p className="text-muted-foreground text-lg mt-2">Unfiltered feedback from our community of professionals.</p>
                        </div>
                        <Badge variant="outline" className="px-6 py-2 rounded-full font-black uppercase tracking-widest border-accent/20">
                            {product.reviews} Entries
                        </Badge>
                    </div>
                    <ReviewCarousel key={reviewsKey} productId={product.id} />
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
  const id = params.id as string;

  if (!id) {
    return notFound();
  }
  
  return <ProductContent productId={id} />;
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
