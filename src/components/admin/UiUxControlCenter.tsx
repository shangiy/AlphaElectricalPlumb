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
  Paintbrush,
  MoveHorizontal,
  Type,
  Activity,
  Youtube,
  Share2,
  Video
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

export const BOLDNESS_OPTIONS = [
    { id: 'font-light', label: 'Light' },
    { id: 'font-normal', label: 'Normal' },
    { id: 'font-semibold', label: 'SemiBold' },
    { id: 'font-bold', label: 'Bold' },
    { id: 'font-black', label: 'Black' }
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
    fontWeight?: string;
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
    bgType?: 'white' | 'blue' | 'red' | 'dynamic' | 'vibrant';
    gradientDirection?: 'left' | 'right';
}

const DEFAULT_BANNER: BannerConfig = {
    items: ["OFFER", "OFFER", "OFFER", "NOVEMBER Flash SALES!"],
    coloredItems: [
        { text: "OFFER", color: "#ffffff" },
        { text: "OFFER", color: "#ffffff" },
        { text: "OFFER", color: "#ffffff" },
        { text: "NOVEMBER Flash SALES!", color: "#ffffff" }
    ],
    speed: 30,
    fontSize: 12,
    fontWeight: 'font-bold',
    textColor: '#ffffff',
    styleType: 'kenyan-flag',
    styleOrientation: 'horizontal',
    showClock: true,
    showSocial: true,
    highlighters: [],
    vibrantText: '',
    vibrantStyleType: 'kenyan-flag',
    vibrantOrientation: 'vertical',
    vibrantTextStyle: 'bold',
    vibrantText2: '',
    vibrantStyleType2: 'gold-gradient',
    vibrantOrientation2: 'horizontal',
    vibrantTextStyle2: 'bold',
    vibrantText3: '',
    vibrantStyleType3: 'neon-glow',
    vibrantOrientation3: 'vertical',
    vibrantTextStyle3: 'bold',
    vibrantText4: '',
    vibrantStyleType4: 'fire-emoji',
    vibrantOrientation4: 'horizontal',
    vibrantTextStyle4: 'bold',
    bgType: 'dynamic',
    gradientDirection: 'left'
};

interface SocialLink {
    platform: string;
    label: string;
    url: string;
}

interface ConnectConfig {
    headline: string;
    subheading: string;
    tiktokVideoIds: string[];
    socialLinks: SocialLink[];
}

