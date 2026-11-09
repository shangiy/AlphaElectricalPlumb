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
    Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/storage';

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
    const { toast } = useToast();

    const handleUpdate = (id: string, updatedFields: Partial<HeroSlide>) => {
        const updated = slides.map(s => s.id === id ? { ...s, ...updatedFields } : s);
        if (updatedFields.active !== undefined) {
            setSlides(sortSlides(updated));
        } else {
            setSlides(updated);
        }
    };

    const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingId(id);
        try {
            const url = await uploadImage(file, 'Hero div images');
            handleUpdate(id, { imageUrl: url });
            toast({ title: "Asset Ready", description: "Background image synchronized with Hero cloud storage." });
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

                                {/* MEDIA MANAGEMENT (Cloud Assets & Interactive Preview) */}
                                <div className="pt-10 mt-4 border-t border-dashed">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6 block">Visual Identity & Cloud Assets</span>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                        {/* Precision Upload Node with Real-time Preview */}
                                        <div className="lg:col-span-5">
                                            <div className="relative group cursor-pointer border-2 border-dashed rounded-[2.5rem] p-2 hover:border-primary transition-all duration-500 bg-muted/20 text-center aspect-video flex flex-col items-center justify-center overflow-hidden shadow-inner">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                                                    onChange={(e) => handleImageUpload(slide.id, e)}
                                                    disabled={uploadingId === slide.id}
                                                />
                                                
                                                {uploadingId === slide.id ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                                        <span className="text-[10px] font-black text-primary uppercase animate-pulse">Mapping to Supabase...</span>
                                                    </div>
                                                ) : slide.imageUrl ? (
                                                    <>
                                                        <img src={slide.imageUrl} alt="Background Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                            <Upload className="text-white h-10 w-10" />
                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Background</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all">
                                                        <div className="h-20 w-20 rounded-3xl bg-white shadow-xl flex items-center justify-center">
                                                            <Upload className="h-10 w-10 text-primary" />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Campaign Asset</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* URL Configuration & Storage Feedback */}
                                        <div className="lg:col-span-7 space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest ml-1">Cloud Asset Endpoint (URL)</Label>
                                                <Input 
                                                    value={slide.imageUrl} 
                                                    onChange={(e) => handleUpdate(slide.id, { imageUrl: e.target.value })} 
                                                    className="h-14 rounded-2xl font-mono text-[11px] bg-muted/20 border-none shadow-inner px-6" 
                                                    placeholder="Enter secure URL or use upload node ->"
                                                />
                                            </div>
                                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                                    <Sparkles className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                                                    <span className="block font-black text-accent uppercase mb-1">Rendering Engine Note</span>
                                                    Uploaded assets are synchronized with the <span className="text-primary font-bold">Hero div images</span> cluster. For maximum visual fidelity on 4K displays, ensure your aspect ratio is 16:9.
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