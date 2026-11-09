'use client';

import React, { useState } from 'react';
import { HeroSlide, saveHeroSlides } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
    Plus, 
    Trash2, 
    Save, 
    Palette, 
    MoveVertical, 
    Sparkles, 
    Loader2,
    Upload,
    ChevronUp,
    ChevronDown,
    Image as ImageIcon,
    X,
    GripVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/storage';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const STYLE_OPTIONS = [
    { id: 'kenyan-flag', label: '🇰🇪 Kenyan Flag Colors', previewClass: 'font-black bg-gradient-to-r from-black via-red-600 to-green-600 bg-clip-text text-transparent' },
    { id: 'gold-gradient', label: '✨ Luxury Gold Gradient', previewClass: 'font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent' },
    { id: 'neon-glow', label: '⚡ Electric Neon Blue', previewClass: 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' },
    { id: 'fire-emoji', label: '🔥 Fire & Energy Mode', previewClass: 'font-extrabold text-orange-500 after:content-["🔥"]' },
    { id: 'sparkle', label: '💎 Diamond Sparkle', previewClass: 'font-bold text-purple-400 tracking-widest after:content-["✨"]' }
];

export const FONT_OPTIONS = [
    { id: 'font-montserrat', label: 'Montserrat' },
    { id: 'font-headline', label: 'Poppins (Headline)' },
    { id: 'font-body', label: 'PT Sans (Body)' },
    { id: 'font-code', label: 'Monospace' }
];

export const BOLDNESS_OPTIONS = [
    { id: 'font-light', label: 'Light' },
    { id: 'font-normal', label: 'Normal' },
    { id: 'font-semibold', label: 'SemiBold' },
    { id: 'font-bold', label: 'Bold' },
    { id: 'font-black', label: 'Black' }
];

/**
 * Sortable Image Item Component
 */
