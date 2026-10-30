'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Camera, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatedPlaceholder } from './AnimatedPlaceholder';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { identifyProductVisually } from '@/ai/flows/visual-identity-flow';
import { getStorefrontSetting } from '@/app/actions/cms-actions';

interface HeroSearchProps {
  isCompact?: boolean;
}

export default function HeroSearch({ isCompact = false }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const [placeholders, setPlaceholders] = useState(["tanks", "chandelier", "solar heater", "mabati"]);
  const router = useRouter();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    async function loadCMSData() {
        try {
            // Fetch phrases from the new storefront_settings table
            const val = await getStorefrontSetting('search_phrases');
            if (val && Array.isArray(val)) {
                setPlaceholders(val);
            }
        } catch (e) {
            console.error("Search CMS fetch failed", e);
        }
    }
    loadCMSData();
  }, []);

  const getCameraPermission = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setHasCameraPermission(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions to scan products.',
      });
    }
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const analysis = await identifyProductVisually({ imageDataUri: imageDataUrl });
        const downloadURL = await uploadImage(imageDataUrl, 'user-selfies');
        if (supabase) {
            await supabase.from('user_selfies').insert([{
                image_url: downloadURL,
            }]);
        }

        toast({ title: 'Scan Successful!', description: `Searching for: ${analysis.suggestedName}` });
        setIsCameraDialogOpen(false);

        if (analysis.detectedBarcode) {
            router.push(`/search?barcode=${encodeURIComponent(analysis.detectedBarcode)}`);
        } else {
            router.push(`/search?q=${encodeURIComponent(analysis.searchQuery)}`);
        }
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "Could not identify the item. Please try again with better lighting.",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (isCameraDialogOpen) {
      getCameraPermission();
    } else if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setHasCameraPermission(null);
    }
  }, [isCameraDialogOpen]);

  const cameraButton = (
    <Button variant="ghost" size="icon" type="button" className={cn("shrink-0 rounded-full transition-all duration-500", isCompact ? "h-7 w-7" : "h-10 w-10")}>
      <Camera className={cn("text-gray-500", isCompact ? "w-3.5 h-3.5" : "w-5 h-5")} />
      <span className="sr-only">Search by image</span>
    </Button>
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={cn("w-full transition-all duration-500 ease-in-out", isCompact ? "max-w-full" : "max-w-2xl")}>
        <div className={cn(
          "relative flex items-center w-full p-1 space-x-1 bg-white border border-gray-200 rounded-full shadow-md transition-all duration-500 ease-in-out",
          isCompact ? "h-9 pr-1" : "h-14 pr-2"
        )}>
          {!isCompact && (
            <div className={cn("absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-500", query ? "opacity-0" : "opacity-100")}>
              <span className="text-base text-muted-foreground">Search for&nbsp;</span>
              <AnimatedPlaceholder placeholders={placeholders} />
            </div>
          )}

          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isCompact ? "Search Alpha..." : ""}
            className={cn(
              "flex-1 pl-4 pr-2 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent border-none appearance-none transition-all duration-500",
              isCompact ? "h-7 text-xs placeholder:text-xs" : "h-12 text-base"
            )}
          />
          
          {mounted ? (
            <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
              <DialogTrigger asChild>{cameraButton}</DialogTrigger>
              <DialogContent className="sm:max-w-[625px] rounded-[2rem] overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-accent text-white">
                  <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Visual Scanner</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 gap-6">
                  <div className="w-full bg-black rounded-[2rem] overflow-hidden relative shadow-inner aspect-video">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
                    {(hasCameraPermission === null || isProcessing) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-4 backdrop-blur-sm">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="font-bold tracking-tight">{isProcessing ? 'Analyzing Product Content...' : 'Calibrating Sensors...'}</p>
                      </div>
                    )}
                    {!isProcessing && hasCameraPermission && (
                        <div className="absolute inset-x-0 h-1 bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-bounce top-1/2" />
                    )}
                  </div>
                  <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-accent">Position Item in Frame</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Identify Products • Read Barcodes • Scan QR</p>
                  </div>
                  {hasCameraPermission === false && (
                    <Alert variant="destructive" className="rounded-2xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Camera Blocked</AlertTitle>
                      <AlertDescription>
                        We need lens access to identify your products.
                        <Button variant="link" className="p-0 h-auto ml-2 text-white underline" onClick={getCameraPermission}>Try Again</Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter className="p-6 bg-muted/30">
                  <DialogClose asChild><Button type="button" variant="ghost" disabled={isProcessing} className="rounded-full px-8">Dismiss</Button></DialogClose>
                  <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || isProcessing} className="rounded-full px-12 bg-primary font-black uppercase tracking-tighter shadow-xl">
                    {isProcessing ? 'ANALYZING...' : 'IDENTIFY ITEM'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : cameraButton}

          <Button type="submit" size={isCompact ? "sm" : "lg"} className={cn("rounded-full bg-[#28235f] hover:bg-[#28235f]/90 text-white transition-all duration-500 shadow-sm", isCompact ? "h-7 px-3" : "h-12 px-6")}>
            <Search className={cn(isCompact ? "w-3.5 h-3.5" : "w-5 h-5", !isCompact && "md:mr-2")} />
            <span className="hidden md:inline">{isCompact ? "" : "Search"}</span>
          </Button>
        </div>
      </form>
    </>
  );
}
