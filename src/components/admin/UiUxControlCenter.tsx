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
  GripVertical,
  BookOpen,
  Paintbrush
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

interface BannerItem {
    text: string;
    color: string;
}

interface HighlighterRule { word: string; colors: string[]; }

interface BannerConfig {
    items: string[];
    coloredItems?: BannerItem[];
    speed: number;
    fontSize: number;
    textColor: string;
    styleType: string;
    styleOrientation?: string;
    showClock: boolean;
    showSocial: boolean;
    highlighters?: HighlighterRule[];
    badgeText?: string;
    vibrantText?: string;
    vibrantStyleType?: string;
    vibrantOrientation?: string;
    vibrantTextStyle?: string;
    vibrantText2?: string;
    vibrantStyleType2?: string;
    vibrantOrientation2?: string;
    vibrantTextStyle2?: string;
    vibrantText3?: string;
    vibrantStyleType3?: string;
    vibrantOrientation3?: string;
    vibrantTextStyle3?: string;
    vibrantText4?: string;
    vibrantStyleType4?: string;
    vibrantOrientation4?: string;
    vibrantTextStyle4?: string;
}

const DEFAULT_BANNER: BannerConfig = {
    items: ["MASHUJAA DAY OFFER! 20% OFF", "Welcome to Alpha Ecosystem v4.3.5"],
    coloredItems: [
        { text: "MASHUJAA DAY OFFER! 20% OFF", color: "#ffffff" },
        { text: "Welcome to Alpha Ecosystem v4.3.5", color: "#ffffff" }
    ],
    speed: 30, fontSize: 12, textColor: '#ffffff',
    styleType: 'kenyan-flag', styleOrientation: 'horizontal',
    showClock: true, showSocial: true, highlighters: [],
    vibrantText: '', vibrantStyleType: 'kenyan-flag', vibrantOrientation: 'vertical', vibrantTextStyle: 'bold',
    vibrantText2: '', vibrantStyleType2: 'gold-gradient', vibrantOrientation2: 'horizontal', vibrantTextStyle2: 'bold',
    vibrantText3: '', vibrantStyleType3: 'neon-glow', vibrantOrientation3: 'vertical', vibrantTextStyle3: 'bold',
    vibrantText4: '', vibrantStyleType4: 'fire-emoji', vibrantOrientation4: 'horizontal', vibrantTextStyle4: 'bold'
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
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [newPhrase, setNewPhrase] = useState('');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [search, bannerSet, slides] = await Promise.all([
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('top_banner_config'),
        getStorefrontSetting('hero_slides'),
      ]);
      if (search) setSearchPhrases(search);
      if (bannerSet) {
          const config = {
              ...DEFAULT_BANNER,
              ...bannerSet
          };
          if (!config.coloredItems || config.coloredItems.length === 0) {
              config.coloredItems = config.items.map((text: string) => ({ text, color: '#ffffff' }));
          }
          setBannerConfig(config);
      }
      if (slides) setHeroSlides(slides);
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
        toast({ title: "v4.3.5 Published", description: "Banner engine synchronized." });
    } catch (err: any) { toast({ variant: "destructive", description: err.message }); } finally { setSubmitting(false); }
  };

  const handleSearchPhraseDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setSearchPhrases((items) => {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over.id as string);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const updateMarqueeItems = (val: string) => {
    const rawItems = val.split(',').map(i => i.trim()).filter(Boolean);
    const newColoredItems = rawItems.map(text => {
        const existing = bannerConfig.coloredItems?.find(ci => ci.text === text);
        return existing || { text, color: '#ffffff' };
    });
    setBannerConfig({ ...bannerConfig, items: rawItems, coloredItems: newColoredItems });
  };

  const renderStyledBadgeText = (text: string, styleType: string, orientation: string, textStyle: string = "normal") => {
    if (!text) return null;
    
    const isKenyanFlag = styleType === 'kenyan-flag';
    const isVertical = orientation === 'vertical';

    if (isKenyanFlag && isVertical) {
      const upper = text.toUpperCase();
      let p1 = "", p2 = "", p3 = "";
      
      if (upper === "MASHUJAA") {
        p1 = "MA"; p2 = "SHU"; p3 = "JAA";
      } else {
        const len = text.length;
        const s1 = Math.max(1, Math.ceil(len * 0.25));
        const s2 = Math.max(s1 + 1, Math.ceil(len * 0.65));
        p1 = text.substring(0, s1);
        p2 = text.substring(s1, s2);
        p3 = text.substring(s2);
      }

      const styleClasses = cn(
        "font-black uppercase tracking-tight flex items-center",
        textStyle === 'italic' && 'italic',
        textStyle === 'bold' && 'font-black'
      );

      return (
        <span className={styleClasses}>
          <span className="text-black">{p1}</span>
          <span className="text-red-600">{p2}</span>
          <span className="text-green-600">{p3}</span>
        </span>
      );
    }

    const getColors = (type: string) => {
        switch(type) {
            case 'kenyan-flag': return 'from-black via-red-600 to-green-600';
            case 'gold-gradient': return 'from-yellow-600 via-amber-500 to-yellow-800';
            case 'neon-glow': return 'from-cyan-400 via-blue-500 to-indigo-600';
            case 'fire-emoji': return 'from-orange-600 via-red-600 to-yellow-500';
            default: return 'from-primary via-primary/80 to-primary';
        }
    };

    return (
      <span className={cn(
          "font-black bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%] uppercase whitespace-nowrap bg-gradient-to-r",
          getColors(styleType),
          textStyle === 'italic' && 'italic',
          textStyle === 'bold' && 'font-black'
      )}>
          {text}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black font-headline text-accent tracking-tighter uppercase">Alpha CMS Suite</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Professional Storefront Governance v4.3.5</p>
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
            {/* Real-time Preview */}
            <Card className="rounded-[2.5rem] border shadow-2xl bg-accent text-white overflow-hidden sticky top-24 z-30">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Engine Sync Active</p>
                        <h3 className="text-xl font-black uppercase">Real-time Engine Preview</h3>
                    </div>
                    <Badge className="bg-primary">v4.3.5 LIVE</Badge>
                </div>
                <div className="bg-white py-3 flex items-center justify-center overflow-hidden">
                    <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                        {[0,1].map(i => (
                            <div key={i} className="flex items-center gap-8">
                                {bannerConfig.vibrantText && <span>{renderStyledBadgeText(bannerConfig.vibrantText, bannerConfig.vibrantStyleType || 'kenyan-flag', bannerConfig.vibrantOrientation || 'vertical', bannerConfig.vibrantTextStyle)}</span>}
                                {bannerConfig.vibrantText2 && <span>{renderStyledBadgeText(bannerConfig.vibrantText2, bannerConfig.vibrantStyleType2 || 'gold-gradient', bannerConfig.vibrantOrientation2 || 'horizontal', bannerConfig.vibrantTextStyle2)}</span>}
                                {bannerConfig.vibrantText3 && <span>{renderStyledBadgeText(bannerConfig.vibrantText3, bannerConfig.vibrantStyleType3 || 'neon-glow', bannerConfig.vibrantOrientation3 || 'vertical', bannerConfig.vibrantTextStyle3)}</span>}
                                {bannerConfig.vibrantText4 && <span>{renderStyledBadgeText(bannerConfig.vibrantText4, bannerConfig.vibrantStyleType4 || 'fire-emoji', bannerConfig.vibrantOrientation4 || 'horizontal', bannerConfig.vibrantTextStyle4)}</span>}
                                
                                {bannerConfig.coloredItems && bannerConfig.coloredItems.length > 0 ? (
                                    bannerConfig.coloredItems.map((item, idx) => (
                                        <span key={idx} className="font-bold uppercase tracking-widest text-[12px]" style={{ color: item.color || '#28235f' }}>{item.text}</span>
                                    ))
                                ) : (
                                    <span className="text-accent font-bold uppercase tracking-widest text-[12px]">{bannerConfig.items[0]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
                <CardHeader className="bg-accent text-white p-8">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Banner Engine v4.3.5</CardTitle>
                    <CardDescription className="text-white/60">Configure the master announcement marquee and assign individual colors.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase">Marquee Items (Comma Separated)</Label>
                        <Textarea 
                            value={bannerConfig.items.join(', ')} 
                            onChange={(e) => updateMarqueeItems(e.target.value)}
                            className="rounded-2xl h-24 font-bold"
                            placeholder="MASHUJAA DAY, FLASH SALE, NEW STOCK"
                        />
                    </div>

                    {/* DYNAMIC COLOR-MAPPED ROW GENERATOR */}
                    {bannerConfig.coloredItems && bannerConfig.coloredItems.length > 0 && (
                        <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-dashed border-accent/20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-3 mb-2">
                                <Paintbrush className="text-accent h-5 w-5" />
                                <h3 className="text-sm font-black text-accent uppercase tracking-widest">Marquee Item Stylizer</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bannerConfig.coloredItems.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-3 p-5 bg-white rounded-2xl border shadow-sm group hover:border-primary transition-all">
                                        <div className="flex items-center justify-between overflow-hidden gap-2">
                                            <div className="flex-1">
                                                <Input 
                                                    value={item.text} 
                                                    onChange={(e) => {
                                                        const newColored = [...(bannerConfig.coloredItems || [])];
                                                        newColored[idx].text = e.target.value;
                                                        const newItems = newColored.map(ci => ci.text);
                                                        setBannerConfig({ ...bannerConfig, items: newItems, coloredItems: newColored });
                                                    }}
                                                    placeholder="Item text or emoji"
                                                    className="h-8 rounded-lg text-[10px] font-bold bg-muted/20 border-none focus:bg-white transition-all uppercase"
                                                />
                                            </div>
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase shrink-0">Slot {idx + 1}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="color" 
                                                value={item.color || '#ffffff'} 
                                                onChange={(e) => {
                                                    const newColored = [...(bannerConfig.coloredItems || [])];
                                                    newColored[idx].color = e.target.value;
                                                    setBannerConfig({ ...bannerConfig, coloredItems: newColored });
                                                }}
                                                className="h-10 w-10 rounded-xl cursor-pointer border-none shadow-inner"
                                            />
                                            <div className="flex-1">
                                                <Input 
                                                    value={item.color || '#ffffff'} 
                                                    onChange={(e) => {
                                                        const newColored = [...(bannerConfig.coloredItems || [])];
                                                        newColored[idx].color = e.target.value;
                                                        setBannerConfig({ ...bannerConfig, coloredItems: newColored });
                                                    }}
                                                    className="h-8 rounded-lg font-mono text-[10px] uppercase bg-muted/20 border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QUAD-SLOT VIBRANT ENGINE */}
                    <div className="space-y-12">
                        {/* Slot 1 & 2 Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-dashed border-accent/20 space-y-6">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">Highlight Slot 1</Label>
                                <div className="space-y-4">
                                    <Input value={bannerConfig.vibrantText || ''} onChange={(e) => setBannerConfig({...bannerConfig, vibrantText: e.target.value})} placeholder="Text or Emoji" className="h-12 rounded-xl" />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <select value={bannerConfig.vibrantStyleType || 'kenyan-flag'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantStyleType: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantOrientation || 'vertical'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantOrientation: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantTextStyle || 'bold'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantTextStyle: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-dashed border-accent/20 space-y-6">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">Highlight Slot 2</Label>
                                <div className="space-y-4">
                                    <Input value={bannerConfig.vibrantText2 || ''} onChange={(e) => setBannerConfig({...bannerConfig, vibrantText2: e.target.value})} placeholder="Text or Emoji" className="h-12 rounded-xl" />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <select value={bannerConfig.vibrantStyleType2 || 'gold-gradient'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantStyleType2: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantOrientation2 || 'horizontal'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantOrientation2: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantTextStyle2 || 'bold'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantTextStyle2: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slot 3 & 4 Row (NEW) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-dashed border-accent/20 space-y-6">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">Highlight Slot 3</Label>
                                <div className="space-y-4">
                                    <Input value={bannerConfig.vibrantText3 || ''} onChange={(e) => setBannerConfig({...bannerConfig, vibrantText3: e.target.value})} placeholder="Text or Emoji" className="h-12 rounded-xl" />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <select value={bannerConfig.vibrantStyleType3 || 'neon-glow'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantStyleType3: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantOrientation3 || 'vertical'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantOrientation3: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantTextStyle3 || 'bold'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantTextStyle3: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-dashed border-accent/20 space-y-6">
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">Highlight Slot 4</Label>
                                <div className="space-y-4">
                                    <Input value={bannerConfig.vibrantText4 || ''} onChange={(e) => setBannerConfig({...bannerConfig, vibrantText4: e.target.value})} placeholder="Text or Emoji" className="h-12 rounded-xl" />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <select value={bannerConfig.vibrantStyleType4 || 'fire-emoji'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantStyleType4: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantOrientation4 || 'horizontal'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantOrientation4: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                        <select value={bannerConfig.vibrantTextStyle4 || 'bold'} onChange={(e) => setBannerConfig({...bannerConfig, vibrantTextStyle4: e.target.value})} className="h-10 rounded-lg border px-2 text-[10px] font-bold">
                                            {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleSaveBanner} disabled={submitting} className="w-full h-16 rounded-full font-black text-xl uppercase bg-primary text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                        {submitting ? <Loader2 className="animate-spin mr-3" /> : <Save className="mr-3" />}
                        Sync v4.3.5 Engine
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-8">
            <Card className="rounded-[2.5rem] border shadow-2xl p-8">
                <div className="flex gap-3 mb-8">
                    <Input 
                        value={newPhrase} 
                        onChange={(e) => setNewPhrase(e.target.value)} 
                        placeholder="Add keyword..." 
                        className="h-14 rounded-2xl font-bold" 
                    />
                    <Button onClick={() => { 
                        if(newPhrase && !searchPhrases.includes(newPhrase)) { 
                            setSearchPhrases([...searchPhrases, newPhrase]); 
                            setNewPhrase(''); 
                        } else if (searchPhrases.includes(newPhrase)) {
                            toast({ variant: 'destructive', description: 'Keyword already exists in cluster.' });
                        }
                    }}>Add</Button>
                </div>
                
                <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleSearchPhraseDragEnd}
                >
                    <SortableContext items={searchPhrases} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-3 p-6 bg-muted/20 rounded-[2rem] border border-dashed">
                            {searchPhrases.map(p => (
                                <SortableSearchPhrase 
                                    key={p} 
                                    id={p} 
                                    phrase={p} 
                                    onRemove={(val) => setSearchPhrases(searchPhrases.filter(i => i !== val))} 
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                
                <Button onClick={() => updateStorefrontSetting('search_phrases', searchPhrases)} className="w-full h-14 rounded-full font-black uppercase bg-primary text-white mt-8">Sync Placeholder Sequence</Button>
            </Card>
        </TabsContent>

        <TabsContent value="hero"><HeroManager initialSlides={heroSlides} /></TabsContent>
        <TabsContent value="categories"><CategoryManager initialCards={[]} /></TabsContent>
        <TabsContent value="spotlight"><FeaturedProductManager /></TabsContent>
        <TabsContent value="moderation" className="space-y-8">
            <Card className="rounded-[2.5rem] border shadow-xl p-10 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter text-accent">Review Moderation Node</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">Manage customer feedback visibility and site testimonials.</p>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

