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
  Type,
  Plus,
  Settings2,
  X,
  RotateCcw,
  Eye,
  LayoutTemplate,
  GripVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FeaturedProductManager from './FeaturedProductManager';
import CategoryManager from './CategoryManager';
import HeroSearch from '@/components/common/HeroSearch';
import HeroManager from './HeroManager';
import { 
  getStorefrontSetting, 
  updateStorefrontSetting,
  type HeroSlide
} from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
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
    { id: 'bold', label: 'Bold' },
    { id: 'underline', label: 'Underline' },
    { id: 'line-through', label: 'Strikethrough' }
];

interface HighlighterRule {
    word: string;
    colors: string[];
}

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
    items: ["EASTER HOLIDAY OFFER! BEST PRICES GUARANTEED", "Feel welcomed to Shop with us @best prices"],
    speed: 30,
    fontSize: 12,
    textColor: '#ffffff',
    styleType: 'kenyan-flag',
    styleOrientation: 'horizontal',
    showClock: true,
    showSocial: true,
    highlighters: [] as HighlighterRule[],
    badgeText: '',
    halloweenText: '',
    halloweenStyleType: 'fire-emoji',
    halloweenOrientation: 'horizontal',
    halloweenTextStyle: 'normal',
    holidayText: '',
    holidayStyleType: 'kenyan-flag',
    holidayOrientation: 'vertical',
    holidayTextStyle: 'bold',
    vibrantText: '',
    vibrantStyleType: 'kenyan-flag',
    vibrantOrientation: 'vertical',
    vibrantTextStyle: 'bold',
    vibrantText2: '',
    vibrantStyleType2: 'kenyan-flag',
    vibrantOrientation2: 'vertical',
    vibrantTextStyle2: 'bold'
};

/**
 * Sortable Keyword Item Component
 */
