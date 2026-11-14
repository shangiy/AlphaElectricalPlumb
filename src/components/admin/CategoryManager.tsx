'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { saveCategoryCards } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, Trash2, Plus, Save, Loader2, RefreshCw, Info, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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

// Individual Sortable Item Component
function SortableCategoryItem({ card, onUpdate, onDelete }: { 
    card: CategoryCardData; 
    onUpdate: (updated: CategoryCardData) => void; 
    onDelete: (id: string) => void; 
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm mb-3 group hover:border-primary transition-colors">
            <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-primary p-2">
                <GripVertical className="w-5 h-5" />
            </button>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Card Title</label>
                    <Input 
                        value={card.title} 
                        onChange={(e) => onUpdate({ ...card, title: e.target.value })} 
                        placeholder="e.g. Water Tanks"
                        className="h-10 rounded-lg"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Image URL (Storage Path)</label>
                    <Input 
                        value={card.image} 
                        onChange={(e) => onUpdate({ ...card, image: e.target.value })} 
                        placeholder="e.g. Collections/Tanks variety collection.webp"
                        className="h-10 rounded-lg"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Route Link</label>
                    <Input 
                        value={card.link} 
                        onChange={(e) => onUpdate({ ...card, link: e.target.value })} 
                        placeholder="e.g. /category/tanks"
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

/**
 * Intelligent Category Manager v4.4.2:
 * Features "Discovery Mode" and Linear Inventory Reference.
 */
export default function CategoryManager({ initialCards }: { initialCards: CategoryCardData[] }) {
    const [cards, setCards] = useState<CategoryCardData[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    /**
     * Discovery Engine: Fetches existing database categories or system fallbacks
     * to populate the list if no custom CMS configuration exists.
     */
    const discoverExistingCategories = useCallback(async () => {
        if (!supabase) return [];
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (!error && data && data.length > 0) {
                return data.map((cat, index) => ({
                    id: String(cat.id),
                    title: cat.name,
                    image: cat.image_url || '',
                    link: `/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`,
                    order: index + 1
                }));
            }

            // High-Resolution Fallbacks (Matches homepage)
            return [
                { id: 'tanks', title: 'Water Tanks', image: 'Collections/Tanks variety collection.webp', link: '/category/tanks', order: 1 },
                { id: 'plumbing', title: 'Plumbing Equipment', image: 'Collections/Alpha plumbing pipe collection.webp', link: '/category/plumbing', order: 2 },
                { id: 'electrical', title: 'Electrical Supplies', image: 'Collections/Electric Socket Collection.webp', link: '/category/lighting', order: 3 },
                { id: 'decor', title: 'Home & Decor', image: 'Collections/Bird Art Lights fixture Collection.webp', link: '/category/decor', order: 4 },
                { id: 'roofing', title: 'Roofing & Construction', image: 'Collections/Corrugated Roofing Sheet collection.webp', link: '/category/roofing', order: 5 }
            ];
        } catch (e) {
            console.error("Discovery failed:", e);
            return [];
        }
    }, []);

    useEffect(() => {
        async function initialize() {
            setLoading(true);
            if (initialCards && initialCards.length > 0) {
                setCards(initialCards);
            } else {
                // Discovery mode: ensure homepage items are listed by default
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
                // Maintain order metadata
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
            await saveCategoryCards(cards);
            toast({ title: "Carousel Synchronized", description: "Homepage categories have been permanently updated." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Sync Failed", description: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary h-10 w-10" />
                <p className="font-black uppercase tracking-[0.2em] text-muted-foreground/40">Mapping Visual Architecture...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b pb-8">
                <div>
                    <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Product Carousel CMS</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Drag items to arrange storefront appearance. Homepage items are listed here by default.</p>
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

            {/* INVENTORY CATEGORY QUICK-LOOK */}
            <div className="mb-8 space-y-4 bg-muted/20 p-6 rounded-[2rem] border border-dashed animate-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-2 mb-2">
                    <LayoutGrid size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Active Inventory Categories (11)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {INVENTORY_CATEGORIES.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-muted rounded-full text-[9px] font-black text-accent uppercase tracking-tighter whitespace-nowrap shadow-sm">
                            {cat}
                        </span>
                    ))}
                </div>
                <p className="text-[9px] text-muted-foreground italic font-medium">Note: For best results, ensure your Card Titles match or represent these inventory groups.</p>
            </div>

            {cards.length > 0 ? (
                <div className="space-y-10">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-2">
                                {cards.map((card) => (
                                    <SortableCategoryItem 
                                        key={card.id} 
                                        card={card} 
                                        onUpdate={(updated) => setCards(cards.map(c => c.id === updated.id ? updated : c))}
                                        onDelete={(id) => {
                                            if (confirm("Permanently remove this collection from the storefront?")) {
                                                setCards(cards.filter(c => c.id !== id));
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* PATH REFERENCE NODE */}
                    <div className="bg-primary/5 border border-dashed border-primary/20 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <Info className="text-primary h-6 w-6" />
                            <div>
                                <h3 className="text-lg font-black text-accent uppercase tracking-widest">Path Sync Reference</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Copy and paste these exact paths to sync images from Supabase storage.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                                    <ImageIcon size={14} className="text-primary" /> Water Tanks Path
                                </div>
                                <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary break-all select-all cursor-copy" title="Click to Select All">
                                    Collections/Tanks variety collection.webp
                                </code>
                                <p className="text-[9px] text-muted-foreground italic">Link: /category/tanks</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                                    <ImageIcon size={14} className="text-primary" /> Plumbing Path
                                </div>
                                <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary break-all select-all cursor-copy">
                                    Collections/Alpha plumbing pipe collection.webp
                                </code>
                                <p className="text-[9px] text-muted-foreground italic">Link: /category/plumbing</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                                    <ImageIcon size={14} className="text-primary" /> Electrical Path
                                </div>
                                <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary break-all select-all cursor-copy">
                                    Collections/Electric Socket Collection.webp
                                </code>
                                <p className="text-[9px] text-muted-foreground italic">Link: /category/lighting</p>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-accent font-black uppercase text-[10px]">
                                    <ImageIcon size={14} className="text-primary" /> Home & Decor Path
                                </div>
                                <code className="block bg-muted p-2 rounded-lg text-[11px] font-mono text-primary break-all select-all cursor-copy">
                                    Collections/Bird Art Lights fixture Collection.webp
                                </code>
                                <p className="text-[9px] text-muted-foreground italic">Link: /category/decor</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-[2rem] text-center">
                    <RefreshCw className="h-10 w-10 text-muted-foreground/30 mb-4 animate-spin-slow" />
                    <p className="font-bold text-accent uppercase tracking-tighter">Initializing Discovery Engine</p>
                    <Button onClick={discoverExistingCategories} variant="link" className="text-primary mt-2">Force Sync Table</Button>
                </div>
            )}
        </div>
    );
}
