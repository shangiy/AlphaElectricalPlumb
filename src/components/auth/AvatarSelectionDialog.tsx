'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { availableAvatars } from '@/lib/data';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Image as ImageIcon, Users, UserCircle2, Sparkles } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentAvatarUrl?: string;
}

export default function AvatarSelectionDialog({ isOpen, onClose, onSelect, currentAvatarUrl }: AvatarSelectionDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [communityAvatars, setCommunityAvatars] = useState<string[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchCommunityAvatars = useCallback(async () => {
    if (!supabase) return;
    setLoadingCommunity(true);
    try {
        // Fetch unique avatar URLs from all profiles to create a "vast option" pool
        const { data, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .not('avatar_url', 'is', null)
            .neq('avatar_url', '');
        
        if (error) throw error;
        
        // Filter unique and valid URLs
        const urls = Array.from(new Set((data || []).map(p => p.avatar_url)))
            .filter(url => url.startsWith('http'))
            .slice(0, 20); // Keep it performant
            
        setCommunityAvatars(urls);
    } catch (err) {
        console.error("Failed to sync community avatars:", err);
    } finally {
        setLoadingCommunity(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
        fetchCommunityAvatars();
    }
  }, [isOpen, fetchCommunityAvatars]);

  const handleSelect = (url: string) => {
    if (!url) return;
    onSelect(url);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please select an image smaller than 5MB.",
        });
        return;
    }

    setIsUploading(true);
    try {
        const publicUrl = await uploadImage(file, 'avatars');
        handleSelect(publicUrl);
        toast({
            title: "Identity Published!",
            description: "Your custom photo is now live across the ecosystem.",
        });
    } catch (error: any) {
        console.error("Avatar upload failed:", error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: error.message || "Could not save your image to Supabase storage.",
        });
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!mounted) return null;

  const sectionLabel = "text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-3 block";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-accent text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 relative z-10">
             <ImageIcon className="text-primary h-8 w-8" />
             Identity Portfolio
          </DialogTitle>
          <DialogDescription className="text-white/60 font-medium relative z-10 max-w-xs">
            Personalize your presence. Upload a photo, pick a character, or join the community pool.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-8">
            <ScrollArea className="h-[450px] pr-4">
                <div className="space-y-10">
                    {/* Current Selection */}
                    {currentAvatarUrl && (
                        <div>
                            <span className={sectionLabel}>Current Identity</span>
                            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl border border-dashed">
                                <Avatar className="h-16 w-16 border-2 border-white shadow-lg ring-1 ring-primary/20">
                                    <AvatarImage src={currentAvatarUrl} className="object-cover" />
                                    <AvatarFallback className="bg-accent text-white font-black">?</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs font-bold text-accent uppercase">Active Selection</p>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Your current visual identifier</p>
                                </div>
                                <Button variant="ghost" size="sm" className="ml-auto rounded-full font-black text-[10px] uppercase tracking-widest text-primary" onClick={() => handleSelect(currentAvatarUrl)}>
                                    Keep Current
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Prominent Upload Area */}
                    <div>
                        <span className={sectionLabel}>External Assets (Multi-OS)</span>
                        <div 
                            onClick={handleUploadClick}
                            className="group relative border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-500 bg-muted/20"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-4 py-2">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    <p className="text-sm font-black uppercase tracking-widest text-primary animate-pulse">Syncing with Cloud...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-accent uppercase tracking-tight">Upload from Device</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">iOS • Android • Desktop (Max 5MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Global Community Pool (Selfie-like feature) */}
                    {communityAvatars.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="h-3 w-3 text-primary" />
                                <span className={sectionLabel + " mb-0"}>Global Community Pool</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {communityAvatars.map((url, i) => (
                                    <button
                                        key={`community-${i}`}
                                        onClick={() => handleSelect(url)}
                                        className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary hover:scale-110 hover:shadow-xl transition-all duration-300 bg-accent/5 group"
                                    >
                                        <img src={url} alt="Community" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ImageIcon size={14} className="text-white" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Curated Grid */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <UserCircle2 className="h-3 w-3 text-muted-foreground" />
                            <span className={sectionLabel + " mb-0"}>Professional Characters</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 pb-4">
                            {(availableAvatars || []).map((avatar, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelect(avatar.url)}
                                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary hover:scale-105 hover:shadow-xl focus:border-primary focus:outline-none transition-all duration-300 bg-muted/20"
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.alt || `Avatar ${index}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=alpha-${index}`;
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