function SortableSearchPhrase({ phrase, id, onRemove }: { phrase: string, id: string, onRemove: (phrase: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={cn(
                "flex items-center gap-3 bg-secondary px-5 py-3 rounded-2xl border group transition-all",
                isDragging ? "opacity-50 scale-105 shadow-xl border-primary" : "hover:border-primary/40"
            )}
        >
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary">
                <GripVertical size={16} />
            </button>
            <span className="text-base font-bold text-accent">{phrase}</span>
            <button 
                onClick={() => onRemove(phrase)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

export default function UiUxControlCenter() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get('tab') || 'topbanner';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // CMS State
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(DEFAULT_BANNER);
  const [searchPhrases, setSearchPhrases] = useState<string[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [categoryCards, setCategoryCards] = useState<any[]>([]);
  const [newPhrase, setNewPhrase] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadAllSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [search, bannerSet, heroSet, catCards] = await Promise.all([
        getStorefrontSetting('search_phrases'),
        getStorefrontSetting('top_banner_config'),
        getStorefrontSetting('hero_slides'),
        getStorefrontSetting('category_cards'),
      ]);
      
      if (search) setSearchPhrases(search);
      if (bannerSet && bannerSet.items && bannerSet.items.length > 0) {
          setBannerConfig(prev => ({
              ...prev,
              ...bannerSet,
              highlighters: bannerSet.highlighters || []
          }));
      }
      if (heroSet) setHeroSlides(heroSet as HeroSlide[]);
      if (catCards) setCategoryCards(catCards);
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
        const cleanedConfig = {
            ...bannerConfig,
            highlighters: (bannerConfig.highlighters || []).filter(h => h.word && h.word.trim().length > 0)
        };
        await updateStorefrontSetting('top_banner_config', cleanedConfig);
        toast({ title: "Configuration Published", description: "Storefront UI has been synchronized." });
    } catch (err: any) {
        toast({ variant: "destructive", title: "Sync Error", description: err.message });
    } finally {
        setSubmitting(false);
    }
  };

  const handleResetBanner = () => {
      if(confirm("Are you sure you want to reset all banner settings to factory defaults?")) {
          setBannerConfig(DEFAULT_BANNER);
          toast({ description: "Settings staged for reset. Click Save to publish." });
      }
  };

  const addHighlighterRule = () => {
      setBannerConfig({
          ...bannerConfig,
          highlighters: [
              ...(bannerConfig.highlighters || []),
              { word: '', colors: ['#00808d'] }
          ]
      });
  };

  const updateHighlighterRule = (index: number, field: keyof HighlighterRule, value: any) => {
      const updated = [...(bannerConfig.highlighters || [])];
      updated[index] = { ...updated[index], [field]: value } as HighlighterRule;
      setBannerConfig({ ...bannerConfig, highlighters: updated });
  };

  const removeHighlighterRule = (index: number) => {
      setBannerConfig({
          ...bannerConfig,
          highlighters: bannerConfig.highlighters?.filter((_, i) => i !== index)
      });
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

  const getBackgroundColors = (styleType: string) => {
    switch(styleType) {
        case 'kenyan-flag': return 'from-black via-red-600 to-green-600';
        case 'gold-gradient': return 'from-yellow-600 via-amber-500 to-yellow-800';
        case 'neon-glow': return 'from-cyan-600 via-blue-600 to-indigo-600';
        case 'fire-emoji': return 'from-orange-600 via-red-600 to-yellow-500';
        default: return 'from-red-500 via-purple-500 to-blue-500';
    }
  };

  const getGradientDirection = (orientation: string) => {
    switch(orientation) {
        case 'vertical': return 'bg-gradient-to-b';
        case 'diagonal': return 'bg-gradient-to-br';
        default: return 'bg-gradient-to-r';
    }
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
        textStyle === 'bold' && 'font-black',
        textStyle === 'underline' && 'underline',
        textStyle === 'line-through' && 'line-through'
      );

      return (
        <span className={styleClasses}>
          <span className="text-black">{p1}</span>
          <span className="text-red-600">{p2}</span>
          <span className="text-green-600">{p3}</span>
        </span>
      );
    }

    const gradientDir = getGradientDirection(orientation);
    const bgColors = getBackgroundColors(styleType);
    
    return (
      <span className={cn(
          "font-black bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%] uppercase whitespace-nowrap",
          gradientDir, 
          bgColors,
          textStyle === 'italic' && 'italic',
          textStyle === 'bold' && 'font-black',
          textStyle === 'underline' && 'underline',
          textStyle === 'line-through' && 'line-through'
      )}>
          {text}
      </span>
    );
  };

  const renderHighlightedText = (text: string) => {
    const rules = (bannerConfig.highlighters || []).filter(r => r.word && r.word.trim().length > 0);
    if (rules.length === 0) return text;

    const regex = new RegExp(`(${rules.map(r => r.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    
    const occurrenceCounters: Record<string, number> = {};

    return parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const matchingRule = rules.find(r => r.word.toLowerCase() === lowerPart);
        
        if (matchingRule) {
            const count = occurrenceCounters[lowerPart] || 0;
            occurrenceCounters[lowerPart] = count + 1;
            
            const color = matchingRule.colors[count % matchingRule.colors.length] || '#00808d';

            return (
                <span 
                    key={i} 
                    className="rounded-lg px-2 py-0.5 font-black shadow-lg mx-1 inline-block transform -skew-x-6 text-white text-[10px]"
                    style={{ backgroundColor: color }}
                >
                    {part}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black font-headline text-accent tracking-tighter uppercase flex items-center gap-4">
            <LayoutGrid className="text-primary h-12 w-12" />
            Alpha CMS Suite
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Professional Storefront Governance v4.3.0</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetBanner} className="rounded-full font-black uppercase text-[10px] tracking-widest">
            <RotateCcw className="mr-2 h-3 w-3" /> Reset Defaults
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto bg-muted/30 p-2 rounded-[2.5rem] mb-12 border shadow-inner">
            <TabsTrigger value="topbanner" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Banner CMS</TabsTrigger>
            <TabsTrigger value="search" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Search Keywords</TabsTrigger>
            <TabsTrigger value="hero" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Hero Edit</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Product Carousel</TabsTrigger>
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Spotlight</TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="topbanner">
            <div className="max-w-5xl mx-auto space-y-12">
                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-accent text-white p-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Zap className="text-primary h-6 w-6" />
                                <CardTitle className="text-2xl font-black uppercase tracking-tight">Banner Engineering</CardTitle>
                            </div>
                            <Badge className="bg-white/10 text-white border-none font-black text-[9px] uppercase tracking-[0.2em]">Engine Sync Active</Badge>
                        </div>
                        <CardDescription className="text-white/60 font-medium">Control the typography, style, pace, and items of the announcement marquee.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                        
                        {/* Visibility Controls */}
                        <div className="flex gap-8 mb-4 bg-muted/20 p-5 rounded-[1.5rem] border border-dashed border-accent/10">
                            <div className="flex items-center gap-3">
                                <Switch checked={bannerConfig.showClock} onCheckedChange={(val) => setBannerConfig({...bannerConfig, showClock: val})} />
                                <Label className="text-[10px] font-black uppercase tracking-widest">Clock Module</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch checked={bannerConfig.showSocial} onCheckedChange={(val) => setBannerConfig({...bannerConfig, showSocial: val})} />
                                <Label className="text-[10px] font-black uppercase tracking-widest">TikTok Social</Label>
                            </div>
                        </div>

                        {/* Real-time Engine Preview Node */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                                    <Eye className="h-3.5 w-3.5" /> Real-time Engine Preview
                                </Label>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Syncs instantly with your edits below</span>
                            </div>
                            <div className={cn(
                                "relative w-full overflow-hidden rounded-[2rem] border shadow-xl transition-all duration-500 h-16 flex items-center bg-[length:200%_200%] animate-gradient-x",
                                bannerConfig.styleOrientation !== 'text-clip' && getGradientDirection(bannerConfig.styleOrientation || 'horizontal'),
                                bannerConfig.styleOrientation !== 'text-clip' && getBackgroundColors(bannerConfig.styleType),
                                bannerConfig.styleOrientation === 'text-clip' && "bg-slate-50 border-slate-200"
                            )}>
                                <div className="flex w-max items-center flex-nowrap animate-marquee whitespace-nowrap" style={{ animationDuration: `${bannerConfig.speed}s` }}>
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex items-center">
                                            {bannerConfig.items.map((item, idx) => {
                                                const isClipped = bannerConfig.styleOrientation === 'text-clip';
                                                const gradientDir = getGradientDirection(bannerConfig.styleOrientation || 'horizontal');
                                                return (
                                                    <div key={idx} className="flex items-center mx-12">
                                                        {/* Primary Badge */}
                                                        {bannerConfig.badgeText && (
                                                            <div className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0 flex items-center justify-center">
                                                                {renderStyledBadgeText(bannerConfig.badgeText, bannerConfig.styleType, bannerConfig.styleOrientation || 'horizontal')}
                                                            </div>
                                                        )}
                                                        {/* Halloween Badge */}
                                                        {bannerConfig.halloweenText && (
                                                            <div className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0 flex items-center justify-center">
                                                                {renderStyledBadgeText(
                                                                    bannerConfig.halloweenText, 
                                                                    bannerConfig.halloweenStyleType || 'fire-emoji', 
                                                                    bannerConfig.halloweenOrientation || 'horizontal',
                                                                    bannerConfig.halloweenTextStyle
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Holiday Badge */}
                                                        {bannerConfig.holidayText && (
                                                            <div className="px-3 py-1 rounded-full bg-white mr-4 shadow-lg transform -skew-x-6 flex-shrink-0 flex items-center justify-center">
                                                                {renderStyledBadgeText(
                                                                    bannerConfig.holidayText, 
                                                                    bannerConfig.holidayStyleType || 'kenyan-flag', 
                                                                    bannerConfig.holidayOrientation || 'vertical',
                                                                    bannerConfig.holidayTextStyle
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Vibrant Display */}
                                                        {bannerConfig.vibrantText && (
                                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center">
                                                                {renderStyledBadgeText(
                                                                    bannerConfig.vibrantText, 
                                                                    bannerConfig.vibrantStyleType || 'kenyan-flag', 
                                                                    bannerConfig.vibrantOrientation || 'vertical',
                                                                    bannerConfig.vibrantTextStyle
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Vibrant Display 2 */}
                                                        {bannerConfig.vibrantText2 && (
                                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center">
                                                                {renderStyledBadgeText(
                                                                    bannerConfig.vibrantText2, 
                                                                    bannerConfig.vibrantStyleType2 || 'kenyan-flag', 
                                                                    bannerConfig.vibrantOrientation2 || 'vertical',
                                                                    bannerConfig.vibrantTextStyle2
                                                                )}
                                                            </div>
                                                        )}
                                                        {/* Marquee Item */}
                                                        <span 
                                                            className={cn(
                                                                "font-black uppercase tracking-widest",
                                                                isClipped && cn("bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]", gradientDir, getBackgroundColors(bannerConfig.styleType))
                                                            )}
                                                            style={{ 
                                                                fontSize: `${Math.min(bannerConfig.fontSize, 14)}px`,
                                                                color: isClipped ? 'transparent' : bannerConfig.textColor 
                                                            }}
                                                        >
                                                            {renderHighlightedText(item)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Marquee Items Input */}
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
                                    onChange={(e) => setBannerConfig({...bannerConfig, fontSize: parseInt(e.target.value) || 12})}
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
                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Global Text Color</Label>
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

                        <div className="space-y-8 pt-4">
                            {/* PRIMARY BADGE CONTROLS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Badge Text (Left Pill)</Label>
                                    <Input 
                                        value={bannerConfig.badgeText || ''} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, badgeText: e.target.value})}
                                        placeholder="e.g. MASHUJAA"
                                        className="h-12 rounded-xl font-black"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Visual Style Engine</Label>
                                    <select 
                                        value={bannerConfig.styleType} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, styleType: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Design Orientation</Label>
                                    <select 
                                        value={bannerConfig.styleOrientation || 'horizontal'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, styleOrientation: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* HALLOWEEN TEXT CONTROLS */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-dashed">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Halloween Text (Event Pill)</Label>
                                    <Input 
                                        value={bannerConfig.halloweenText || ''} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, halloweenText: e.target.value})}
                                        placeholder="e.g. MEGA SALE"
                                        className="h-12 rounded-xl font-black"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Style Engine</Label>
                                    <select 
                                        value={bannerConfig.halloweenStyleType || 'fire-emoji'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, halloweenStyleType: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Orientation</Label>
                                    <select 
                                        value={bannerConfig.halloweenOrientation || 'horizontal'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, halloweenOrientation: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Text Style</Label>
                                    <select 
                                        value={bannerConfig.halloweenTextStyle || 'normal'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, halloweenTextStyle: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* HOLIDAY TEXT CONTROLS */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-dashed">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Holiday Text (Hero Pill)</Label>
                                    <Input 
                                        value={bannerConfig.holidayText || ''} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, holidayText: e.target.value})}
                                        placeholder="e.g. MASHUJAA"
                                        className="h-12 rounded-xl font-black"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Style Engine</Label>
                                    <select 
                                        value={bannerConfig.holidayStyleType || 'kenyan-flag'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, holidayStyleType: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Orientation</Label>
                                    <select 
                                        value={bannerConfig.holidayOrientation || 'vertical'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, holidayOrientation: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Text Style</Label>
                                    <select 
                                        value={bannerConfig.holidayTextStyle || 'bold'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, holidayTextStyle: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* VIBRANT TEXT CONTROLS (No Background) */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-dashed">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Vibrant Event Text (Text Only)</Label>
                                    <Input 
                                        value={bannerConfig.vibrantText || ''} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantText: e.target.value})}
                                        placeholder="e.g. MASHUJAA"
                                        className="h-12 rounded-xl font-black"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Color Style Engine</Label>
                                    <select 
                                        value={bannerConfig.vibrantStyleType || 'kenyan-flag'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantStyleType: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Paint Orientation</Label>
                                    <select 
                                        value={bannerConfig.vibrantOrientation || 'vertical'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantOrientation: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Typography Mode</Label>
                                    <select 
                                        value={bannerConfig.vibrantTextStyle || 'bold'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantTextStyle: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* SECOND VIBRANT TEXT CONTROLS (No Background) */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6 border-t border-dashed">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Accent Highlight (Text Only)</Label>
                                    <Input 
                                        value={bannerConfig.vibrantText2 || ''} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantText2: e.target.value})}
                                        placeholder="e.g. LIMITED OFFER"
                                        className="h-12 rounded-xl font-black"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Color Style Engine</Label>
                                    <select 
                                        value={bannerConfig.vibrantStyleType2 || 'kenyan-flag'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantStyleType2: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Paint Orientation</Label>
                                    <select 
                                        value={bannerConfig.vibrantOrientation2 || 'vertical'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantOrientation2: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {ORIENTATION_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Typography Mode</Label>
                                    <select 
                                        value={bannerConfig.vibrantTextStyle2 || 'bold'} 
                                        onChange={(e) => setBannerConfig({...bannerConfig, vibrantTextStyle2: e.target.value})}
                                        className="w-full h-12 px-4 rounded-xl border font-bold text-sm bg-white"
                                    >
                                        {TEXT_STYLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-8 border-t border-dashed mt-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <Settings2 className="h-3.5 w-3.5" /> Keyword Highlighter
                            </Label>
                            <div className="p-6 bg-muted/20 rounded-2xl border border-dashed border-accent/10 min-h-[48px]">
                                {bannerConfig.highlighters && bannerConfig.highlighters.length > 0 ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {bannerConfig.highlighters.map((rule, idx) => (
                                                <div key={idx} className="p-4 bg-white rounded-xl border shadow-sm space-y-3 relative group">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">Rule #{idx + 1}</span>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeHighlighterRule(idx)}>
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[8px] font-black uppercase text-muted-foreground">Keyword</Label>
                                                        <Input 
                                                            value={rule.word} 
                                                            onChange={(e) => updateHighlighterRule(idx, 'word', e.target.value)}
                                                            placeholder="e.g. OFFER"
                                                            className="h-10 text-xs rounded-lg font-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[8px] font-black uppercase text-muted-foreground">Color Cycle (Hex)</Label>
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {rule.colors.map((color, cIdx) => (
                                                                <div key={cIdx} className="group/color relative">
                                                                    <input 
                                                                        type="color" 
                                                                        value={color.startsWith('#') ? color : '#00808d'} 
                                                                        onChange={(e) => {
                                                                            const newColors = [...rule.colors];
                                                                            newColors[cIdx] = e.target.value;
                                                                            updateHighlighterRule(idx, 'colors', newColors);
                                                                        }}
                                                                        className="h-8 w-8 rounded-full cursor-pointer border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                                                    />
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newColors = rule.colors.filter((_, i) => i !== cIdx);
                                                                            updateHighlighterRule(idx, 'colors', newColors);
                                                                        }}
                                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/color:opacity-100 transition-opacity z-10"
                                                                    >
                                                                        <X size={8} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <div className="relative">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="icon" 
                                                                    className="h-8 w-8 rounded-full border-dashed"
                                                                    type="button"
                                                                >
                                                                    <Plus size={12} />
                                                                    <input 
                                                                        type="color" 
                                                                        onChange={(e) => {
                                                                            updateHighlighterRule(idx, 'colors', [...rule.colors, e.target.value]);
                                                                        }}
                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Input 
                                                            value={rule.colors.join(', ')} 
                                                            onChange={(e) => updateHighlighterRule(idx, 'colors', e.target.value.split(',').map(c => c.trim()))}
                                                            placeholder="#00808d, #ef4444"
                                                            className="h-8 text-[9px] rounded-lg font-mono bg-muted/10"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-full h-10 px-6 font-black uppercase text-[10px] tracking-widest border-primary/40 text-primary hover:bg-primary/5" onClick={addHighlighterRule}>
                                            <Plus size={14} className="mr-2" /> Add Rule
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Button variant="link" size="sm" className="p-0 h-auto text-[10px] font-black uppercase text-primary tracking-widest" onClick={addHighlighterRule}>
                                            Initialize Highlight Engine
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary">
                                <Type className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Maintenance Logic</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                                Note: Rules with empty keywords are automatically filtered by the rendering engine to prevent character splitting. Ensure each rule has a valid word to avoid layout inconsistencies.
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
                        {/* High-Fidelity Engine Preview */}
                        <div className="space-y-3 mb-8">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                                <Eye className="h-3.5 w-3.5" /> Real-time Search Preview
                            </Label>
                            <div className="p-10 bg-[#0a0f1e] rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                 {/* Blueprint Pattern to match Hero */}
                                 <div 
                                    className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{ 
                                      backgroundImage: `radial-gradient(#1e293b 1px, transparent 0)`,
                                      backgroundSize: '30px 30px'
                                    }}
                                  />
                                <div className="relative z-10">
                                    <HeroSearch customPlaceholders={searchPhrases} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Input value={newPhrase} onChange={(e) => setNewPhrase(e.target.value)} placeholder="Add product's keyword" className="h-14 rounded-2xl text-lg font-bold" />
                            <Button onClick={() => { 
                                if(newPhrase && !searchPhrases.includes(newPhrase)) { 
                                    setSearchPhrases([...searchPhrases, newPhrase]); 
                                    setNewPhrase(''); 
                                } else if (newPhrase) {
                                    toast({ variant: 'destructive', description: 'Keyword already exists.' });
                                }
                            }}>Add</Button>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3 block">Arrangement Console (Drag to Reorder)</Label>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSearchPhraseDragEnd}>
                                <SortableContext items={searchPhrases} strategy={rectSortingStrategy}>
                                    <div className="flex flex-wrap gap-3 p-6 bg-muted/20 rounded-[2rem] border border-dashed border-accent/10 min-h-[100px]">
                                        {searchPhrases.map((phrase) => (
                                            <SortableSearchPhrase 
                                                key={phrase} 
                                                id={phrase} 
                                                phrase={phrase} 
                                                onRemove={(p) => setSearchPhrases(searchPhrases.filter(item => item !== p))}
                                            />
                                        ))}
                                        {searchPhrases.length === 0 && (
                                            <div className="w-full flex flex-col items-center justify-center py-4 opacity-30">
                                                <Settings2 size={24} />
                                                <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Keywords Defined</span>
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>

                        <Button onClick={() => updateStorefrontSetting('search_phrases', searchPhrases)} className="w-full h-14 rounded-full font-black uppercase bg-primary text-white mt-4 shadow-xl">Sync Keywords</Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="hero">
            <div className="space-y-8">
                <div className="flex items-center gap-3 mb-4">
                    <LayoutTemplate className="text-primary h-6 w-6" />
                    <h2 className="text-2xl font-black font-headline text-accent uppercase tracking-tighter">Hero Section Management</h2>
                </div>
                <HeroManager initialSlides={heroSlides} />
            </div>
        </TabsContent>

        <TabsContent value="categories">
            <CategoryManager initialCards={categoryCards} />
        </TabsContent>

        <TabsContent value="spotlight"><FeaturedProductManager /></TabsContent>
        
        <TabsContent value="moderation">
            <div className="max-w-4xl mx-auto py-10 text-center space-y-4">
                <h3 className="text-2xl font-black text-accent uppercase tracking-tighter">Moderation Node</h3>
                <p className="text-muted-foreground">Community experiences and reviews are handled in their respective inventory nodes.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
