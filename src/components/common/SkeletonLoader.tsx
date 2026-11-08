'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Verifiable Skeleton Loader for Alpha Structure Validation.
 * Use this to verify the Header/Banner/Hero relationship during loading.
 */
export default function SkeletonLoader() {
  return (
    <div className="w-full flex flex-col min-h-screen animate-in fade-in duration-700">
      {/* 1. Top Banner Placeholder */}
      <div className="w-full h-10 md:h-12 bg-muted/40 animate-pulse" />
      
      {/* 2. Header Placeholder (Sticky Target) */}
      <div className="w-full h-20 bg-background border-b flex items-center px-4 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* 3. Hero Placeholder (Separated) */}
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20 max-w-7xl">
        <div className="w-full h-[600px] md:h-[700px] rounded-[3rem] bg-muted/20 border-2 border-dashed border-muted-foreground/10 p-12 md:p-20 flex flex-col justify-center gap-6">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-20 w-full md:w-3/4 rounded-3xl" />
          <Skeleton className="h-12 w-1/2 md:w-1/3 rounded-xl" />
          <div className="flex gap-4 mt-8">
            <Skeleton className="h-20 w-48 rounded-full" />
            <Skeleton className="h-14 w-64 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* 4. Body Content Preview */}
      <div className="container mx-auto px-4 py-20">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-3xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
