'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
    Loader2, 
    MessageSquareQuote, 
    Trash2, 
    CheckCircle, 
    Eye, 
    EyeOff, 
    Star, 
    Package, 
    Layout, 
    History 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Rating } from '@/components/ui/rating';
import { toggleReviewVisibility } from '@/app/actions/cms-actions';
import { cn } from '@/lib/utils';

/**
 * ReviewManager v4.4.26:
 * Unified Command Node for moderating Product and Webapp Feedback.
 * Features strict column mapping for Supabase synchronization.
 */
export default function ReviewManager() {
    const { toast } = useToast();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadReviews = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // Explicitly select exact columns present in the table
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    id, 
                    author_name, 
                    comment, 
                    rating, 
                    review_type, 
                    created_at, 
                    title, 
                    is_hidden, 
                    product_id,
                    products(name)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error("Review fetch failure:", err);
            toast({ variant: "destructive", title: "Sync Error", description: "Could not retrieve feedback from cloud storage." });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const handleToggleVisibility = async (id: string, currentHidden: boolean) => {
        setProcessingId(id);
        try {
            const result = await toggleReviewVisibility(id, !currentHidden);
            if (result.success) {
                setReviews(prev => prev.map(r => r.id === id ? { ...r, is_hidden: !currentHidden } : r));
                toast({ 
                    title: "Visibility Updated", 
                    description: `Feedback is now ${!currentHidden ? 'hidden' : 'live'} on the storefront.` 
                });
            }
        } catch (err) {
            toast({ variant: "destructive", title: "Update Failed", description: "Could not sync visibility state." });
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm("Permanently wipe this feedback from the ecosystem?")) return;
        
        setProcessingId(id);
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', id);
            if (error) throw error;
            
            setReviews(prev => prev.filter(r => r.id !== id));
            toast({ title: "Feedback Erased", description: "The record has been purged from the database." });
        } catch (err) {
            toast({ variant: "destructive", title: "Deletion Failed", description: "Sync error during record removal." });
        } finally {
            setProcessingId(null);
        }
    };

    const productReviews = reviews.filter(r => r.review_type === 'product');
    const webappReviews = reviews.filter(r => r.review_type === 'homepage');

    if (loading) return (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
            <p className="font-black uppercase tracking-[0.3em] text-muted-foreground/40">Syncing Feedback Node...</p>
        </div>
    );

    const ReviewTable = ({ data, type }: { data: any[], type: 'product' | 'webapp' }) => (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-b-2">
                        <TableHead className="pl-8 font-black uppercase text-accent text-[10px] tracking-[0.2em] h-14">Author & Node</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Quality Score</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Detailed Feedback</TableHead>
                        <TableHead className="font-black uppercase text-accent text-[10px] tracking-[0.2em]">Status</TableHead>
                        <TableHead className="pr-8 text-right font-black uppercase text-accent text-[10px] tracking-[0.2em]">Operations</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? data.map(r => (
                        <TableRow key={r.id} className={cn("hover:bg-primary/5 transition-all group border-b border-muted/30", r.is_hidden && "opacity-60")}>
                            <TableCell className="pl-8 py-6">
                                <div className="flex flex-col">
                                    <span className="font-black text-accent text-sm uppercase tracking-tight">{r.author_name || 'Verified Client'}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {formatDistanceToNow(new Date(r.created_at))} ago
                                        </span>
                                        {type === 'product' && (
                                            <>
                                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                <span className="text-[9px] font-black text-primary uppercase truncate max-w-[150px]">
                                                    {r.products?.name || 'Inventory Item'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <Rating rating={r.rating} size={14} />
                                    <span className="text-[10px] font-bold text-accent/40 uppercase">{r.rating}/5 Nodes</span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-md">
                                <div className="space-y-1 py-1">
                                    <p className="text-sm font-black text-accent uppercase tracking-tight line-clamp-1">{r.title || 'Exceptional Quality'}</p>
                                    <p className="text-xs text-muted-foreground font-medium italic line-clamp-2 leading-relaxed opacity-80">"{r.comment}"</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Switch 
                                        checked={!r.is_hidden} 
                                        onCheckedChange={() => handleToggleVisibility(r.id, !!r.is_hidden)}
                                        disabled={processingId === r.id}
                                    />
                                    <Badge className={cn(
                                        "uppercase text-[8px] font-black tracking-[0.2em] border-none shadow-sm",
                                        r.is_hidden ? "bg-muted text-muted-foreground" : "bg-green-500 text-white"
                                    )}>
                                        {r.is_hidden ? 'ARCHIVED' : 'LIVE'}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="pr-8 text-right">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                                    onClick={() => handleDeleteReview(r.id)}
                                    disabled={processingId === r.id}
                                >
                                    {processingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={18} />}
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-60 text-center">
                                <div className="flex flex-col items-center justify-center opacity-40">
                                    <History size={40} className="mb-4" />
                                    <p className="font-black uppercase text-[12px] tracking-[0.4em]">Review Pool Empty</p>
                                    <p className="text-[10px] font-bold mt-1">No active records in this segment.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <h2 className="text-4xl font-black font-headline text-accent tracking-tighter uppercase">Feedback Command</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Moderate user experiences and storefront testimonials across the ecosystem.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                        v4.4.26 MODERATOR
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto bg-muted/30 p-2 rounded-[2.5rem] border mb-10 shadow-inner">
                    <TabsTrigger value="product" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <Package size={14} /> Product Reviews ({productReviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="webapp" className="rounded-[1.5rem] font-black uppercase text-[10px] py-4 flex items-center justify-center gap-2 tracking-widest">
                        <Layout size={14} /> Webapp Reviews ({webappReviews.length})
                    </TabsTrigger>
                </TabsList>

                <Card className="rounded-[2.5rem] border shadow-2xl overflow-hidden bg-white">
                    <TabsContent value="product" className="m-0">
                        <ReviewTable data={productReviews} type="product" />
                    </TabsContent>
                    <TabsContent value="webapp" className="m-0">
                        <ReviewTable data={webappReviews} type="webapp" />
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
