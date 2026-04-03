
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, UploadCloud, GripVertical, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/storage';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ value, onChange, maxImages = 7 }: ImageUploadProps) {
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddUrl = () => {
    if (value.length >= maxImages) {
      toast({ variant: 'destructive', description: `Max ${maxImages} images allowed.` });
      return;
    }
    if (newUrl && (newUrl.startsWith('http'))) {
      onChange([...value, newUrl]);
      setNewUrl('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
        const downloadURL = await uploadImage(file);
        onChange([...value, downloadURL]);
        toast({ description: 'Image uploaded successfully.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload image.' });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {value.map((url, index) => (
                <div key={index} className="relative aspect-square group">
                    <img src={url} alt="Product" className="h-full w-full object-cover rounded-md border" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemove(index)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ))}
        </div>
       
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
              <label htmlFor="file-upload" className="block text-sm font-medium text-primary cursor-pointer hover:underline">
                Upload New Image
              </label>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*"/>
            </div>
          )}
        </div>

        <div className="flex gap-2">
            <Input
                placeholder="Or paste Storage URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
            />
            <Button onClick={handleAddUrl} type="button" variant="outline">Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}
