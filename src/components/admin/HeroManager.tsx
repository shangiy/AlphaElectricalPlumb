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
            active: true,
            headlineColor: '#ffffff',
            headlineSize: 72,
            subheadingColor: '#ffffff',
            subheadingSize: 24,
            topMargin: 0
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

            <div className="space-y-12">
                {slides.length > 0 ? slides.map((slide, index) => {
                    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];

                    return (
                        <div key={slide.id} className="bg-white rounded-[2.5rem] border shadow-xl p-10 relative overflow-hidden transition-all hover:shadow-2xl">
                            <div className="flex justify-between items-center mb-8 border-b pb-6">
                                <div className="flex items-center gap-3">
                                    <span className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-black text-sm shadow-inner">#{index + 1}</span>
                                    <span className="font-black text-accent uppercase tracking-widest text-xs">Campaign Slot</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handleUpdate(slide.id, { active: !slide.active })}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${slide.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        {slide.active ? 'Live on Site' : 'Staged/Hidden'}
                                    </button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 rounded-xl h-10 w-10" onClick={() => setSlides(slides.filter(s => s.id !== slide.id))}>
                                        <Trash2 className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Left Side: Content Editor */}
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Main Headline Text (Shift+Enter for lines)</label>
                                        <Textarea 
                                            value={slide.headline} 
                                            onChange={(e) => handleUpdate(slide.id, { headline: e.target.value })} 
                                            rows={3}
                                            className="text-lg font-bold rounded-2xl border-muted-foreground/10 bg-secondary/5 p-4 resize-none"
                                            placeholder="Headline text..."
                                        />
                                    </div>

                                    <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                            <Sparkles className="w-4 h-4" /> Word Highlighting Engine
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Target Word</span>
                                                <Input 
                                                    value={slide.highlightedText} 
                                                    onChange={(e) => handleUpdate(slide.id, { highlightedText: e.target.value })} 
                                                    placeholder="MASHUJAA"
                                                    className="h-12 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Font Effect</span>
                                                <select 
                                                    value={slide.styleType} 
                                                    onChange={(e) => handleUpdate(slide.id, { styleType: e.target.value as any })}
                                                    className="w-full h-12 px-3 rounded-xl border border-input bg-white text-xs font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
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

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Subheading Copy (Shift+Enter for lines)</label>
                                        <Textarea 
                                            value={slide.subheading} 
                                            onChange={(e) => handleUpdate(slide.id, { subheading: e.target.value })} 
                                            rows={3}
                                            className="rounded-2xl border-muted-foreground/10 bg-secondary/5 resize-none p-4 font-medium"
                                            placeholder="Subheading text..."
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Visual & Position Editor */}
                                <div className="space-y-8">
                                    <div className="bg-accent/5 p-8 rounded-[2rem] border border-accent/10 space-y-6">
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                          <Palette className="h-4 w-4" /> Typography & Layout
                                        </h4>
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Headline Color</Label>
                                            <div className="flex gap-2">
                                              <input 
                                                type="color" 
                                                value={slide.headlineColor || '#ffffff'} 
                                                onChange={(e) => handleUpdate(slide.id, { headlineColor: e.target.value })}
                                                className="h-10 w-10 rounded-xl cursor-pointer border-none bg-transparent"
                                              />
                                              <Input value={slide.headlineColor || '#ffffff'} onChange={(e) => handleUpdate(slide.id, { headlineColor: e.target.value })} className="h-10 rounded-xl font-mono text-xs uppercase" />
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Headline Size (px)</Label>
                                            <Input type="number" value={slide.headlineSize || 72} onChange={(e) => handleUpdate(slide.id, { headlineSize: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl font-black" />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Sub-text Color</Label>
                                            <div className="flex gap-2">
                                              <input 
                                                type="color" 
                                                value={slide.subheadingColor || '#ffffff'} 
                                                onChange={(e) => handleUpdate(slide.id, { subheadingColor: e.target.value })}
                                                className="h-10 w-10 rounded-xl cursor-pointer border-none bg-transparent"
                                              />
                                              <Input value={slide.subheadingColor || '#ffffff'} onChange={(e) => handleUpdate(slide.id, { subheadingColor: e.target.value })} className="h-10 rounded-xl font-mono text-xs uppercase" />
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Sub-text Size (px)</Label>
                                            <Input type="number" value={slide.subheadingSize || 24} onChange={(e) => handleUpdate(slide.id, { subheadingSize: parseInt(e.target.value) || 0 })} className="h-10 rounded-xl font-black" />
                                          </div>
                                        </div>

                                        <div className="pt-4 border-t border-accent/5">
                                          <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest flex items-center gap-2">
                                              <MoveVertical className="h-3 w-3" /> Position Offset (cm from top)
                                            </Label>
                                            <div className="flex items-center gap-4">
                                              <Input 
                                                type="number" 
                                                step="0.5" 
                                                value={slide.topMargin || 0} 
                                                onChange={(e) => handleUpdate(slide.id, { topMargin: parseFloat(e.target.value) || 0 })} 
                                                className="h-12 rounded-xl font-black text-lg w-32 shadow-inner" 
                                              />
                                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Centimeters</span>
                                            </div>
                                          </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">CTA Label</label>
                                            <Input 
                                                value={slide.ctaText} 
                                                onChange={(e) => handleUpdate(slide.id, { ctaText: e.target.value })} 
                                                className="h-12 rounded-xl font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">CTA Target Path</label>
                                            <Input 
                                                value={slide.ctaLink} 
                                                onChange={(e) => handleUpdate(slide.id, { ctaLink: e.target.value })} 
                                                className="h-12 rounded-xl font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Background Asset URL</label>
                                        <Input 
                                            value={slide.imageUrl} 
                                            onChange={(e) => handleUpdate(slide.id, { imageUrl: e.target.value })} 
                                            placeholder="https://..."
                                            className="h-12 rounded-xl"
                                        />
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
