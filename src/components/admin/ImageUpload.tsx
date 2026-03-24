
'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, UploadCloud, GripVertical, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { uploadImage } from '@/lib/storage';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ value, onChange, maxImages = 7 }: ImageUploadProps) {
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleAddUrl = () => {
    if (value.length >= maxImages) {
      toast({ variant: 'destructive', description: `You can only add up to ${maxImages} images.` });
      return;
    }
    if (newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
      onChange([...value, newUrl]);
      setNewUrl('');
    } else {
      toast({ variant: 'destructive', description: 'Please enter a valid image URL.' });
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = async (file: File) => {
    if (value.length >= maxImages) {
      toast({ variant: 'destructive', description: `You can only add up to ${maxImages} images.` });
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    try {
        const downloadURL = await uploadImage(file);
        onChange([...value, downloadURL]);
        toast({ description: 'Image uploaded successfully.' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Upload error in component:", error);
        setUploadError(`Upload failed: ${errorMessage}. Please check storage rules and try again.`);
        toast({ variant: 'destructive', title: 'Upload Failed', description: errorMessage });
    } finally {
        setIsUploading(false);
    }
  };
  
  const onFilePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if(file) {
                 handleFileUpload(file);
                 e.preventDefault();
                 break;
            }
        }
    }
  }

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  }
  
  const handleDragSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    let _images = [...value];
    const draggedItemContent = _images.splice(dragItem.current, 1)[0];
    _images.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;

    onChange(_images);
  };

  return (
    <Card 
        onPaste={onFilePaste} 
        onDrop={onFileDrop} 
        onDragOver={(e) => e.preventDefault()}
        className={cn("border-dashed", isUploading && "pointer-events-none opacity-60")}
    >
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
            {value.length > 0 && (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {value.map((url, index) => (
                        <div 
                            key={index} 
                            className="relative aspect-square group"
                            draggable
                            onDragStart={() => dragItem.current = index}
                            onDragEnter={() => dragOverItem.current = index}
                            onDragEnd={handleDragSort}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <Image src={url} alt={`Product image ${index + 1}`} fill className="object-cover rounded-md border" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-md">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRemove(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Button variant="secondary" size="icon" className="h-8 w-8 cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-4 w-4" />
                                </Button>
                            </div>
                           {index === 0 && (
                            <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                                Main
                            </div>
                           )}
                        </div>
                    ))}
                </div>
            )}
        </div>
       
        <div 
            className={cn(
                "border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center",
                value.length > 0 && "mt-4"
            )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="mx-auto h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag & drop, paste, or{' '}
                <label htmlFor="file-upload" className="text-primary font-semibold cursor-pointer hover:underline">
                  upload an image
                </label>
                .
                <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Max 7 images. The first image is the main one.</p>
            </>
          )}
        </div>

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
        </div>

        <div className="flex gap-2">
            <Input
                type="text"
                placeholder="Add image by URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                disabled={isUploading}
            />
            <Button onClick={handleAddUrl} type="button" variant="outline" disabled={isUploading}>Add URL</Button>
        </div>
      </CardContent>
    </Card>
  );
}
