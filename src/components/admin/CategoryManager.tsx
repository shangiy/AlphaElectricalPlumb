'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { saveCategoryCards, getStorefrontSetting, updateStorefrontSetting } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical, Trash2, Plus, Save, Loader2, RefreshCw, Info, Image as ImageIcon, LayoutGrid, Activity, Eye, Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/storage';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export interface CategoryCardData {
    id: string;
    title: string;
    image: string;
    link: string;
    order: number;
}

const INVENTORY_CATEGORIES = [
    'Decorative Lighting and chandeliers',
    'Electrical items',
    'Plumbing',
    'Sanitary Ware Toilets & Bathroom Fixtures',
    'Shower Category',
    'Solar panels & accessories',
    'Tanks category',
    'Mabati and Roofing',
    'Construction and Fencing equip\'nts',
    'Collections',
    'Hardware & General Supplies'
];

/**
 * Robust Path Resolver for Admin Preview:
 */
function getPreviewImageUrl(rawPath: string): string {
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('/')) {
    return rawPath;
  }
  if (!supabase) return '';

  let cleanPath = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Normalize folder to lowercase 'collections'
  if (cleanPath.toLowerCase().startsWith('collections/')) {
      cleanPath = 'collections/' + cleanPath.substring(12);
  }
  
  if (cleanPath.startsWith('product-images/')) cleanPath = cleanPath.substring(15);

  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  const { data } = supabase.storage.from('product-images').getPublicUrl(encodedPath);
  return data?.publicUrl || '';
}