const DEFAULT_CONNECT: ConnectConfig = {
    headline: "Connect with us!",
    subheading: "As You Enquire or make purchases",
    tiktokVideoIds: ["7506475821771640070", "7496094826002222342"],
    socialLinks: [
        { platform: "tiktok", label: "FOLLOW US ON TIKTOK →", url: "https://www.tiktok.com/@AlphaElectricalsandplumb" },
        { platform: "facebook", label: "LIKE US ON FACEBOOK →", url: "https://www.facebook.com/Alphaelectricalsandplumbing" }
    ]
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
  const [connectConfig, setConnectConfig] = useState<ConnectConfig>(DEFAULT_CONNECT);
  const [newPhrase, setNewPhrase] = useState('');

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [search, bannerSet, slides, connect] = await Promise.all([
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('top_banner_config'),
        getStorefrontSetting('hero_slides'),
        getStorefrontSetting('connect_with_us_config'),
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
      if (connect) setConnectConfig({ ...DEFAULT_CONNECT, ...connect });
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
        toast({ title: "v4.4.0 Published", description: "Vibrant Spectrum Engine with Ordinal Mapping synchronized." });
    } catch (err: any) { toast({ variant: "destructive", description: err.message }); } finally { setSubmitting(false); }
  };

  const handleSaveConnect = async () => {
    setSubmitting(true);
    try {
        await updateStorefrontSetting('connect_with_us_config', connectConfig);
        toast({ title: "Social Hub Published", description: "Your digital presence node has been synchronized with the storefront." });
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
    const newColoredItems = rawItems.map((text, index) => {
        // Ordinal Mapping: Use the color from the existing item at this same index
        const existing = bannerConfig.coloredItems?.[index];
        return { 
            text, 
            color: existing ? existing.color : '#ffffff' 
        };
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

  const getBannerPreviewBg = () => {
    if (bannerConfig.bgType === 'white') return 'bg-white text-accent border';
    if (bannerConfig.bgType === 'blue') return 'bg-blue-600 text-white';
    if (bannerConfig.bgType === 'red') return 'bg-red-600 text-white';
    if (bannerConfig.bgType === 'vibrant') return 'bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 via-green-500 via-purple-600 to-blue-600 bg-[length:400%_400%] animate-gradient-x text-white';
    return 'bg-accent text-white';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black font-headline text-accent tracking-tighter uppercase">Alpha CMS Suite</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Professional Storefront Governance v4.4.3</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto bg-muted/30 p-2 rounded-[2.5rem] mb-12 border">
            <TabsTrigger value="topbanner" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Banner CMS</TabsTrigger>
            <TabsTrigger value="search" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Search Keywords</TabsTrigger>
            <TabsTrigger value="hero" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Hero Edit</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Product Carousel</TabsTrigger>
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Spotlight</TabsTrigger>
            <TabsTrigger value="social" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Social Hub</TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="topbanner" className="space-y-8">
            {/* Real-time Preview */}
            <Card className={cn("rounded-[2.5rem] border shadow-2xl overflow-hidden sticky top-24 z-30 transition-all duration-500", getBannerPreviewBg())}>
                <div className="p-8 border-b border-black/5 flex justify-between items-center bg-black/5">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Engine Sync Active</p>
                        <h3 className="text-xl font-black uppercase">Real-time Engine Preview</h3>
                    </div>
                    <Badge className="bg-primary text-white border-none">v4.4.0 LIVE</Badge>
                </div>
                <div className={cn(
                    "py-3 flex items-center justify-center overflow-hidden transition-colors",
                    bannerConfig.bgType === 'white' ? 'bg-white' : 
                    bannerConfig.bgType === 'blue' ? 'bg-blue-600' :
                    bannerConfig.bgType === 'red' ? 'bg-red-600' :
                    bannerConfig.bgType === 'vibrant' ? 'bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 via-green-500 via-purple-600 to-blue-600 bg-[length:400%_400%] animate-gradient-x' :
                    'bg-gradient-to-r from-red-600 via-orange-600 via-yellow-600 via-green-600 via-blue-600 via-purple-600 via-pink-600 to-red-600 bg-[length:400%_400%] animate-gradient-x'
                )}
                style={{ direction: bannerConfig.gradientDirection === 'right' ? 'rtl' : 'ltr' }}
                >
                    <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                        {[0,1].map(i => (
                            <div key={i} className="flex items-center gap-8" style={{ direction: 'ltr' }}>
                                {bannerConfig.vibrantText && <span>{renderStyledBadgeText(bannerConfig.vibrantText, bannerConfig.vibrantStyleType || 'kenyan-flag', bannerConfig.vibrantOrientation || 'vertical', bannerConfig.vibrantTextStyle)}</span>}
                                {bannerConfig.vibrantText2 && <span>{renderStyledBadgeText(bannerConfig.vibrantText2, bannerConfig.vibrantStyleType2 || 'gold-gradient', bannerConfig.vibrantOrientation2 || 'horizontal', bannerConfig.vibrantTextStyle2)}</span>}
                                {bannerConfig.vibrantText3 && <span>{renderStyledBadgeText(bannerConfig.vibrantText3, bannerConfig.vibrantStyleType3 || 'neon-glow', bannerConfig.vibrantOrientation3 || 'vertical', bannerConfig.vibrantTextStyle3)}</span>}
                                {bannerConfig.vibrantText4 && <span>{renderStyledBadgeText(bannerConfig.vibrantText4, bannerConfig.vibrantStyleType4 || 'fire-emoji', bannerConfig.vibrantOrientation4 || 'horizontal', bannerConfig.vibrantTextStyle4)}</span>}
                                
                                {bannerConfig.coloredItems?.map((item, idx) => (
                                    <span 
                                        key={idx} 
                                        className={cn("uppercase tracking-widest", bannerConfig.fontWeight || 'font-bold')}
                                        style={{ 
                                            color: bannerConfig.bgType === 'white' && item.color === '#ffffff' ? '#28235f' : item.color,
                                            fontSize: `${bannerConfig.fontSize}px`
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
                <CardHeader className="bg-accent text-white p-8">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Banner Engine v4.4.0</CardTitle>
                    <CardDescription className="text-white/60">Configure atmospheric controls, typography, and spectrum pace. Spacing is normalized by the template list below.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase">Marquee Items (Comma Separated)</Label>
                        <Textarea 
                            value={bannerConfig.items.join(', ')} 
                            onChange={(e) => updateMarqueeItems(e.target.value)}
                            className="rounded-2xl h-24 font-bold"
                            placeholder="OFFER, OFFER, OFFER, NOVEMBER Flash SALES!"
                        />
                    </div>

                    {/* GLOBAL ENGINE CONFIGURATION */}
                    <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-dashed border-accent/20 space-y-10 animate-in fade-in duration-700">
                        <div className="flex items-center gap-3">
                            <Settings2 className="text-accent h-5 w-5" />
                            <h3 className="text-sm font-black text-accent uppercase tracking-widest">Global Engine Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* PACE & TYPOGRAPHY */}
                            <div className="space-y-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block">Pace & Typography</span>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase text-muted-foreground/60 flex items-center gap-1.5"><Activity size={12}/> Motion Pace (Seconds)</Label>
                                        <Input 
                                            type="number" 
                                            value={bannerConfig.speed} 
                                            onChange={(e) => setBannerConfig({...bannerConfig, speed: parseInt(e.target.value) || 0})}
                                            className="h-12 rounded-xl font-black text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-black uppercase text-muted-foreground/60 flex items-center gap-1.5"><Type size={12}/> Font Size (px)</Label>
                                        <Input 
                                            type="number" 
                                            value={bannerConfig.fontSize} 
                                            onChange={(e) => setBannerConfig({...bannerConfig, fontSize: parseInt(e.target.value) || 0})}
                                            className="h-12 rounded-xl font-black text-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60">Character Weight (Thickness)</Label>
                                    <select 
                                        value={bannerConfig.fontWeight || 'font-bold'}
                                        onChange={(e) => setBannerConfig({...bannerConfig, fontWeight: e.target.value})}
                                        className="w-full h-12 rounded-xl border px-3 font-bold bg-white"
                                    >
                                        {BOLDNESS_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* ATMOSPHERIC CONTROLS */}
                            <div className="space-y-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 block">Atmospheric Controls</span>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 flex items-center gap-1.5"><Palette size={12}/> Background Logic</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['white', 'blue', 'red', 'dynamic', 'vibrant'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setBannerConfig({...bannerConfig, bgType: type as any})}
                                                className={cn(
                                                    "h-12 rounded-xl border text-[10px] font-black uppercase transition-all",
                                                    bannerConfig.bgType === type ? "bg-accent text-white border-accent shadow-lg scale-105" : "bg-white text-accent hover:border-accent/40"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {(bannerConfig.bgType === 'dynamic' || bannerConfig.bgType === 'vibrant') && (
                                    <div className="space-y-2 pt-4 border-t border-dashed animate-in slide-in-from-top-2 duration-500">
                                        <Label className="text-[9px] font-black uppercase text-muted-foreground/60 flex items-center gap-1.5"><MoveHorizontal size={12}/> Cloud Flow Direction</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setBannerConfig({...bannerConfig, gradientDirection: 'left'})}
                                                className={cn(
                                                    "h-10 rounded-xl border text-[9px] font-bold uppercase",
                                                    bannerConfig.gradientDirection === 'left' ? "bg-primary text-white" : "bg-white"
                                                )}
                                            >
                                                ⬅️ Left-to-Right
                                            </button>
                                            <button
                                                onClick={() => setBannerConfig({...bannerConfig, gradientDirection: 'right'})}
                                                className={cn(
                                                    "h-10 rounded-xl border text-[9px] font-bold uppercase",
                                                    bannerConfig.gradientDirection === 'right' ? "bg-primary text-white" : "bg-white"
                                                )}
                                            >
                                                ➡️ Right-to-Left
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC ITEM SLOT GENERATOR */}
                    {bannerConfig.coloredItems && bannerConfig.coloredItems.length > 0 && (
                        <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-dashed border-accent/20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-3 mb-2">
                                <Paintbrush className="text-accent h-5 w-5" />
                                <h3 className="text-sm font-black text-accent uppercase tracking-widest">Marquee Item Stylizer (Ordinal Sequence)</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                                {bannerConfig.coloredItems.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-6 p-8 bg-white rounded-3xl border shadow-sm group hover:border-primary transition-all relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 bg-muted/30 rounded-bl-3xl border-b border-l">
                                            <span className="text-[10px] font-black text-accent uppercase">Slot {idx + 1}</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">Item Content</Label>
                                            <Input 
                                                value={item.text} 
                                                onChange={(e) => {
                                                    const newColored = [...(bannerConfig.coloredItems || [])];
                                                    newColored[idx].text = e.target.value;
                                                    const newItems = newColored.map(ci => ci.text);
                                                    setBannerConfig({ ...bannerConfig, items: newItems, coloredItems: newColored });
                                                }}
                                                placeholder="Item text or emoji"
                                                className="h-12 rounded-xl text-lg font-black bg-muted/10 border-none focus:bg-white transition-all uppercase"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">Accent Color</Label>
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="color" 
                                                    value={item.color || '#ffffff'} 
                                                    onChange={(e) => {
                                                        const newColored = [...(bannerConfig.coloredItems || [])];
                                                        newColored[idx].color = e.target.value;
                                                        setBannerConfig({ ...bannerConfig, coloredItems: newColored });
                                                    }}
                                                    className="h-12 w-12 rounded-xl cursor-pointer border-none shadow-inner shrink-0"
                                                />
                                                <Input 
                                                    value={item.color || '#ffffff'} 
                                                    onChange={(e) => {
                                                        const newColored = [...(bannerConfig.coloredItems || [])];
                                                        newColored[idx].color = e.target.value;
                                                        setBannerConfig({ ...bannerConfig, coloredItems: newColored });
                                                    }}
                                                    className="h-12 rounded-xl font-mono uppercase text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button onClick={handleSaveBanner} disabled={submitting} className="w-full h-16 rounded-full font-black text-xl uppercase bg-primary text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                        {submitting ? <Loader2 className="animate-spin mr-3" /> : <Save className="mr-3" />}
                        Sync v4.4.0 Engine
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
        <TabsContent value="social" className="space-y-8">
            <Card className="rounded-[2.5rem] border shadow-xl overflow-hidden">
                <CardHeader className="bg-accent text-white p-8">
                    <div className="flex items-center gap-3">
                        <Share2 className="text-primary h-6 w-6" />
                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Social Hub CMS</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">Control your digital presence and curated video streams.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                    {/* Copy Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Section Headline</Label>
                            <Input 
                                value={connectConfig.headline} 
                                onChange={(e) => setConnectConfig({...connectConfig, headline: e.target.value})}
                                className="h-14 rounded-2xl font-black text-xl uppercase"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Section Subheading</Label>
                            <Input 
                                value={connectConfig.subheading} 
                                onChange={(e) => setConnectConfig({...connectConfig, subheading: e.target.value})}
                                className="h-14 rounded-2xl font-bold"
                            />
                        </div>
                    </div>

                    {/* Video Stream Hub */}
                    <div className="p-8 rounded-[2.5rem] bg-secondary/10 border border-dashed border-accent/20 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Video className="text-accent h-5 w-5" />
                                <h3 className="text-sm font-black text-accent uppercase tracking-widest">TikTok Asset Manager</h3>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setConnectConfig({...connectConfig, tiktokVideoIds: [...connectConfig.tiktokVideoIds, ""]})}>
                                <Plus size={14} className="mr-2" /> Add Video Slot
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {connectConfig.tiktokVideoIds.map((id, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-4 bg-white rounded-2xl border shadow-sm group">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[8px] font-black uppercase text-muted-foreground">Video Slot {idx + 1}</Label>
                                        <button onClick={() => setConnectConfig({...connectConfig, tiktokVideoIds: connectConfig.tiktokVideoIds.filter((_, i) => i !== idx)})} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    <Input 
                                        value={id} 
                                        onChange={(e) => {
                                            const newIds = [...connectConfig.tiktokVideoIds];
                                            newIds[idx] = e.target.value;
                                            setConnectConfig({...connectConfig, tiktokVideoIds: newIds});
                                        }}
                                        placeholder="Enter TikTok Video ID (e.g., 7506...)"
                                        className="h-10 rounded-xl font-mono text-xs"
                                    />
                                    <p className="text-[8px] text-muted-foreground italic font-medium">Extract the ID from the video URL (the string of numbers at the end).</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Logic Hub */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {connectConfig.socialLinks.map((link, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-muted/30 border space-y-4">
                                <div className="flex items-center gap-2">
                                    {link.platform === 'tiktok' ? <Youtube size={16} className="text-accent" /> : <Share2 size={16} className="text-accent" />}
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">{link.platform} Configuration</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-muted-foreground">Button Label</Label>
                                        <Input 
                                            value={link.label} 
                                            onChange={(e) => {
                                                const newLinks = [...connectConfig.socialLinks];
                                                newLinks[idx].label = e.target.value;
                                                setConnectConfig({...connectConfig, socialLinks: newLinks});
                                            }}
                                            className="h-10 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold uppercase text-muted-foreground">Destination URL</Label>
                                        <Input 
                                            value={link.url} 
                                            onChange={(e) => {
                                                const newLinks = [...connectConfig.socialLinks];
                                                newLinks[idx].url = e.target.value;
                                                setConnectConfig({...connectConfig, socialLinks: newLinks});
                                            }}
                                            className="h-10 rounded-xl text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleSaveConnect} disabled={submitting} className="w-full h-16 rounded-full font-black text-xl uppercase bg-primary text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                        {submitting ? <Loader2 className="animate-spin mr-3" /> : <Save className="mr-3" />}
                        Save Global Node
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
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
