'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Loader2, 
  Palette, 
  LayoutGrid, 
  Trash2, 
  Plus, 
  Save, 
  Sparkles,
  MessageSquare,
  Eye,
  EyeOff,
  MoveVertical,
  Flag,
  Ghost
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FeaturedProductManager from './FeaturedProductManager';
import CategoryManager, { type CategoryCardData } from './CategoryManager';
import { 
  getStorefrontSetting, 
  updateStorefrontSetting,
  toggleReviewVisibility,
  type HeroSlide
} from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';

export const STYLE_OPTIONS = [
    { id: 'kenyan-flag', label: '🇰🇪 Kenyan Flag Colors', previewClass: 'font-black bg-gradient-to-r from-black via-red-600 to-green-600 bg-clip-text text-transparent' },
    { id: 'gold-gradient', label: '✨ Luxury Gold Gradient', previewClass: 'font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent' },
    { id: 'neon-glow', label: '⚡ Electric Neon Blue', previewClass: 'font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' },
    { id: 'fire-emoji', label: '🔥 Fire & Energy Mode', previewClass: 'font-extrabold text-orange-500 after:content-["🔥"]' },
    { id: 'sparkle', label: '💎 Diamond Sparkle', previewClass: 'font-bold text-purple-400 tracking-widest after:content-["✨"]' }
];

/**
 * Storefront CMS Suite v3.0
 * Intelligent hub for managing every aspect of the storefront experience.
 */