function SortableCategoryItem({ card, onUpdate, onDelete }: { 
    card: CategoryCardData; 
    onUpdate: (updated: CategoryCardData) => void; 
    onDelete: (id: string) => void; 
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
    const style = { transform: CSS.Translate.toString(transform), transition };
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Uploading to the specific 'category-carousel' bucket as requested
            const publicUrl = await uploadFile(file, 'category-carousel', 'cards');
            onUpdate({ ...card, image: publicUrl });
            toast({ title: "Asset Synchronized", description: "Image uploaded and linked to card." });
        } catch (error: any) {
            toast({ 
                variant: "destructive", 
                title: "Upload Failed", 
                description: error.message || "Ensure the 'category-carousel' bucket exists." 
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm mb-3 group hover:border-primary transition-colors">
            <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-primary p-2">
                <GripVertical className="w-5 h-5" />
            </button>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Card Title</label>
                    <Input 
                        value={card.title} 
                        onChange={(e) => onUpdate({ ...card, title: e.target.value })} 
                        placeholder="e.g. Plumbing Fixtures"
                        className="h-10 rounded-lg"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Image URL (Storage Path)</label>
                    <Input 
                        value={card.image} 
                        onChange={(e) => onUpdate({ ...card, image: e.target.value })} 
                        placeholder="e.g. collections/Hand-wash Basin...webp"
                        className="h-10 rounded-lg"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Media Provisioning</label>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group/upload relative overflow-hidden"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        {uploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                <span className="text-[9px] font-black uppercase text-primary">Syncing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 opacity-40 group-hover/upload:opacity-100">
                                <Upload size={14} className="text-accent" />
                                <span className="text-[9px] font-black uppercase text-accent">Upload Image</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Route Link</label>
                    <Input 
                        value={card.link} 
                        onChange={(e) => onUpdate({ ...card, link: e.target.value })} 
                        placeholder="e.g. /category/plumbing"
                        className="h-10 rounded-lg"
                    />
                </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 rounded-lg" onClick={() => onDelete(card.id)}>
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}

export default function CategoryManager({ initialCards }: { initialCards: CategoryCardData[] }) {
    const [cards, setCards] = useState<CategoryCardData[]>([]);
    const [scrollSpeed, setScrollSpeed] = useState('40');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const discoverExistingCategories = useCallback(async () => {
        return [
            { id: 'fixtures', title: 'Plumbing Fixtures', image: 'collections/Hand-wash Basin and Pedestal Sink Collection.webp', link: '/category/plumbing', order: 1 },
            { id: 'bulbs', title: 'Lighting & Bulbs', image: 'collections/Bird Art Lights fixture Collection.webp', link: '/category/lighting', order: 2 },
            { id: 'supplies', title: 'Electrical Supplies', image: 'collections/Electric Socket Collection.webp', link: '/category/electrical', order: 3 },
            { id: 'tanks', title: 'Water Tanks', image: 'collections/Tanks variety collection.webp', link: '/category/tanks', order: 4 },
            { id: 'roofing', title: 'Roofing & Construction', image: 'collections/Corrugated Roofing Sheet collection.webp', link: '/category/roofing', order: 5 }
        ];
    }, []);

    useEffect(() => {
        async function initialize() {
            setLoading(true);
            const speed = await getStorefrontSetting('carousel_speed');
            if (speed) setScrollSpeed(speed);

            if (initialCards && initialCards.length > 0) {
                setCards(initialCards);
            } else {
                const discovered = await discoverExistingCategories();
                setCards(discovered);
            }
            setLoading(false);
        }
        initialize();
    }, [initialCards, discoverExistingCategories]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setCards((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const updated = arrayMove(items, oldIndex, newIndex);
                return updated.map((c, i) => ({ ...c, order: i + 1 }));
            });
        }
    };

    const handleAddCard = () => {
        const newCard: CategoryCardData = {
            id: `cat-${Date.now()}`,
            title: 'New Collection',
            image: '',
            link: '/search',
            order: cards.length + 1
        };
        setCards([...cards, newCard]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await Promise.all([
                saveCategoryCards(cards),
                updateStorefrontSetting('carousel_speed', scrollSpeed)
            ]);
            toast({ title: "Architecture Synchronized", description: "Design-sync successful." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Sync Failed", description: error.message });
        } finally {
            setSaving(false);
        }
    };

    const duplicatedCards = useMemo(() => [...cards, ...cards, ...cards], [cards]);

    if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-primary" /></div>;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b pb-8">
                <div>
                    <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Product Carousel CMS</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Design Sync Active: Pointing to 'collections/' and 'category-carousel/' buckets.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleAddCard} variant="outline" className="rounded-full h-12 px-6 font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add Card
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="rounded-full h-12 px-10 font-black uppercase tracking-tighter shadow-lg bg-primary text-white">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Arrangement
                    </Button>
                </div>
            </div>

            <div className="mb-8 space-y-4 bg-muted/20 p-6 rounded-[2rem] border border-dashed">
                <div className="flex items-center gap-2 mb-2">
                    <LayoutGrid size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Authoritative Categories</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {INVENTORY_CATEGORIES.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-muted rounded-full text-[9px] font-black text-accent uppercase tracking-tighter shadow-sm">
                            {cat}
                        </span>
                    ))}
                </div>
                
                <div className="pt-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                            <Eye size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Real-time Effect Preview</span>
                         </div>
                         <Badge variant="outline" className="bg-white/50 text-[8px] font-black uppercase">Speed: {scrollSpeed}s</Badge>
                    </div>
                    
                    <div className="relative w-full h-[220px] bg-[#0a0f1e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl group/preview">
                         <div 
                            className="flex w-fit items-center h-full flex-nowrap animate-marquee px-4"
                            style={{ animationDuration: `${scrollSpeed}s` }}
                         >
                            {duplicatedCards.map((card, idx) => {
                                const img = getPreviewImageUrl(card.image);
                                return (
                                    <div key={`${card.id}-${idx}`} className="w-[160px] h-[180px] px-2 shrink-0">
                                        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/5">
                                            <Image 
                                                src={img || `https://placehold.co/200x300?text=${encodeURIComponent(card.title)}`}
                                                alt=""
                                                fill
                                                unoptimized
                                                className="object-cover opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute inset-0 p-3 flex flex-col justify-end">
                                                <p className="text-[10px] font-black text-white uppercase leading-tight line-clamp-2">{card.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                         <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0f1e] to-transparent z-10" />
                         <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0f1e] to-transparent z-10" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border shadow-sm mt-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="h-10 w-10 rounded-2xl bg-accent text-white flex items-center justify-center">
                            <Activity size={20} />
                        </div>
                        <div>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent">Pace Regulator</Label>
                            <p className="text-[9px] font-medium text-muted-foreground uppercase">Duration (Seconds)</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-32">
                        <Input 
                            type="number" 
                            value={scrollSpeed} 
                            onChange={(e) => setScrollSpeed(e.target.value)} 
                            className="h-11 rounded-xl font-black text-lg bg-muted/20 border-none text-center"
                        />
                    </div>
                </div>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {cards.map((card) => (
                            <SortableCategoryItem 
                                key={card.id} 
                                card={card} 
                                onUpdate={(updated) => setCards(cards.map(c => c.id === updated.id ? updated : c))}
                                onDelete={(id) => setCards(cards.filter(c => c.id !== id))}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] p-8 space-y-6 mt-10">
                <div className="flex items-center gap-3">
                    <Info className="text-primary h-6 w-6" />
                    <div>
                        <h3 className="text-lg font-black text-accent uppercase tracking-widest">Design-Sync Reference</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Exact paths for 'collections/' bucket folder.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                            <ImageIcon size={14} className="text-primary" /> Plumbing Fixtures
                        </div>
                        <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary select-all cursor-copy">
                            collections/Hand-wash Basin and Pedestal Sink Collection.webp
                        </code>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                            <ImageIcon size={14} className="text-primary" /> Lighting & Bulbs
                        </div>
                        <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary select-all cursor-copy">
                            collections/Bird Art Lights fixture Collection.webp
                        </code>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                            <ImageIcon size={14} className="text-primary" /> Electrical Supplies
                        </div>
                        <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary select-all cursor-copy">
                            collections/Electric Socket Collection.webp
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}
