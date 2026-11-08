'use client';

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="w-full h-10 bg-muted animate-pulse" />
      <div className="w-full h-20 bg-background border-b flex items-center px-4">
          <Skeleton className="h-10 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="container mx-auto py-12 px-4">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ))}
          </div>
      </div>
    </div>
  );
}
