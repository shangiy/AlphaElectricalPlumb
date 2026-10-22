'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/storage';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ value, onChange, maxImages = 7 }: ImageUploadProps) {
  const { toast } = useToast();
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = () => {
    if (value.length >= maxImages) {
      toast({ variant: 'destructive', description: `Max ${maxImages} images allowed.` });
      return;
    }
    if (newUrl && newUrl.startsWith('http')) {
      onChange([...value, newUrl]);
      setNewUrl('');
      setError(null);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    try {
        const downloadURL = await uploadImage(file);
        onChange([...value, downloadURL]);
        toast({ title: 'Image Uploaded!', description: 'The file was successfully saved to Supabase Storage.' });
    } catch (error: any) {
        const msg = error.message || 'Could not upload image.';
        setError(msg);
        toast({ 
            variant: 'destructive', 
            title: 'Upload Failed', 
            description: msg 
        });
    } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = '';
    }
  };

  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="p-4 space-y-4">
        {error && (
            <Alert variant="destructive" className="bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {value.map((url, index) => (
                <div key={`${url}-${index}`} className="relative aspect-square group">
                    <img src={url} alt="Product" className="h-full w-full object-cover rounded-md border bg-white shadow-sm" />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={() => handleRemove(index)}
                        type="button"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ))}
        </div>
       
        <div className="border-2 border-dashed rounded-xl p-8 text-center bg-background/50 hover:bg-background transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-bold text-primary">Uploading to Supabase...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <div>
                  <label htmlFor="file-upload" className="block text-sm font-black text-primary cursor-pointer hover:underline uppercase tracking-wider">
                    Upload New Image
                  </label>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase">JPG, PNG, or WEBP (Max 5MB)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*"/>
            </div>
          )}
        </div>

        <div className="flex gap-2">
            <Input
                placeholder="Or paste an existing Storage URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="rounded-full bg-background"
            />
            <Button onClick={handleAddUrl} type="button" variant="outline" className="rounded-full px-6">Add URL</Button>
        </div>
      </CardContent>
    </Card>
  );
}
