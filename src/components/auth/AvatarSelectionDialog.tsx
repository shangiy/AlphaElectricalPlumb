'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { availableAvatars } from '@/lib/data';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AvatarSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function AvatarSelectionDialog({ isOpen, onClose, onSelect }: AvatarSelectionDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
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
        // Specifically route user profile pictures to the 'avatars' bucket
        const publicUrl = await uploadImage(file, 'avatars');
        handleSelect(publicUrl);
        toast({
            title: "Avatar Uploaded!",
            description: "Your custom profile picture is ready.",
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
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-[2rem] overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-accent text-white">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
             <ImageIcon className="text-primary h-6 w-6" />
             Choose Your Avatar
          </DialogTitle>
          <DialogDescription className="text-white/60 font-medium">
            Select a curated character or upload a personal photo from your device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-8 space-y-8">
            {/* Custom Upload Area */}
            <div 
                onClick={handleUploadClick}
                className="group relative border-2 border-dashed rounded-[1.5rem] p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300"
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
                    <div className="flex flex-col items-center gap-3 py-2">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-sm font-black uppercase tracking-widest text-primary">Uploading to Cloud...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                            <Upload className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-accent uppercase tracking-tighter">Upload from Device</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">JPG, PNG or WebP (Max 5MB)</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Curated Grid */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Professional Characters</h4>
                <ScrollArea className="h-[240px] pr-4">
                    <div className="grid grid-cols-4 gap-4 pb-4">
                        {availableAvatars.map((avatar, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelect(avatar.url)}
                                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary hover:scale-105 hover:shadow-xl focus:border-primary focus:outline-none transition-all duration-300 bg-muted/20"
                            >
                                <img
                                    src={avatar.url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
                                    alt={avatar.alt || 'Avatar'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Auto-recovery if external avatar API is unreachable
                                        (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
