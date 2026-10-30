'use client';

import React, { useState } from 'react';
import { HeroSlide, saveHeroSlides } from '@/app/actions/cms-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
    Plus, 
    Trash2, 
    Save, 
    Eye, 
    EyeOff, 
    Sparkles,
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const STYLE_OPTIONS = [
    { id: 'kenyan-flag', label: '🇰🇪 Kenyan Flag Colors', previewClass: 'font-black bg-gradient-to-r from-black via-red-600 to-green-600 bg-clip-text text-transparent' },
    { id: 'gold-gradient', label: '✨ Luxury Gold Gradient', previewClass: 'font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent' },
    { id: 'neon-glow', label: '⚡ Electric Neon Blue', previewClass: 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' },
    { id: 'fire-emoji', label: '🔥 Fire & Energy Mode', previewClass: 'font-extrabold text-orange-500 after:content-["🔥"]' },
    { id: 'sparkle', label: '💎 Diamond Sparkle', previewClass: 'font-bold text-purple-400 tracking-widest after:content-["✨"]' }
];

export default function HeroManager({ initialSlides }: { initialSlides: HeroSlide[] }) {
    const [slides, setSlides] = useState<HeroSlide[]>(initialSlides || []);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const handleUpdate = (id: string, updatedFields: Partial<HeroSlide>) => {
        setSlides(slides.map(s => s.id === id ? { ...s, ...updatedFields } : s));
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
            active: true
        };
        setSlides([...slides, newSlide]);
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
        <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b pb-8">
                <div>
                    <h2 className="text-3xl font-black font-headline text-accent tracking-tighter uppercase">Hero Carousel CMS</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Manage high-impact headlines and campaign banners with the Style Engine.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleAddSlide} variant="outline" className="rounded-full h-12 px-6 font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Add Slide
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="rounded-full h-12 px-10 font-black uppercase tracking-tighter shadow-lg bg-primary">
                        {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Publish Slides
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {slides.length > 0 ? slides.map((slide, index) => {
                    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];

                    return (
                        <div key={slide.id} className="bg-white rounded-[2.5rem] border shadow-xl p-8 relative overflow-hidden transition-all hover:shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="h-8 w-8 rounded-full bg-accent text-white flex items-center justify-center font-black text-xs">#{index + 1}</span>
                                    <span className="font-black text-accent uppercase tracking-widest text-xs">Campaign Slot</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => handleUpdate(slide.id, { active: !slide.active })}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {slide.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        {slide.active ? 'Live on Site' : 'Staged/Hidden'}
                                    </button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 rounded-xl" onClick={() => setSlides(slides.filter(s => s.id !== slide.id))}>
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Side: Copy */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Main Headline Text</label>
                                        <Input 
                                            value={slide.headline} 
                                            onChange={(e) => handleUpdate(slide.id, { headline: e.target.value })} 
                                            className="h-12 text-lg font-bold rounded-xl border-muted-foreground/10 bg-secondary/5"
                                        />
                                    </div>

                                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Sparkles className="w-4 h-4" /> Word Highlighting & Style Engine
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Target Word</span>
                                                <Input 
                                                    value={slide.highlightedText} 
                                                    onChange={(e) => handleUpdate(slide.id, { highlightedText: e.target.value })} 
                                                    placeholder="MASHUJAA"
                                                    className="h-10 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Font Effect</span>
                                                <select 
                                                    value={slide.styleType} 
                                                    onChange={(e) => handleUpdate(slide.id, { styleType: e.target.value as any })}
                                                    className="w-full h-10 px-3 rounded-xl border border-input bg-white text-xs font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                >
                                                    {STYLE_OPTIONS.map(opt => (
                                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-primary/5 flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Active Render:</span>
                                            <span className={`text-xl px-3 py-1 rounded-xl bg-white shadow-sm border ${activeStyle.previewClass}`}>
                                                {slide.highlightedText || 'PREVIEW'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Subheading Copy</label>
                                        <Textarea 
                                            value={slide.subheading} 
                                            onChange={(e) => handleUpdate(slide.id, { subheading: e.target.value })} 
                                            rows={2}
                                            className="rounded-2xl border-muted-foreground/10 bg-secondary/5 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Interaction & Visuals */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">CTA Text</label>
                                            <Input 
                                                value={slide.ctaText} 
                                                onChange={(e) => handleUpdate(slide.id, { ctaText: e.target.value })} 
                                                className="h-10 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">CTA Link</label>
                                            <Input 
                                                value={slide.ctaLink} 
                                                onChange={(e) => handleUpdate(slide.id, { ctaLink: e.target.value })} 
                                                className="h-10 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Banner Image URL</label>
                                        <Input 
                                            value={slide.imageUrl} 
                                            onChange={(e) => handleUpdate(slide.id, { imageUrl: e.target.value })} 
                                            placeholder="https://... or /path.jpg"
                                            className="h-10 rounded-xl"
                                        />
                                    </div>

                                    {/* Mockup Preview */}
                                    <div className="relative h-40 rounded-[2rem] overflow-hidden group shadow-2xl">
                                        <img 
                                            src={slide.imageUrl} 
                                            alt="" 
                                            className="absolute inset-0 h-full w-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/elegant_background.jpg'; }}
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-5">
                                            <span className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Sync Ready</span>
                                            <h4 className="text-xs font-black text-white leading-tight uppercase line-clamp-1">
                                                {slide.headline} <span className={activeStyle.previewClass}>{slide.highlightedText}</span>
                                            </h4>
                                            <p className="text-[9px] text-white/60 line-clamp-1 font-medium mt-1">{slide.subheading}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-[3rem] text-center">
                        <Plus className="h-12 w-12 text-muted-foreground/20 mb-4" />
                        <h3 className="text-xl font-black text-accent uppercase tracking-tighter">Carousel Empty</h3>
                        <Button onClick={handleAddSlide} variant="link" className="text-primary mt-2">Initialize Storefront Banners</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