function SortableImageItem({ url, index, isSelected, onClick }: { 
    url: string; 
    index: number; 
    isSelected: boolean;
    onClick: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: url });

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
                "group relative aspect-video rounded-2xl overflow-hidden border bg-muted shadow-md cursor-pointer transition-all duration-300",
                isSelected ? "ring-4 ring-primary border-transparent scale-105" : "hover:border-primary/40",
                isDragging && "opacity-50 grayscale"
            )}
            onClick={onClick}
        >
            <img src={url} alt={`Slot ${index + 1}`} className="w-full h-full object-cover" />
            
            {/* Drag Handle Overlay */}
            <div 
                {...attributes} 
                {...listeners} 
                className="absolute top-2 left-2 p-1.5 bg-black/40 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={14} />
            </div>

            <div className="absolute bottom-1 left-2 pointer-events-none">
                <span className="text-[8px] font-black text-white uppercase drop-shadow-md">Slot {index + 1}</span>
            </div>
            
            {isSelected && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none">
                    <div className="bg-primary text-white p-1 rounded-full shadow-lg">
                        <ImageIcon size={16} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HeroManager({ initialSlides }: { initialSlides: HeroSlide[] }) {
    const sortSlides = (sArr: HeroSlide[]) => {
        return [...sArr].sort((a, b) => {
            if (a.active === b.active) return 0;
            return a.active ? -1 : 1;
        });
    };

    const [slides, setSlides] = useState<HeroSlide[]>(sortSlides(initialSlides || []));
    const [saving, setSaving] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [selectedIndices, setSelectedIndices] = useState<Record<string, number>>({});
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleUpdate = (id: string, updatedFields: Partial<HeroSlide>) => {
        const updated = slides.map(s => s.id === id ? { ...s, ...updatedFields } : s);
        if (updatedFields.active !== undefined) {
            setSlides(sortSlides(updated));
        } else {
            setSlides(updated);
        }
    };

    const handleDragEnd = (slideId: string, event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const currentSlide = slides.find(s => s.id === slideId);
            if (!currentSlide) return;

            const urls = currentSlide.imageUrls || (currentSlide.imageUrl ? [currentSlide.imageUrl] : []);
            const oldIndex = urls.indexOf(active.id as string);
            const newIndex = urls.indexOf(over.id as string);

            const newUrls = arrayMove(urls, oldIndex, newIndex);
            handleUpdate(slideId, { imageUrls: newUrls, imageUrl: newUrls[0] });
            
            // Update selected index to match moved image if necessary
            const currentSelected = selectedIndices[slideId] || 0;
            if (currentSelected === oldIndex) {
                setSelectedIndices(prev => ({ ...prev, [slideId]: newIndex }));
            }
        }
    };

    const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(id);
        try {
            const url = await uploadImage(file, 'Hero div images');
            const currentSlide = slides.find(s => s.id === id);
            const currentUrls = currentSlide?.imageUrls || (currentSlide?.imageUrl ? [currentSlide.imageUrl] : []);
            
            const newUrls = [...currentUrls, url];
            handleUpdate(id, { 
                imageUrls: newUrls,
                imageUrl: url // Maintain legacy for now
            });
            
            // Automatically select the new image
            setSelectedIndices(prev => ({ ...prev, [id]: newUrls.length - 1 }));
            
            toast({ title: "Asset Ready", description: "Background asset synchronized with Hero cloud storage." });
        } catch (error: any) {
            console.error("Hero upload failed:", error);
            toast({ 
                variant: "destructive", 
                title: "Upload Failed", 
                description: error.message || "Ensure the 'Hero div images' bucket exists and is public." 
            });
        } finally {
            setUploadingId(null);
            e.target.value = '';
        }
    };

    const removeImage = (slideId: string, urlToRemove: string) => {
        const currentSlide = slides.find(s => s.id === slideId);
        if (!currentSlide) return;
        
        const currentUrls = currentSlide.imageUrls || (currentSlide.imageUrl ? [currentSlide.imageUrl] : []);
        const updatedUrls = currentUrls.filter(u => u !== urlToRemove);
        
        handleUpdate(slideId, { 
            imageUrls: updatedUrls,
            imageUrl: updatedUrls[0] || ''
        });
        
        // Reset selection to the first available image
        setSelectedIndices(prev => ({ ...prev, [slideId]: 0 }));
        toast({ description: "Asset removed from campaign." });
    };

    const handleAddSlide = () => {
        const newSlide: HeroSlide = {
            id: `slide-${Date.now()}`,
            headline: 'New Campaign Headline',
            highlightedText: 'OFFER',
            styleType: 'gold-gradient',
            subheading: 'Add your campaign details here.',
            ctaText: 'Shop Now',
            ctaLink: '/search',
            imageUrl: '/background.jpg',
            imageUrls: ['/background.jpg'],
            order: slides.length + 1,
            active: true,
            headlineColor: '#ffffff',
            headlineSize: 72,
            headlineWeight: 'font-black',
            subheadingColor: '#ffffff',
            subheadingSize: 24,
            headlineTopMargin: 0,
            subheadingTopMargin: 0,
            wordStyles: [
                { text: '', color: '#ffffff', font: 'font-montserrat' },
                { text: '', color: '#ffffff', font: 'font-montserrat' },
                { text: '', color: '#ffffff', font: 'font-montserrat' }
            ]
        };
        setSlides(sortSlides([...slides, newSlide]));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveHeroSlides(slides);
            toast({ title: "Banners Published", description: "Storefront carousel has been updated." });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Sync Failed", description: error.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b pb-8">
                <div>
                    <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Hero Carousel CMS</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Manage high-impact headlines. Active slides move to top; inactive slides are moved below for cleanup.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleAddSlide} variant="outline" className="rounded-full h-12 px-6 font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add Slide
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="rounded-full h-12 px-10 font-black uppercase tracking-tighter shadow-lg bg-primary text-white">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Publish Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-12">
                {slides.map((slide, index) => {
                    const currentImages = slide.imageUrls || (slide.imageUrl ? [slide.imageUrl] : []);
                    const selectedIdx = selectedIndices[slide.id] || 0;
                    const previewImage = currentImages[selectedIdx] || currentImages[0];
                    
                    return (
                        <div key={slide.id} className={cn("bg-white rounded-[3rem] border shadow-xl p-10 relative overflow-hidden transition-all hover:shadow-2xl", !slide.active && "opacity-60 grayscale bg-muted/20")}>
                            <div className="flex justify-between items-center mb-8 border-b pb-6">
                                <div className="flex items-center gap-3">
                                    <span className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-sm shadow-inner">#{index + 1}</span>
                                    <span className="font-black text-accent uppercase tracking-widest text-xs">Campaign Slot {!slide.active && "(OFFLINE)"}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Switch checked={slide.active} onCheckedChange={(val) => handleUpdate(slide.id, { active: val })} />
                                    <button 
                                        onClick={() => setSlides(slides.filter(s => s.id !== slide.id))} 
                                        className="bg-red-50 text-red-500 p-2 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                                        title="Delete Banner"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {/* HEADLINE HUB */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    <div className="lg:col-span-7 space-y-4">
                                        <div className="space-y-2">
                                          <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Hero Main Copy (Legacy/Alt Text)</label>
                                          <Textarea 
                                              value={slide.headline} 
                                              onChange={(e) => handleUpdate(slide.id, { headline: e.target.value })} 
                                              className="font-bold text-2xl h-32 rounded-2xl p-4 bg-muted/20 border-none shadow-inner resize-none whitespace-pre-wrap" 
                                              placeholder="Overall headline text..."
                                          />
                                        </div>

                                        {/* Live Headline Preview in CMS */}
                                        <div className="p-8 rounded-[2rem] bg-[#0a0f1e] border border-white/5 relative overflow-hidden min-h-[200px] flex items-center justify-center">
                                           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                                           <div className="relative z-10 text-center">
                                              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Live Layout Preview</p>
                                              <h1 
                                                className={cn("leading-tight tracking-tighter break-words whitespace-pre-wrap", slide.headlineWeight || 'font-black')}
                                                style={{ 
                                                    fontSize: slide.headlineSize ? `${slide.headlineSize / 2.5}px` : '32px',
                                                    marginTop: `${(slide.headlineTopMargin || 0) / 2.5}cm`
                                                }}
                                              >
                                                {(() => {
                                                  if (!slide.headline) return <span className="text-white/20">Awaiting input...</span>;
                                                  const styles = slide.wordStyles || [];
                                                  const parts = slide.headline.split(/(\s+)/);
                                                  
                                                  return parts.map((part, i) => {
                                                    if (part.trim() === '') return part;
                                                    const cleanPart = part.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().trim();
                                                    if (!cleanPart) return part;
                                                    const match = styles.find(s => s.text && s.text.toLowerCase().trim() === cleanPart);
                                                    if (match) {
                                                      return <span key={i} className={match.font} style={{ color: match.color }}>{part}</span>;
                                                    }
                                                    return <span key={i} className="text-white">{part}</span>;
                                                  });
                                                })()}
                                              </h1>
                                           </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-5 flex flex-col gap-6">
                                        {/* GENERAL STYLING */}
                                        <div className="bg-accent/5 p-6 rounded-[2rem] border border-dashed border-accent/20 space-y-4">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                              <Palette className="h-3 w-3" /> General Headline Styling
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Font Size (px)</Label>
                                                    <Input 
                                                        type="number" 
                                                        value={slide.headlineSize || 72} 
                                                        onChange={(e) => handleUpdate(slide.id, { headlineSize: parseInt(e.target.value) || 0 })} 
                                                        className="h-9 rounded-lg font-bold" 
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Boldness (Weight)</Label>
                                                    <select
                                                        value={slide.headlineWeight || 'font-black'}
                                                        onChange={(e) => handleUpdate(slide.id, { headlineWeight: e.target.value })}
                                                        className="w-full h-9 px-2 rounded-lg border font-bold text-[10px] bg-white"
                                                    >
                                                        {BOLDNESS_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRIPLE WORD ENGINE */}
                                        <div className="bg-accent/5 p-6 rounded-[2rem] border border-dashed border-accent/20 space-y-4">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                              <Palette className="h-3 w-3" /> Triple Word Engine
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                {[0, 1, 2].map((i) => (
                                                    <div key={i} className="p-3 bg-white/50 rounded-xl border border-accent/5 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Word {i + 1}</Label>
                                                        </div>
                                                        <Input 
                                                            value={slide.wordStyles?.[i]?.text || ''} 
                                                            onChange={(e) => {
                                                                const ws = [...(slide.wordStyles || [])];
                                                                ws[i] = { ...(ws[i] || {text:'', color:'#ffffff', font:'font-montserrat'}), text: e.target.value };
                                                                handleUpdate(slide.id, { wordStyles: ws });
                                                            }}
                                                            placeholder="Enter word..."
                                                            className="h-9 text-xs rounded-lg font-bold"
                                                        />
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <input 
                                                                    type="color" 
                                                                    value={slide.wordStyles?.[i]?.color || '#ffffff'} 
                                                                    onChange={(e) => {
                                                                        const ws = [...(slide.wordStyles || [])];
                                                                        ws[i] = { ...(ws[i] || {text:'', color:'#ffffff', font:'font-montserrat'}), color: e.target.value };
                                                                        handleUpdate(slide.id, { wordStyles: ws });
                                                                    }}
                                                                    className="h-7 w-7 rounded-md cursor-pointer border-none" 
                                                                />
                                                                <span className="text-[8px] font-mono uppercase">{slide.wordStyles?.[i]?.color || '#FFFFFF'}</span>
                                                            </div>
                                                            <select
                                                                value={slide.wordStyles?.[i]?.font || 'font-montserrat'}
                                                                onChange={(e) => {
                                                                    const ws = [...(slide.wordStyles || [])];
                                                                    ws[i] = { ...(ws[i] || {text:'', color:'#ffffff', font:'font-montserrat'}), font: e.target.value };
                                                                    handleUpdate(slide.id, { wordStyles: ws });
                                                                }}
                                                                className="h-7 text-[8px] font-black uppercase tracking-tighter bg-white border rounded-md px-1"
                                                            >
                                                                {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-2 border-t border-accent/5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1.5 mb-2">
                                                    <MoveVertical className="h-3 w-3" /> Vertical Offset (cm)
                                                </Label>
                                                <div className="flex items-center gap-3">
                                                    <Input type="number" step="0.5" value={slide.headlineTopMargin || 0} onChange={(e) => handleUpdate(slide.id, { headlineTopMargin: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl font-black text-lg bg-white w-24" />
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase">From Top</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SUBHEADING HUB */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    <div className="lg:col-span-7 space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Subheading Copy</label>
                                        <Textarea 
                                            value={slide.subheading} 
                                            onChange={(e) => handleUpdate(slide.id, { subheading: e.target.value })} 
                                            className="font-medium text-lg h-24 rounded-2xl p-4 bg-muted/20 border-none shadow-inner resize-none" 
                                            placeholder="Subheading copy..."
                                        />
                                    </div>
                                    <div className="lg:col-span-5 bg-accent/5 p-6 rounded-[2rem] border border-dashed border-accent/20 space-y-4">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                          <Palette className="h-3 w-3" /> Subheading Styling Hub
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Text Color</Label>
                                                <div className="flex items-center gap-2">
                                                  <input type="color" value={slide.subheadingColor || '#ffffff'} onChange={(e) => handleUpdate(slide.id, { subheadingColor: e.target.value })} className="h-9 w-9 rounded-lg cursor-pointer border-none" />
                                                  <Input value={slide.subheadingColor || '#ffffff'} onChange={(e) => handleUpdate(slide.id, { subheadingColor: e.target.value })} className="h-9 rounded-lg font-mono text-[10px] uppercase" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Font Size (px)</Label>
                                                <Input type="number" value={slide.subheadingSize || 24} onChange={(e) => handleUpdate(slide.id, { subheadingSize: parseInt(e.target.value) || 0 })} className="h-9 rounded-lg font-bold" />
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-accent/5">
                                            <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1.5 mb-2">
                                                <MoveVertical className="h-3 w-3" /> Spacing from Headline (cm)
                                            </Label>
                                            <div className="flex items-center gap-3">
                                                <Input type="number" step="0.5" value={slide.subheadingTopMargin || 0} onChange={(e) => handleUpdate(slide.id, { subheadingTopMargin: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl font-black text-lg bg-white w-24" />
                                                <span className="text-[8px] font-black text-muted-foreground uppercase">Centimeters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTON CONFIG ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Button Label</Label>
                                        <Input value={slide.ctaText} onChange={(e) => handleUpdate(slide.id, { ctaText: e.target.value })} className="h-12 rounded-xl font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Button Destination</Label>
                                        <Input value={slide.ctaLink} onChange={(e) => handleUpdate(slide.id, { ctaLink: e.target.value })} className="h-12 rounded-xl shadow-sm" />
                                    </div>
                                </div>

                                {/* MEDIA MANAGEMENT (Cloud Assets & Interactive Gallery) */}
                                <div className="pt-10 mt-4 border-t border-dashed">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Campaign Assets & Background Carousel</span>
                                        <div className="flex items-center gap-2 mt-2 md:mt-0">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[8px] font-black text-primary uppercase">Drag Slots to Reorder</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-10">
                                        {/* Multi-Image Gallery Manager with DnD */}
                                        <DndContext 
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={(event) => handleDragEnd(slide.id, event)}
                                        >
                                            <SortableContext 
                                                items={currentImages}
                                                strategy={rectSortingStrategy}
                                            >
                                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                                    {currentImages.map((url, i) => (
                                                        <SortableImageItem 
                                                            key={url} 
                                                            url={url} 
                                                            index={i} 
                                                            isSelected={selectedIdx === i}
                                                            onClick={() => setSelectedIndices(prev => ({ ...prev, [slide.id]: i }))}
                                                        />
                                                    ))}
                                                    
                                                    {/* Upload Trigger Node */}
                                                    <div className="relative group cursor-pointer border-2 border-dashed rounded-2xl hover:border-primary transition-all bg-muted/20 aspect-video flex flex-col items-center justify-center">
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                                                            onChange={(e) => handleImageUpload(slide.id, e)}
                                                            disabled={uploadingId === slide.id}
                                                        />
                                                        {uploadingId === slide.id ? (
                                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                                <Plus className="h-6 w-6" />
                                                                <span className="text-[8px] font-black uppercase">Add Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </SortableContext>
                                        </DndContext>

                                        {/* Interactive Large Preview & Command Node */}
                                        <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-white/20 shadow-2xl relative overflow-hidden group/preview">
                                            {/* Blueprint Pattern */}
                                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`, backgroundSize: '30px 30px' }} />
                                            
                                            <div className="relative z-10 flex flex-col gap-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                                            <ImageIcon size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Slot {selectedIdx + 1} Detail</p>
                                                            <p className="text-[8px] font-bold text-muted-foreground uppercase">High-Fidelity Campaign Preview</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {currentImages.length > 0 && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="rounded-full h-8 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 font-black uppercase text-[9px] tracking-widest"
                                                            onClick={() => removeImage(slide.id, previewImage)}
                                                        >
                                                            <Trash2 size={12} className="mr-2" /> Delete Asset
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10">
                                                    {previewImage ? (
                                                        <img src={previewImage} alt="Selected Preview" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover/preview:scale-110" />
                                                    ) : (
                                                        <div className="h-full w-full flex flex-col items-center justify-center text-white/20 gap-4">
                                                            <ImageIcon size={64} />
                                                            <p className="text-xs font-black uppercase tracking-[0.4em]">Empty Slot</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/50 flex items-start gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                        <Sparkles className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                                                        <span className="block font-black text-accent uppercase mb-1">Dynamic Sequence Active</span>
                                                        The order displayed in the slots above defines your background carousel. Click any slot to preview or remove it. Drag to reorder. 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Button variant="outline" onClick={handleAddSlide} className="w-full h-24 rounded-[3.5rem] border-2 border-dashed font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 hover:border-primary hover:bg-primary/5 transition-all">
                <Plus className="mr-3 h-8 w-8" /> Add Campaign Module
            </Button>
        </div>
    );
}
