'use client';

import React, { useState } from 'react';
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
import { GripVertical, Trash2, Plus, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface CategoryCardData {
    id: string;
    title: string;
    image: string;
    link: string;
    order: number;
}

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
                        placeholder="e.g., Water Tanks"
                        className="h-10 rounded-lg"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Image URL</label>
                    <Input 
                        value={card.image} 
                        onChange={(e) => onUpdate({ ...card, image: e.target.value })} 
                        placeholder="Path or URL"
                        className="h-10 rounded-lg"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Route Link</label>
                    <Input 
                        value={card.link} 
                        onChange={(e) => onUpdate({ ...card, link: e.target.value })} 
                        placeholder="e.g., /category/tanks"
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
    const [cards, setCards] = useState<CategoryCardData[]>(initialCards || []);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

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
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddCard = () => {
        const newCard: CategoryCardData = {
            id: `cat-${Date.now()}`,
            title: 'New Collection',
            image: '/background.jpg',
            link: '/search',
            order: cards.length + 1
        };
        setCards([...cards, newCard]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveCategoryCards(cards);
            toast({ title: "Carousel Published", description: "Homepage categories have been synchronized." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Sync Failed", description: error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b pb-8">
                <div>
                    <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Category Carousel CMS</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Drag items to arrange storefront appearance or modify card attributes.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleAddCard} variant="outline" className="rounded-full h-12 px-6 font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add Card
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="rounded-full h-12 px-10 font-black uppercase tracking-tighter shadow-lg bg-primary">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Arrangement
                    </Button>
                </div>
            </div>

            {cards.length > 0 ? (
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
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-[2rem] text-center">
                    <Plus className="h-10 w-10 text-muted-foreground/30 mb-4" />
                    <p className="font-bold text-accent uppercase tracking-tighter">Carousel is Empty</p>
                    <Button onClick={handleAddCard} variant="link" className="text-primary mt-2">Initialize Categories</Button>
                </div>
            )}
        </div>
    );
}
