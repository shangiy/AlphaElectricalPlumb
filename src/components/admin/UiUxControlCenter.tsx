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
  Plus,
  Settings2,
  Eye,
  GripVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FeaturedProductManager from './FeaturedProductManager';
import CategoryManager from './CategoryManager';
import HeroSearch from '@/components/common/HeroSearch';
import HeroManager from './HeroManager';
import { getStorefrontSetting, updateStorefrontSetting, type HeroSlide } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const STYLE_OPTIONS = [
    { id: 'kenyan-flag', label: '🇰🇪 Kenyan Flag Colors' },
    { id: 'gold-gradient', label: '✨ Luxury Gold Gradient' },
    { id: 'neon-glow', label: '⚡ Electric Neon Blue' },
    { id: 'fire-emoji', label: '🔥 Fire & Energy Mode' }
];

export const ORIENTATION_OPTIONS = [
    { id: 'horizontal', label: '➡️ Horizontal Flow' },
    { id: 'vertical', label: '⬇️ Vertical Flow' },
    { id: 'diagonal', label: '↘️ Diagonal Drift' },
    { id: 'text-clip', label: '✨ Clipped to Text (Vibrant)' }
];

export const TEXT_STYLE_OPTIONS = [
    { id: 'normal', label: 'Standard' },
    { id: 'italic', label: 'Italic' },
    { id: 'bold', label: 'Bold' }
];

interface HighlighterRule { word: string; colors: string[]; }

interface BannerConfig {
    items: string[];
    speed: number;
    fontSize: number;
    textColor: string;
    styleType: string;
    styleOrientation?: string;
    showClock: boolean;
    showSocial: boolean;
    highlighters?: HighlighterRule[];
    badgeText?: string;
    halloweenText?: string;
    halloweenStyleType?: string;
    halloweenOrientation?: string;
    halloweenTextStyle?: string;
    holidayText?: string;
    holidayStyleType?: string;
    holidayOrientation?: string;
    holidayTextStyle?: string;
    vibrantText?: string;
    vibrantStyleType?: string;
    vibrantOrientation?: string;
    vibrantTextStyle?: string;
    vibrantText2?: string;
    vibrantStyleType2?: string;
    vibrantOrientation2?: string;
    vibrantTextStyle2?: string;
}

const DEFAULT_BANNER: BannerConfig = {
    items: ["MASHUJAA DAY OFFER! 20% OFF", "Welcome to Alpha Ecosystem v4.3.0"],
    speed: 30, fontSize: 12, textColor: '#ffffff',
    styleType: 'kenyan-flag', styleOrientation: 'horizontal',
    showClock: true, showSocial: true, highlighters: []
};

function SortableSearchPhrase({ phrase, id, onRemove }: { phrase: string, id: string, onRemove: (phrase: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Translate.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-secondary px-5 py-3 rounded-2xl border hover:border-primary/40 transition-all">
            <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground"><GripVertical size={16} /></button>
            <span className="text-sm font-bold">{phrase}</span>
            <button onClick={() => onRemove(phrase)} className="text-red-500 ml-2"><Trash2 size={14} /></button>
        </div>
    );
}

export default function UiUxControlCenter() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'topbanner';
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(DEFAULT_BANNER);
  const [searchPhrases, setSearchPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [search, bannerSet] = await Promise.all([
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('top_banner_config'),
      ]);
      if (search) setSearchPhrases(search);
      if (bannerSet) setBannerConfig(prev => ({ ...prev, ...bannerSet }));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAllSettings(); }, [loadAllSettings]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`/admin/featured?${params.toString()}`, { scroll: false });
  };

  const handleSaveBanner = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('top_banner_config', bannerConfig);
        toast({ title: "v4.3.0 Published", description: "Banner engine synchronized." });
    } catch (err: any) { toast({ variant: "destructive", description: err.message }); } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black font-headline text-accent tracking-tighter uppercase">Alpha CMS Suite</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Professional Storefront Governance v4.3.0</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto bg-muted/30 p-2 rounded-[2.5rem] mb-12 border">
            <TabsTrigger value="topbanner" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Banner CMS</TabsTrigger>
            <TabsTrigger value="search" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Search Keywords</TabsTrigger>
            <TabsTrigger value="hero" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Hero Edit</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Product Carousel</TabsTrigger>
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Spotlight</TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="topbanner" className="space-y-8">
            <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
                <CardHeader className="bg-accent text-white p-8">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Banner Engine v4.3.0</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase">Vibrant Event Text</Label>
                            <Input value={bannerConfig.vibrantText || ''} onChange={(e) => setBannerConfig({...bannerConfig, vibrantText: e.target.value})} placeholder="e.g. MASHUJAA" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase">Accent Highlight</Label>
                            <Input value={bannerConfig.vibrantText2 || ''} onChange={(e) => setBannerConfig({...bannerConfig, vibrantText2: e.target.value})} placeholder="e.g. NEW UPDATE" />
                        </div>
                    </div>
                    <Button onClick={handleSaveBanner} disabled={submitting} className="w-full h-16 rounded-full font-black text-xl uppercase bg-primary text-white">
                        {submitting ? <Loader2 className="animate-spin mr-3" /> : <Save className="mr-3" />}
                        Sync v4.3.0 Engine
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-8">
            <Card className="rounded-[2.5rem] border shadow-2xl p-8">
                <div className="flex gap-3 mb-8">
                    <Input value={newPhrase} onChange={(e) => setNewPhrase(e.target.value)} placeholder="Add keyword..." className="h-14 rounded-2xl font-bold" />
                    <Button onClick={() => { if(newPhrase && !searchPhrases.includes(newPhrase)) { setSearchPhrases([...searchPhrases, newPhrase]); setNewPhrase(''); } }}>Add</Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => { if (e.over && e.active.id !== e.over.id) { setSearchPhrases(items => arrayMove(items, items.indexOf(e.active.id as string), items.indexOf(e.over.id as string))); } }}>
                    <SortableContext items={searchPhrases} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-3 p-6 bg-muted/20 rounded-[2rem] border border-dashed">
                            {searchPhrases.map(p => <SortableSearchPhrase key={p} id={p} phrase={p} onRemove={(val) => setSearchPhrases(searchPhrases.filter(i => i !== val))} />)}
                        </div>
                    </SortableContext>
                </DndContext>
                <Button onClick={() => updateStorefrontSetting('search_phrases', searchPhrases)} className="w-full h-14 rounded-full font-black uppercase bg-primary text-white mt-8">Sync Placeholder Sequence</Button>
            </Card>
        </TabsContent>

        <TabsContent value="hero"><HeroManager initialSlides={[]} /></TabsContent>
        <TabsContent value="categories"><CategoryManager initialCards={[]} /></TabsContent>
        <TabsContent value="spotlight"><FeaturedProductManager /></TabsContent>
      </Tabs>
    </div>
  );
}
