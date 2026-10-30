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
import { 
  Loader2, 
  Palette, 
  Type, 
  LayoutGrid, 
  GripVertical, 
  Trash2, 
  Plus, 
  Save, 
  Monitor,
  Sparkles,
  MessageSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FeaturedProductManager from './FeaturedProductManager';
import CategoryManager, { type CategoryCardData } from './CategoryManager';
import { 
  getStorefrontSetting, 
  updateStorefrontSetting,
  toggleReviewVisibility
} from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';

/**
 * Storefront CMS Suite v3.0
 * Intelligent hub for managing every aspect of the storefront experience.
 */
export default function UiUxControlCenter() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Hero Carousel State
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  
  // Search State
  const [searchPhrases, setSearchPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');

  // Category Manager State
  const [categoryCards, setCategoryCards] = useState<CategoryCardData[]>([]);

  // About Content State
  const [aboutContent, setAboutContent] = useState({ text: '', alignment: 'center', fontSize: 'lg' });

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [hero, search, about, cats] = await Promise.all([
        getStorefrontSetting('hero_slides'),
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('about_us_content'),
        getStorefrontSetting('category_cards')
      ]);
      
      if (hero) setHeroSlides(hero);
      if (search) setSearchPhrases(search);
      if (about) setAboutContent(about);
      if (cats) setCategoryCards(cats);

      // Load reviews for moderation
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

  const handleSaveAbout = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('about_us_content', aboutContent);
        toast({ title: "Copy Synchronized", description: "About Us content updated." });
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
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-widest">Live Preview Ready</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-muted/30 p-2 rounded-[2.5rem] mb-12 border shadow-inner">
            <TabsTrigger value="hero" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Hero Banners</TabsTrigger>
            <TabsTrigger value="search" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Search CMS</TabsTrigger>
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Spotlight</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Category CMS</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-accent">Hero Carousel Management</h3>
                    <Button onClick={handleSaveHero} disabled={submitting} className="rounded-full h-12 px-8 bg-primary font-black uppercase tracking-tighter">
                        {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                        Publish Slides
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
                            <Button onClick={() => { setSearchPhrases([...searchPhrases, newPhrase]); setNewPhrase(''); }} className="h-14 rounded-2xl px-8 font-black uppercase">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {searchPhrases.map((phrase, i) => (
                                <div key={i} className="flex items-center gap-3 bg-secondary px-5 py-3 rounded-2xl border shadow-sm group">
                                    <span className="text-base font-bold text-accent">{phrase}</span>
                                    <button onClick={() => setSearchPhrases(searchPhrases.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-500">
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

        <TabsContent value="about">
            <div className="max-w-3xl mx-auto space-y-8">
                <Card className="rounded-[3rem] border shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-muted/30 p-10 border-b">
                        <CardTitle className="text-3xl font-black uppercase tracking-tight text-accent">About Us Content</CardTitle>
                        <CardDescription className="font-bold text-primary uppercase tracking-[0.2em] text-[10px] mt-2">Manage the narrative of your brand ecosystem</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Main Body Text</Label>
                            <Textarea 
                                value={aboutContent.text} 
                                onChange={(e) => setAboutContent({...aboutContent, text: e.target.value})} 
                                rows={10}
                                className="rounded-3xl p-6 text-lg font-medium leading-relaxed resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Text Alignment</Label>
                                <div className="flex gap-2 bg-muted p-2 rounded-2xl w-fit">
                                    <Button variant={aboutContent.alignment === 'left' ? 'default' : 'ghost'} size="icon" onClick={() => setAboutContent({...aboutContent, alignment: 'left'})} className="rounded-xl"><AlignLeft size={20}/></Button>
                                    <Button variant={aboutContent.alignment === 'center' ? 'default' : 'ghost'} size="icon" onClick={() => setAboutContent({...aboutContent, alignment: 'center'})} className="rounded-xl"><AlignCenter size={20}/></Button>
                                    <Button variant={aboutContent.alignment === 'right' ? 'default' : 'ghost'} size="icon" onClick={() => setAboutContent({...aboutContent, alignment: 'right'})} className="rounded-xl"><AlignRight size={20}/></Button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Font Size Scale</Label>
                                <div className="flex gap-2 bg-muted p-2 rounded-2xl w-fit">
                                    {['sm', 'base', 'lg', 'xl'].map(size => (
                                        <Button key={size} variant={aboutContent.fontSize === size ? 'default' : 'ghost'} onClick={() => setAboutContent({...aboutContent, fontSize: size})} className="rounded-xl font-black uppercase text-[10px]">{size}</Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleSaveAbout} disabled={submitting} className="w-full h-16 rounded-full font-black uppercase tracking-widest bg-accent text-white shadow-2xl">
                           Commit Copy Changes
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="reviews">
            <ReviewModerationSuite reviews={reviews} onRefresh={loadAllSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroSlideManager({ slides, setSlides }: { slides: any[], setSlides: (s: any[]) => void }) {
    const handleAddSlide = () => {
        const newSlide = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New High-Rise Headline',
            subtitle: 'Compelling subtext for your clients.',
            ctaText: 'EXPLORE',
            ctaLink: '/search',
            imageUrl: '/background.jpg',
            active: true
        };
        setSlides([...slides, newSlide]);
    };

    const handleUpdateSlide = (id: string, updates: any) => {
        setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const handleDeleteSlide = (id: string) => {
        setSlides(slides.filter(s => s.id !== id));
    };

    return (
        <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {slides.map((slide, i) => (
                    <Card key={slide.id} className={cn("rounded-[2.5rem] border shadow-xl overflow-hidden group transition-all", !slide.active && "opacity-60 grayscale")}>
                        <div className="relative h-48 bg-muted overflow-hidden">
                            <img src={slide.imageUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Switch checked={slide.active} onCheckedChange={(val) => handleUpdateSlide(slide.id, { active: val })} />
                                <button onClick={() => handleDeleteSlide(slide.id)} className="bg-red-500 text-white p-2 rounded-xl shadow-lg hover:bg-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                Slide #{i + 1}
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Headline Text</Label>
                                    <Input value={slide.title} onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })} className="font-black text-lg h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Subheading</Label>
                                    <Input value={slide.subtitle} onChange={(e) => handleUpdateSlide(slide.id, { subtitle: e.target.value })} className="font-bold h-12 rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Button Text</Label>
                                        <Input value={slide.ctaText} onChange={(e) => handleUpdateSlide(slide.id, { ctaText: e.target.value })} className="font-black rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Link</Label>
                                        <Input value={slide.ctaLink} onChange={(e) => handleUpdateSlide(slide.id, { ctaLink: e.target.value })} className="font-bold rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Button variant="outline" onClick={handleAddSlide} className="w-full h-20 rounded-[2rem] border-2 border-dashed font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 hover:border-primary transition-all">
                <Plus className="mr-2 h-6 w-6" /> Add New Hero Slide
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
            toast({ title: !current ? "Review Redacted" : "Review Restored", description: "Public storefront updated." });
            onRefresh();
        } catch (e) {
            toast({ variant: "destructive", title: "Action Failed" });
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
                    {reviews.map(rev => (
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
                                        <h4 className="font-black text-accent uppercase tracking-tight">{rev.title}</h4>
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
                                            onClick={() => handleToggle(rev.id, rev.is_hidden)}
                                            className="rounded-xl h-9 px-4 font-black uppercase text-[9px]"
                                        >
                                            {modulating === rev.id ? <Loader2 className="animate-spin h-3 w-3" /> : (rev.is_hidden ? <Eye className="mr-2 h-3 w-3" /> : <EyeOff className="mr-2 h-3 w-3" />)}
                                            {rev.is_hidden ? "Publish" : "Redact"}
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed italic">"{rev.comment}"</p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{rev.review_type} placement</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

