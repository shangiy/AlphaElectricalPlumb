'use client';

import React, { useState } from 'react';
import { HeroSlide, saveHeroSlides } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
    Plus, 
    Trash2, 
    Save, 
    Eye, 
    EyeOff, 
    Sparkles,
    Loader2,
    Palette,
    MoveVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const STYLE_OPTIONS = [
    { id: 'kenyan-flag', label: '🇰🇪 Kenyan Flag Colors', previewClass: 'font-black bg-gradient-to-r from-black via-red-600 to-green-600 bg-clip-text text-transparent' },
    { id: 'gold-gradient', label: '✨ Luxury Gold Gradient', previewClass: 'font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent' },
    { id: 'neon-glow', label: '⚡ Electric Neon Blue', previewClass: 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' },
    { id: 'fire-emoji', label: '🔥 Fire & Energy Mode', previewClass: 'font-extrabold text-orange-500 after:content-["🔥"]' },
    { id: 'sparkle', label: '💎 Diamond Sparkle', previewClass: 'font-bold text-purple-400 tracking-widest after:content-["✨"]' }
];

export default function HeroManager({ initialSlides }: { initialSlides: HeroSlide[] }) {
    const sortSlides = (sArr: HeroSlide[]) => {
        return [...sArr].sort((a, b) => {
            if (a.active === b.active) return 0;
            return a.active ? -1 : 1;
        });
    };

    const [slides, setSlides] = useState<HeroSlide[]>(sortSlides(initialSlides || []));
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const handleUpdate = (id: string, updatedFields: Partial<HeroSlide>) => {
        const updated = slides.map(s => s.id === id ? { ...s, ...updatedFields } : s);
        if (updatedFields.active !== undefined) {
            setSlides(sortSlides(updated));
        } else {
            setSlides(updated);
        }
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
            order: slides.length + 1,
            active: true,
            headlineColor: '#ffffff',
            headlineSize: 72,
            subheadingColor: '#ffffff',
            subheadingSize: 24,
            headlineTopMargin: 0,
            subheadingTopMargin: 0
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
                    <Button onClick={handleSave} disabled={saving} className="rounded-full h-12 px-10 font-black uppercase tracking-tighter shadow-xl bg-primary text-white">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Publish Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-12">
                {slides.map((slide, index) => {
                    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];

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
                                        className="bg-red-500 text-white p-2 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                        title="Delete Banner"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {/* HEADLINE HUB */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    <div className="lg:col-span-7 space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Main Headline Copy (Supports Multi-line)</label>
                                        <Textarea 
                                            value={slide.headline} 
                                            onChange={(e) => handleUpdate(slide.id, { headline: e.target.value })} 
                                            className="font-black text-2xl h-32 rounded-2xl p-4 bg-muted/20 border-none shadow-inner resize-none" 
                                            placeholder="Headline text..."
                                        />
                                    </div>
                                    <div className="lg:col-span-5 bg-accent/5 p-6 rounded-[2rem] border border-dashed border-accent/20 space-y-4">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                          <Palette className="h-3 w-3" /> Headline Styling Hub
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Text Color</Label>
                                                <div className="flex items-center gap-2">
                                                  <input type="color" value={slide.headlineColor || '#ffffff'} onChange={(e) => handleUpdate(slide.id, { headlineColor: e.target.value })} className="h-9 w-9 rounded-lg cursor-pointer border-none" />
                                                  <Input value={slide.headlineColor || '#ffffff'} onChange={(e) => handleUpdate(slide.id, { headlineColor: e.target.value })} className="h-9 rounded-lg font-mono text-[10px] uppercase" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Font Size (px)</Label>
                                                <Input type="number" value={slide.headlineSize || 72} onChange={(e) => handleUpdate(slide.id, { headlineSize: parseInt(e.target.value) || 0 })} className="h-9 rounded-lg font-bold" />
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-accent/5">
                                            <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1.5 mb-2">
                                                <MoveVertical className="h-3 w-3" /> Headline Start (cm from top)
                                            </Label>
                                            <div className="flex items-center gap-3">
                                                <Input type="number" step="0.5" value={slide.headlineTopMargin || 0} onChange={(e) => handleUpdate(slide.id, { headlineTopMargin: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl font-black text-lg bg-white w-24" />
                                                <span className="text-[8px] font-black text-muted-foreground uppercase">Centimeters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HIGHLIGHT BOX */}
                                <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                        <Sparkles className="w-4 h-4" /> Word Highlighting Engine
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Target Word</span>
                                            <Input value={slide.highlightedText} onChange={(e) => handleUpdate(slide.id, { highlightedText: e.target.value })} placeholder="MASHUJAA" className="h-12 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Font Effect</span>
                                            <select 
                                                value={slide.styleType} 
                                                onChange={(e) => handleUpdate(slide.id, { styleType: e.target.value as any })}
                                                className="w-full h-12 px-3 rounded-xl border border-input bg-white text-xs font-bold"
                                            >
                                                {STYLE_OPTIONS.map(opt => (
                                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-primary/5 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Active Render:</span>
                                        <span className={`text-xl px-4 py-1.5 rounded-xl bg-white shadow-sm border ${activeStyle.previewClass}`}>
                                            {slide.highlightedText || 'PREVIEW'}
                                        </span>
                                    </div>
                                </div>

                                {/* SUBHEADING HUB */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    <div className="lg:col-span-7 space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">2. Subheading Copy (Supports Multi-line)</label>
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

                                {/* MEDIA & CTA ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Background Image URL</Label>
                                        <Input value={slide.imageUrl} onChange={(e) => handleUpdate(slide.id, { imageUrl: e.target.value })} className="h-11 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Button Label</Label>
                                        <Input value={slide.ctaText} onChange={(e) => handleUpdate(slide.id, { ctaText: e.target.value })} className="h-11 rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Button Destination</Label>
                                        <Input value={slide.ctaLink} onChange={(e) => handleUpdate(slide.id, { ctaLink: e.target.value })} className="h-11 rounded-xl" />
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
