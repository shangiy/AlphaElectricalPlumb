'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Play,
  Monitor
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FeaturedProductManager from './FeaturedProductManager';
import { 
  updateSiteSetting, 
  getSiteSetting, 
  addCategoryAdmin, 
  updateCategoryAdmin, 
  deleteCategoryAdmin,
  updateCategoryOrderAdmin
} from '@/app/actions/ui-actions';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * UI/UX Control Center v2.0
 * Intelligent hub for managing Alpha's visual brand parameters.
 */
export default function UiUxControlCenter() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('spotlight');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Banner & Search State
  const [bannerText, setBannerText] = useState('');
  const [searchPlaceholders, setSearchPlaceholders] = useState<string[]>([]);
  const [newPlaceholder, setNewPlaceholder] = useState('');

  // Category State
  const [categories, setCategories] = useState<any[]>([]);
  const [carouselSpeed, setCarouselSpeed] = useState('40');

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const banner = await getSiteSetting('top_banner_text');
      const suggestions = await getSiteSetting('search_suggestions');
      const speed = await getSiteSetting('carousel_speed');
      
      if (banner) setBannerText(banner);
      if (suggestions) setSearchPlaceholders(suggestions);
      if (speed) setCarouselSpeed(speed);

      // Load categories for management
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      setCategories(catData || []);
    } catch (err) {
      console.error("Failed to load UI settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveGeneral = async () => {
    setSubmitting(true);
    try {
      await updateSiteSetting('top_banner_text', bannerText);
      await updateSiteSetting('search_suggestions', searchPlaceholders);
      await updateSiteSetting('carousel_speed', carouselSpeed);
      toast({ title: "UI Synchronized", description: "Homepage parameters updated successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPlaceholder = () => {
    if (newPlaceholder && !searchPlaceholders.includes(newPlaceholder)) {
        setSearchPlaceholders([...searchPlaceholders, newPlaceholder]);
        setNewPlaceholder('');
    }
  };

  const handleRemovePlaceholder = (item: string) => {
    setSearchPlaceholders(searchPlaceholders.filter(p => p !== item));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase flex items-center gap-3">
            <Palette className="text-primary h-10 w-10" />
            UI/UX Control Center
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Manage the visual pulse of the Alpha ecosystem.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-16 bg-muted/50 p-2 rounded-[2rem] mb-8">
            <TabsTrigger value="spotlight" className="rounded-[1.5rem] font-black uppercase text-xs">Homepage Spotlight</TabsTrigger>
            <TabsTrigger value="general" className="rounded-[1.5rem] font-black uppercase text-xs">Hero & Banners</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-[1.5rem] font-black uppercase text-xs">Category Carousel</TabsTrigger>
        </TabsList>

        <TabsContent value="spotlight">
            <FeaturedProductManager />
        </TabsContent>

        <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                    <CardHeader className="bg-primary/5 p-8 border-b">
                        <div className="flex items-center gap-3 mb-2">
                            <Monitor className="text-primary h-5 w-5" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Top Banner Text</CardTitle>
                        </div>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The scrolling promotional text at the top of every page.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Banner Content</Label>
                            <Input 
                                value={bannerText} 
                                onChange={(e) => setBannerText(e.target.value)} 
                                placeholder="OFFER! MIDYEAR FLASH SALE..." 
                                className="h-14 rounded-2xl text-lg font-bold"
                            />
                        </div>
                        <div className="p-6 rounded-2xl bg-muted/30 border border-dashed text-xs text-muted-foreground">
                            <strong>Note:</strong> The "MASHUJAA" text is automatically styled with the Kenyan flag gradient if the word is detected in the string.
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                    <CardHeader className="bg-primary/5 p-8 border-b">
                        <div className="flex items-center gap-3 mb-2">
                            <Type className="text-primary h-5 w-5" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Search Suggestions</CardTitle>
                        </div>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dynamic terms that type and untype in the search bar.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex gap-2">
                            <Input 
                                value={newPlaceholder} 
                                onChange={(e) => setNewPlaceholder(e.target.value)}
                                placeholder="Add keyword (e.g. plumbing)"
                                className="h-12 rounded-xl"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddPlaceholder()}
                            />
                            <Button onClick={handleAddPlaceholder} variant="outline" className="h-12 rounded-xl px-6">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {searchPlaceholders.map((item) => (
                                <div key={item} className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full border shadow-sm group">
                                    <span className="text-sm font-bold text-accent">{item}</span>
                                    <button onClick={() => handleRemovePlaceholder(item)} className="text-muted-foreground hover:text-red-500">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button 
                            onClick={handleSaveGeneral} 
                            disabled={submitting} 
                            className="w-full h-14 rounded-full font-black uppercase tracking-widest bg-primary text-white shadow-lg mt-4"
                        >
                            {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : <Save className="h-5 w-5 mr-3" />}
                            Sync Brand parameters
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="categories">
            <CategoryOrderManager categories={categories} speed={carouselSpeed} onRefresh={loadSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Category Carousel Manager
 */
function CategoryOrderManager({ categories, speed, onRefresh }: any) {
    const { toast } = useToast();
    const [list, setList] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(speed);

    useEffect(() => {
        setList(categories);
        setCurrentSpeed(speed);
    }, [categories, speed]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setList((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSaveOrder = async () => {
        setSubmitting(true);
        try {
            const updates = list.map((c, index) => ({ id: c.id, sort_order: index + 1 }));
            await updateCategoryOrderAdmin(updates);
            await updateSiteSetting('carousel_speed', currentSpeed);
            toast({ title: "Carousel Updated", description: "Hierarchy and speed synced successfully." });
            onRefresh();
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Permanently remove this category card?")) return;
        try {
            await deleteCategoryAdmin(id);
            toast({ description: "Category removed." });
            onRefresh();
        } catch (err) {
            toast({ variant: "destructive", description: "Failed to delete." });
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card className="rounded-[2.5rem] shadow-xl overflow-hidden border-none bg-white">
                <CardHeader className="bg-primary/5 p-8 border-b flex flex-row items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutGrid className="text-primary h-5 w-5" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Carousel Hierarchy</CardTitle>
                        </div>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Drag to reorder cards. Items are mirrored for infinite loop.</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end gap-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Speed (s)</Label>
                            <Input 
                                type="number" 
                                value={currentSpeed} 
                                onChange={(e) => setCurrentSpeed(e.target.value)} 
                                className="w-20 h-9 rounded-lg font-bold"
                            />
                        </div>
                        <Button 
                            onClick={handleSaveOrder} 
                            disabled={submitting} 
                            className="rounded-full h-12 px-8 font-black uppercase tracking-tighter bg-accent text-white"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Sync Carousel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={list.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                                {list.map((cat) => (
                                    <SortableCategoryItem key={cat.id} category={cat} onDelete={handleDelete} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="mt-8 pt-8 border-t border-dashed">
                        <Button variant="outline" className="w-full rounded-2xl h-14 border-2 border-dashed font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:border-primary">
                            <Plus className="mr-2 h-5 w-5" />
                            Register New Category Node
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function SortableCategoryItem({ category, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 };

    return (
        <div ref={setNodeRef} style={style} className="bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-4 group">
            <div {...attributes} {...listeners} className="cursor-grab p-2 hover:bg-muted rounded-lg"><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
            <div className="h-16 w-16 rounded-xl overflow-hidden border bg-muted shrink-0">
                <img src={category.image_url || '/placeholder.jpg'} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-accent uppercase tracking-tight">{category.name}</p>
                <p className="text-[10px] font-bold text-muted-foreground/60 truncate">{category.image_url || 'No manual image override'}</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" onClick={() => onDelete(category.id)}>
                <Trash2 size={16} />
            </Button>
        </div>
    );
}
