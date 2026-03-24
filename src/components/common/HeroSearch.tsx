
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Camera, Video, AlertCircle, Loader2 } from 'lucide-react';
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
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface HeroSearchProps {
  isCompact?: boolean;
}

export default function HeroSearch({ isCompact = false }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const placeholders = ["tanks", "chandelier", "solar heater", "ironsheet mabati"];

  const getCameraPermission = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setHasCameraPermission(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
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
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      try {
        const downloadURL = await uploadImage(imageDataUrl);
        await addDoc(collection(db, "userSelfies"), {
            imageUrl: downloadURL,
            createdAt: serverTimestamp()
        });

        toast({
            title: 'Image Uploaded!',
            description: 'Your image has been saved and will be reviewed by an admin.',
        });

      } catch (error) {
        console.error("Error during image capture and upload:", error);
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Could not save the image. Please try again.",
        });
      } finally {
        setIsProcessing(false);
        setIsCameraDialogOpen(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  useEffect(() => {
    if (isCameraDialogOpen) {
      getCameraPermission();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setHasCameraPermission(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraDialogOpen]);

  return (
    <>
      <form onSubmit={handleSubmit} className={cn("w-full transition-all duration-700 ease-in-out", isCompact ? "max-w-full" : "max-w-2xl")}>
        <div className={cn(
          "relative flex items-center w-full p-1 space-x-1 bg-white border border-gray-200 rounded-full shadow-md transition-all duration-700 ease-in-out",
          isCompact ? "h-8 sm:h-9 pr-1" : "h-13 pr-2"
        )}>
          
          {!isCompact && (
            <div 
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-500",
                query ? "opacity-0" : "opacity-100"
              )}
            >
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
              isCompact ? "h-6 sm:h-7 text-[10px] sm:text-xs placeholder:text-[10px] sm:placeholder:text-xs" : "h-11 text-base"
            )}
          />
          
          <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" type="button" className={cn("shrink-0 rounded-full transition-all duration-500", isCompact ? "h-6 w-6 sm:h-7 sm:w-7" : "h-9 w-9")}>
                <Camera className={cn("text-gray-500", isCompact ? "w-3 h-3 sm:w-4 sm:h-4" : "w-5 h-5")} />
                <span className="sr-only">Search by image</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Visual Search</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full bg-black rounded-md overflow-hidden relative">
                  <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  {(hasCameraPermission === null || isProcessing) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white gap-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p>{isProcessing ? 'Processing image...' : 'Requesting camera access...'}</p>
                    </div>
                  )}
                </div>
                {hasCameraPermission === false && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access in your browser to use this feature.
                      <Button variant="link" className="p-0 h-auto ml-2" onClick={getCameraPermission}>Try Again</Button>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isProcessing}>Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || isProcessing}>
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                  {isProcessing ? 'Uploading...' : 'Capture'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            type="submit" 
            size={isCompact ? "sm" : "lg"} 
            className={cn(
              "rounded-full bg-[#28235f] hover:bg-[#28235f]/90 text-white transition-all duration-500",
              isCompact ? "h-6 sm:h-7 px-2 sm:px-3" : "h-11 px-6"
            )}
          >
            <Search className={cn(isCompact ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-5 h-5", !isCompact && "md:mr-2")} />
            <span className="hidden md:inline">{isCompact ? "" : "Search"}</span>
          </Button>
        </div>
      </form>
    </>
  );
}