export default function UiUxControlCenter() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get('tab') || 'topbanner';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [topBannerText, setTopBannerText] = useState('');
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [searchPhrases, setSearchPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');
  const [categoryCards, setCategoryCards] = useState<CategoryCardData[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const sortHeroSlides = (slides: HeroSlide[]) => {
    return [...slides].sort((a, b) => {
        if (a.active === b.active) return 0;
        return a.active ? -1 : 1;
    });
  };

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [hero, search, cats, topBanner] = await Promise.all([
        getStorefrontSetting('hero_slides'),
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('category_cards'),
        getStorefrontSetting('top_banner_text')
      ]);
      
      if (hero) setHeroSlides(sortHeroSlides(hero as HeroSlide[]));
      if (search) setSearchPhrases(search);
      if (cats) setCategoryCards(cats);
      if (topBanner) setTopBannerText(topBanner);

      const { data: revData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      setReviews(revData || []);
    } catch (err) {
      console.error("CMS data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllSettings();
  }, [loadAllSettings]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/admin/featured?${params.toString()}`, { scroll: false });
  };

  const handleSaveTopBanner = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('top_banner_text', topBannerText);
        toast({ title: "Top Banner Synced", description: "Scrolling text has been updated globally." });
    } catch (err: any) {
        toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
        setSubmitting(false);
    }
  };

  const handleSaveHero = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('hero_slides', heroSlides);
        toast({ title: "Hero Synchronized", description: "Banners updated live on storefront." });
    } catch (err: any) {
        toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
        setSubmitting(false);
    }
  };

  const handleSaveSearch = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('search_phrases', searchPhrases);
        toast({ title: "Search Synced", description: "Typing animations updated." });
    } catch (err: any) {
        toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="font-black text-muted-foreground uppercase tracking-widest">Accessing CMS Cloud...</p>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black font-headline text-accent tracking-tighter uppercase flex items-center gap-4">
            <LayoutGrid className="text-primary h-12 w-12" />
            Alpha CMS Suite
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Professional Storefront Governance v3.0</p>
        </div>
        <Button onClick={handleSaveHero} disabled={submitting} className="rounded-full h-12 px-8 bg-primary font-black uppercase tracking-tighter shadow-xl">
            {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Global Save
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto bg-muted/30 p-2 rounded-[2.5rem] mb-12 border shadow-inner">
            <TabsTrigger value="topbanner" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Top Banner</TabsTrigger>
            <TabsTrigger value="hero" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Hero Banners</TabsTrigger>
            <TabsTrigger value="search" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Search CMS</TabsTrigger>
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Spotlight</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Category CMS</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="topbanner">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-accent text-white p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Flag className="text-primary h-6 w-6" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Top Scrolling Banner</CardTitle>
                        </div>
                        <CardDescription className="text-white/60 font-medium">Manage the absolute topmost section of your landing page.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Banner Message</Label>
                            <Textarea 
                                value={topBannerText} 
                                onChange={(e) => setTopBannerText(e.target.value)}
                                placeholder="OFFER! MIDYEAR FLASH SALE, MASHUJAA DAY OFFER!"
                                className="min-h-[120px] rounded-2xl p-4 font-bold text-lg shadow-inner bg-muted/10 border-none resize-none"
                            />
                            <div className="space-y-3">
                                <div className="p-4 bg-primary/5 rounded-xl border border-dashed border-primary/20 flex gap-3 items-start">
                                    <Sparkles className="h-5 w-5 text-primary shrink-0" />
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                        Pro Tip: Use <span className="font-black text-accent">"OFFER!"</span> or <span className="font-black text-accent">"MASHUJAA"</span> in your text to trigger special Kenyan-themed visual highlights automatically.
                                    </p>
                                </div>
                                <div className="p-4 bg-orange-500/5 rounded-xl border border-dashed border-orange-500/20 flex gap-3 items-start">
                                    <Ghost className="h-5 w-5 text-orange-500 shrink-0" />
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                        Seasonal Tip: Use <span className="font-black text-orange-600">"HALLOWEEN"</span> in your text to trigger a spooky seasonal effect with orange glows and 🎃 ghosts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 block">Active Preview</Label>
                            <div className="h-10 w-full rounded-lg bg-accent flex items-center overflow-hidden border">
                                <div className="animate-scroll whitespace-nowrap text-white font-bold px-4 text-xs">
                                    {topBannerText || 'Top Banner Message Placeholder...'} &nbsp;&nbsp;&nbsp;&nbsp; {topBannerText || 'Top Banner Message Placeholder...'}
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSaveTopBanner} disabled={submitting} className="w-full h-14 rounded-full font-black uppercase bg-primary text-white mt-4 shadow-xl">
                            Publish Top Banner
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="hero">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-accent">Hero Carousel Management</h3>
                    <Button onClick={handleSaveHero} disabled={submitting} variant="outline" className="rounded-full h-12 px-8 font-black uppercase tracking-tighter">
                        {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Carousel
                    </Button>
                </div>
                <HeroSlideManager slides={heroSlides} setSlides={setHeroSlides} />
            </div>
        </TabsContent>

        <TabsContent value="search">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-accent text-white p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-primary h-6 w-6" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Typing Suggestions</CardTitle>
                        </div>
                        <CardDescription className="text-white/60 font-medium">Manage the sequence of keywords that appear in the global search bar.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex gap-3">
                            <Input 
                                value={newPhrase} 
                                onChange={(e) => setNewPhrase(e.target.value)}
                                placeholder="Add keyword (e.g. high-mast lighting)"
                                className="h-14 rounded-2xl text-lg font-bold"
                                onKeyDown={(e) => e.key === 'Enter' && (setSearchPhrases([...searchPhrases, newPhrase]), setNewPhrase(''))}
                            />
                            <Button onClick={() => { if(newPhrase) { setSearchPhrases([...searchPhrases, newPhrase]); setNewPhrase(''); } }} className="h-14 rounded-2xl px-8 font-black uppercase">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {searchPhrases.map((phrase, i) => (
                                <div key={i} className="flex items-center gap-3 bg-secondary px-5 py-3 rounded-2xl border shadow-sm group">
                                    <span className="text-base font-bold text-accent">{phrase}</span>
                                    <button onClick={() => setSearchPhrases(searchPhrases.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleSaveSearch} disabled={submitting} className="w-full h-14 rounded-full font-black uppercase bg-primary text-white mt-4 shadow-xl">
                            Sync Search Node
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="spotlight">
            <FeaturedProductManager />
        </TabsContent>

        <TabsContent value="categories">
            <CategoryManager initialCards={categoryCards} />
        </TabsContent>

        <TabsContent value="reviews">
            <ReviewModerationSuite reviews={reviews} onRefresh={loadAllSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroSlideManager({ slides, setSlides }: { slides: HeroSlide[], setSlides: (s: HeroSlide[]) => void }) {
    const handleAddSlide = () => {
        const newSlide: HeroSlide = {
            id: Math.random().toString(36).substr(2, 9),
            headline: 'New Campaign Headline',
            highlightedText: 'ALPHA',
            styleType: 'kenyan-flag',
            subheading: 'Compelling subtext for your clients.',
            ctaText: 'EXPLORE',
            ctaLink: '/search',
            imageUrl: '/background.jpg',
            active: true,
            headlineColor: '#ffffff',
            headlineSize: 72,
            subheadingColor: '#ffffff',
            subheadingSize: 24,
            headlineTopMargin: 0,
            subheadingTopMargin: 0
        };
        const newSlides = [...slides, newSlide];
        setSlides(sortSlides(newSlides));
    };

    const sortSlides = (sArr: HeroSlide[]) => {
        return [...sArr].sort((a, b) => {
            if (a.active === b.active) return 0;
            return a.active ? -1 : 1;
        });
    };

    const handleUpdateSlide = (id: string, updates: Partial<HeroSlide>) => {
        const updated = slides.map(s => s.id === id ? { ...s, ...updates } : s);
        // If toggling active status, re-sort the list
        if (updates.active !== undefined) {
            setSlides(sortSlides(updated));
        } else {
            setSlides(updated);
        }
    };

    const handleDeleteSlide = (id: string) => {
        setSlides(slides.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-12">
                {slides.map((slide, i) => {
                    const activeStyle = STYLE_OPTIONS.find(opt => opt.id === slide.styleType) || STYLE_OPTIONS[0];

                    return (
                        <Card key={slide.id} className={cn("rounded-[2.5rem] border shadow-2xl overflow-hidden group transition-all", !slide.active && "opacity-60 grayscale bg-muted/20")}>
                            <div className="relative h-64 bg-muted overflow-hidden">
                                <img src={slide.imageUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <Switch checked={slide.active} onCheckedChange={(val) => handleUpdateSlide(slide.id, { active: val })} />
                                    <button 
                                        onClick={() => handleDeleteSlide(slide.id)} 
                                        className="bg-red-500 text-white p-2 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                                        title="Delete Banner"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                    Slide Slot #{i + 1} {!slide.active && "(OFFLINE)"}
                                </div>
                            </div>
                            
                            <CardContent className="p-10 space-y-12">
                                {/* HEADLINE ROW */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    <div className="lg:col-span-7 space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">1. Main Headline Editor (Shift+Enter for lines)</Label>
                                        <Textarea 
                                            value={slide.headline} 
                                            onChange={(e) => handleUpdateSlide(slide.id, { headline: e.target.value })} 
                                            className="font-black text-2xl h-32 rounded-2xl p-4 bg-muted/20 border-none shadow-inner" 
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
                                                  <input type="color" value={slide.headlineColor || '#ffffff'} onChange={(e) => handleUpdateSlide(slide.id, { headlineColor: e.target.value })} className="h-9 w-9 rounded-lg cursor-pointer border-none" />
                                                  <Input value={slide.headlineColor || '#ffffff'} onChange={(e) => handleUpdateSlide(slide.id, { headlineColor: e.target.value })} className="h-9 rounded-lg font-mono text-[10px] uppercase" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Font Size (px)</Label>
                                                <Input type="number" value={slide.headlineSize || 72} onChange={(e) => handleUpdateSlide(slide.id, { headlineSize: parseInt(e.target.value) || 0 })} className="h-9 rounded-lg font-bold" />
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-accent/5">
                                            <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1.5 mb-2">
                                                <MoveVertical className="h-3 w-3" /> Start Position (cm from top)
                                            </Label>
                                            <div className="flex items-center gap-3">
                                                <Input type="number" step="0.5" value={slide.headlineTopMargin || 0} onChange={(e) => handleUpdateSlide(slide.id, { headlineTopMargin: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl font-black text-lg bg-white w-24" />
                                                <span className="text-[8px] font-black text-muted-foreground uppercase">Centimeters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HIGHLIGHT ROW */}
                                <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                                    <Label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                                        <Sparkles className="w-4 h-4" /> Word Highlighting Engine
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Target word to highlight</span>
                                            <Input value={slide.highlightedText} onChange={(e) => handleUpdateSlide(slide.id, { highlightedText: e.target.value })} placeholder="e.g. MASHUJAA" className="h-12 rounded-xl font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-1">Visual effect style</span>
                                            <select 
                                                value={slide.styleType} 
                                                onChange={(e) => handleUpdateSlide(slide.id, { styleType: e.target.value as any })}
                                                className="w-full h-12 px-3 rounded-xl border border-input bg-white text-xs font-bold shadow-sm focus:outline-none"
                                            >
                                                {STYLE_OPTIONS.map(opt => (
                                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-primary/5 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Active Render:</span>
                                        <span className={`text-xl px-4 py-1.5 rounded-xl bg-white shadow-sm border ${activeStyle.previewClass}`}>
                                            {slide.highlightedText || 'PREVIEW'}
                                        </span>
                                    </div>
                                </div>

                                {/* SUBHEADING ROW */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    <div className="lg:col-span-7 space-y-3">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">2. Subheading Editor (Shift+Enter for lines)</Label>
                                        <Textarea 
                                            value={slide.subheading} 
                                            onChange={(e) => handleUpdateSlide(slide.id, { subheading: e.target.value })} 
                                            className="font-medium text-lg h-24 rounded-2xl p-4 bg-muted/20 border-none shadow-inner" 
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
                                                  <input type="color" value={slide.subheadingColor || '#ffffff'} onChange={(e) => handleUpdateSlide(slide.id, { subheadingColor: e.target.value })} className="h-9 w-9 rounded-lg cursor-pointer border-none" />
                                                  <Input value={slide.subheadingColor || '#ffffff'} onChange={(e) => handleUpdateSlide(slide.id, { subheadingColor: e.target.value })} className="h-9 rounded-lg font-mono text-[10px] uppercase" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase">Font Size (px)</Label>
                                                <Input type="number" value={slide.subheadingSize || 24} onChange={(e) => handleUpdateSlide(slide.id, { subheadingSize: parseInt(e.target.value) || 0 })} className="h-9 rounded-lg font-bold" />
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-accent/5">
                                            <Label className="text-[9px] font-bold text-muted-foreground/60 uppercase flex items-center gap-1.5 mb-2">
                                                <MoveVertical className="h-3 w-3" /> Spacing from Headline (cm)
                                            </Label>
                                            <div className="flex items-center gap-3">
                                                <Input type="number" step="0.5" value={slide.subheadingTopMargin || 0} onChange={(e) => handleUpdateSlide(slide.id, { subheadingTopMargin: parseFloat(e.target.value) || 0 })} className="h-10 rounded-xl font-black text-lg bg-white w-24" />
                                                <span className="text-[8px] font-black text-muted-foreground uppercase">Centimeters</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* MEDIA & CTA ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Background Image URL</Label>
                                        <Input value={slide.imageUrl} onChange={(e) => handleUpdateSlide(slide.id, { imageUrl: e.target.value })} className="h-11 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Button Label</Label>
                                        <Input value={slide.ctaText} onChange={(e) => handleUpdateSlide(slide.id, { ctaText: e.target.value })} className="h-11 rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Button Destination</Label>
                                        <Input value={slide.ctaLink} onChange={(e) => handleUpdateSlide(slide.id, { ctaLink: e.target.value })} className="h-11 rounded-xl" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <Button variant="outline" onClick={handleAddSlide} className="w-full h-24 rounded-[3.5rem] border-2 border-dashed font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 hover:border-primary hover:bg-primary/5 transition-all">
                <Plus className="mr-3 h-8 w-8" /> Add Campaign Module
            </Button>
        </div>
    );
}

function ReviewModerationSuite({ reviews, onRefresh }: { reviews: any[], onRefresh: () => void }) {
    const { toast } = useToast();
    const [modulating, setModulating] = useState<string | null>(null);

    const handleToggle = async (id: string, current: boolean) => {
        setModulating(id);
        try {
            await toggleReviewVisibility(id, !current);
            toast({ title: !current ? "Review Redacted" : "Review Restored", description: "Public storefront updated successfully." });
            onRefresh();
        } catch (error: any) {
            console.error("Moderation failure:", error);
            toast({ variant: "destructive", title: "Action Refused", description: error.message });
        } finally {
            setModulating(null);
        }
    };

    return (
        <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden">
            <CardHeader className="bg-accent text-white p-8 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Community Feedback Audit</CardTitle>
                    <CardDescription className="text-white/60 font-medium">Moderate incoming testimonials before they reach the homepage cluster.</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <MessageSquare className="text-primary h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {reviews.length > 0 ? reviews.map(rev => (
                        <div key={rev.id} className={cn("p-8 flex flex-col md:flex-row gap-6 items-start transition-colors", rev.is_hidden ? "bg-muted/50" : "hover:bg-primary/5")}>
                            <div className="shrink-0 flex flex-col items-center gap-2">
                                <div className="h-14 w-14 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-xl shadow-lg">
                                    {rev.author_name?.charAt(0).toUpperCase()}
                                </div>
                                <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full border", rev.is_hidden ? "bg-red-50 text-red-500 border-red-200" : "bg-green-50 text-green-600 border-green-200")}>
                                    {rev.is_hidden ? "OFFLINE" : "LIVE"}
                                </span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-black text-accent uppercase tracking-tight">{rev.title || 'Review Entry'}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{rev.author_name} • {new Date(rev.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-lg text-[10px] font-black">
                                            {rev.rating} STARS
                                        </div>
                                        <Button 
                                            variant={rev.is_hidden ? "outline" : "destructive"} 
                                            size="sm" 
                                            disabled={modulating === rev.id}
                                            onClick={() => handleToggle(rev.id, !rev.is_hidden)}
                                            className="rounded-xl h-9 px-4 font-black uppercase text-[9px]"
                                        >
                                            {modulating === rev.id ? <Loader2 className="animate-spin h-3 w-3" /> : (rev.is_hidden ? <Eye className="mr-2 h-3 w-3" /> : <EyeOff className="mr-2 h-3 w-3" />)}
                                            {rev.is_hidden ? "Publish" : "Redact"}
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">"{rev.comment}"</p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center text-muted-foreground">
                            <p className="font-bold uppercase tracking-widest text-xs">No reviews found in the audit queue.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
