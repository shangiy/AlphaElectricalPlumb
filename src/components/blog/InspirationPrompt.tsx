'use client';

import { useEffect, useState } from 'react';
import { generateInspirationPrompt, type GenerateInspirationPromptOutput } from '@/ai/flows/generate-inspiration-prompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function InspirationPrompt() {
  const [inspiration, setInspiration] = useState<GenerateInspirationPromptOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInspiration() {
      try {
        const result = await generateInspirationPrompt();
        if (result && result.shouldSuggest) {
          setInspiration(result);
        }
      } catch (error) {
        console.error('Failed to generate inspiration prompt:', error);
      } finally {
        setLoading(false);
      }
    }
    getInspiration();
  }, []);

  if (loading) {
    return (
      <Card className="mb-12 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            <span>A Spark of Inspiration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (!inspiration) {
    return null; // Don't render anything if AI decides not to suggest a prompt
  }

  return (
    <Card className="mb-12 bg-primary/5 border-dashed border-primary/20 animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <Lightbulb className="h-5 w-5" />
          <span>A Spark of Inspiration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground/90 italic">
          "{inspiration.prompt}"
        </p>
      </CardContent>
    </Card>
  );
}
