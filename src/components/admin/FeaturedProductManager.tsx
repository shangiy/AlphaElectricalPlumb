'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '@/context/ProductProvider';
import { useToast } from '@/hooks/use-toast';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical, Trash2, Save, Loader2, ArrowLeft, Package, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

/**
 * Sortable Featured Item Component
 */
function SortableFeaturedItem({ product, onRemove }: { product: Product, onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "bg-white rounded-2xl border p-4 mb-3 shadow-sm hover:shadow-md transition-shadow group flex items-center gap-4",
        isDragging && "opacity-50 ring-2 ring-primary border-transparent"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded-lg transition-colors">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="h-16 w-16 rounded-xl overflow-hidden border bg-muted shrink-0">
        <img src={product.imageUrls?.[0]} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-accent truncate">{product.name}</p>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</p>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl"
        onClick={() => onRemove(product.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Featured Product Manager v1.0
 * Intelligent Arrangement for Alpha Spotlight.
 */
export default function FeaturedProductManager() {
  const { products, toggleFeatured, updateFeaturedOrder, loading, submitting } = useProducts();
  const { toast } = useToast();
  const router = useRouter();

  // Local state for reordering
  const [featuredList, setFeaturedList] = useState<Product[]>([]);

  useEffect(() => {
    // Filter and sort by existing featured_order
    const currentFeatured = products
      .filter(p => p.isFeatured)
      .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
    
    setFeaturedList(currentFeatured);
  }, [products]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFeaturedList((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await toggleFeatured(id, true); // true passes currentStatus, toggleFeatured inverts it
      toast({ description: "Product removed from spotlight." });
    } catch (err) {
      toast({ variant: "destructive", description: "Failed to remove item." });
    }
  };

  const handleSaveOrder = async () => {
    try {
      const updates = featuredList.map((p, index) => ({
        id: p.id,
        featured_order: index + 1
      }));

      await updateFeaturedOrder(updates);
      toast({ title: "Spotlight Synchronized", description: "Homepage arrangement updated successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed", description: "Could not save the new arrangement." });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold tracking-tighter uppercase text-muted-foreground">Mapping Digital Inventory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full h-8 px-2 -ml-2">
                    <ArrowLeft size={16} />
                </Button>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full">Spotlight Control</span>
            </div>
            <h1 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase">Featured Catalog</h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">Drag and drop cards to define the homepage hierarchy.</p>
          </div>
          
          <Button 
            onClick={handleSaveOrder} 
            disabled={submitting || featuredList.length === 0}
            className="rounded-full h-14 px-10 font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 bg-accent text-white"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
            Sync Arrangement
          </Button>
       </div>

       {featuredList.length > 0 ? (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={featuredList.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {featuredList.map((product) => (
                  <SortableFeaturedItem 
                    key={product.id} 
                    product={product} 
                    onRemove={handleRemove} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
       ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/5 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black text-accent uppercase tracking-tighter">Spotlight is Dark</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                No items are currently selected as featured. Toggle "Featured" on products in the main inventory table to add them here.
              </p>
              <Button asChild variant="outline" className="mt-8 rounded-full">
                  <Link href="/admin/products">Go to Inventory Table</Link>
              </Button>
          </div>
       )}

       <div className="mt-12 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-start gap-4">
          <Package className="h-6 w-6 text-primary shrink-0" />
          <div className="text-sm">
              <p className="font-bold text-primary uppercase tracking-tight">Pro Tip: 2027 Logic</p>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                The order you define here persists globally. Items at the top will be displayed first in the homepage carousel. We recommend keeping between 5 and 15 items featured for optimal performance.
              </p>
          </div>
       </div>
    </div>
  );
}
