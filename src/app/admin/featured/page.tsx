import { Suspense } from 'react';
import UiUxControlCenter from '@/components/admin/UiUxControlCenter';
import { Loader2 } from 'lucide-react';

/**
 * Admin UI/UX Hub:
 * Central portal for managing banners, spotlights, and categories.
 * Wrapped in Suspense to support useSearchParams deep-linking.
 */
export default function AdminUiUxPage() {
    return (
        <div className="container mx-auto">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="font-black text-muted-foreground uppercase tracking-widest">Waking up CMS Suite...</p>
                </div>
            }>
                <UiUxControlCenter />
            </Suspense>
        </div>
    );
}
