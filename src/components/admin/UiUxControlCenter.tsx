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
  Save, 
  Sparkles,
  Zap,
  Type
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FeaturedProductManager from './FeaturedProductManager';
import CategoryManager, { type CategoryCardData } from './CategoryManager';
import { 
  getStorefrontSetting, 
  updateStorefrontSetting,
  type HeroSlide
} from '@/app/actions/cms-actions';

export const STYLE_OPTIONS = [
    { id: 'kenyan-flag', label: '🇰🇪 Kenyan Flag Colors' },
    { id: 'gold-gradient', label: '✨ Luxury Gold Gradient' },
    { id: 'neon-glow', label: '⚡ Electric Neon Blue' },
    { id: 'fire-emoji', label: '🔥 Fire & Energy Mode' }
];

export default function UiUxControlCenter() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get('tab') || 'topbanner';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Banner Details State
  const [bannerConfig, setBannerConfig] = useState({
      items: ["OFFER! OFFER! OFFER! Easter Holiday OFFER", "Feel welcomed to Shop with us @best prices"],
      speed: 30,
      fontSize: 16,
      textColor: '#ffffff',
      styleType: 'kenyan-flag',
      showClock: true,
      showSocial: true
  });

  const [searchPhrases, setSearchPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [search, bannerSet] = await Promise.all([
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('top_banner_config'),
      ]);
      
      if (search) setSearchPhrases(search);
      if (bannerSet) setBannerConfig(bannerSet);
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

  const handleSaveBanner = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('top_banner_config', bannerConfig);
        toast({ title: "Banner Details Published", description: "Holiday marquee has been updated live." });
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
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Professional Storefront Governance v4.0</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-muted/30 p-2 rounded-[2.5rem] mb-12 border shadow-inner">
            <TabsTrigger value="topbanner" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Banner CMS</TabsTrigger>
            <TabsTrigger value="search" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Search Keywords</TabsTrigger>
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Spotlight</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Collections</TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="topbanner">
            <div className="max-w-5xl mx-auto space-y-12">
                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-accent text-white p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-primary h-6 w-6" />
                            <CardTitle className="text-2xl font-black uppercase tracking-tight">Banner Engineering</CardTitle>
                        </div>
                        <CardDescription className="text-white/60 font-medium">Control the typography, style, pace, and items of the announcement marquee.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Marquee Items (Separate by comma)</Label>
                            <Textarea 
                                value={bannerConfig.items.join(', ')} 
                                onChange={(e) => setBannerConfig({...bannerConfig, items: e.target.value.split(',').map(s => s.trim())})}
                                className="min-h-[100px] rounded-2xl p-4 font-bold text-lg shadow-inner bg-muted/10 border-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Font Size (px)</Label>
                                <Input 
                                    type="number" 
                                    value={bannerConfig.fontSize} 
                                    onChange={(e) => setBannerConfig({...bannerConfig, fontSize: parseInt(e.target.value) || 16})}
                                    className="h-12 rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Pace (Duration in seconds)</Label>
                                <Input 
                                    type="number" 
                                    value={bannerConfig.speed} 
                                    onChange={(e) => setBannerConfig({...bannerConfig, speed: parseInt(e.target.value) || 30})}
                                    className="h-12 rounded-xl font-bold"
                                />
                                <p className="text-[9px] text-muted-foreground">Lower = Faster rotation</p>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Text Color</Label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={bannerConfig.textColor} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, textColor: e.target.value})}
                                        className="h-12 w-12 rounded-xl cursor-pointer"
                                    />
                                    <Input value={bannerConfig.textColor} readOnly className="h-12 rounded-xl font-mono uppercase" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Visual Style Engine</Label>
                                <select 
                                    value={bannerConfig.styleType} 
                                    onChange={(e) => setBannerConfig({...bannerConfig, styleType: e.target.value})}
                                    className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                >
                                    {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-6 pt-6">
                                <div className="flex items-center gap-3">
                                    <Switch checked={bannerConfig.showClock} onCheckedChange={(val) => setBannerConfig({...bannerConfig, showClock: val})} />
                                    <Label className="text-[10px] font-black uppercase">Clock Module</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Switch checked={bannerConfig.showSocial} onCheckedChange={(val) => setBannerConfig({...bannerConfig, showSocial: val})} />
                                    <Label className="text-[10px] font-black uppercase">TikTok Social</Label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Type className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Pill Trigger Logic</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                                Tip: Use keywords <span className="font-bold text-accent">MASHUJAA</span> or <span className="font-bold text-[#00c389]">OFFER!</span> in your text to trigger special visual pills and colors as per branding guidelines.
                            </p>
                        </div>

                        <Button onClick={handleSaveBanner} disabled={submitting} className="w-full h-16 rounded-full font-black text-xl uppercase bg-primary text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                            {submitting ? <Loader2 className="animate-spin mr-3" /> : <Save className="mr-3" />}
                            Sync Banner Cluster
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="search">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-accent text-white p-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-primary h-6 w-6" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Search Placeholders</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex gap-3">
                            <Input value={newPhrase} onChange={(e) => setNewPhrase(e.target.value)} placeholder="Add industrial keyword" className="h-14 rounded-2xl text-lg font-bold" />
                            <Button onClick={() => { if(newPhrase) { setSearchPhrases([...searchPhrases, newPhrase]); setNewPhrase(''); } }}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {searchPhrases.map((phrase, i) => (
                                <div key={i} className="flex items-center gap-3 bg-secondary px-5 py-3 rounded-2xl border">
                                    <span className="text-base font-bold text-accent">{phrase}</span>
                                    <button onClick={() => setSearchPhrases(searchPhrases.filter((_, idx) => idx !== i))}><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => updateStorefrontSetting('search_phrases', searchPhrases)} className="w-full h-14 rounded-full font-black uppercase bg-primary text-white mt-4 shadow-xl">Sync Keywords</Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="spotlight"><FeaturedProductManager /></TabsContent>
        <TabsContent value="categories"><CategoryManager initialCards={[]} /></TabsContent>
      </Tabs>
    </div>
  );
}
