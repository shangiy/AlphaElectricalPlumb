import { getCategoryCards } from '@/app/actions/cms-actions';
import CategoryManager from '@/components/admin/CategoryManager';

/**
 * Admin Categories CMS Page:
 * Server Component that fetches initial category cards from Supabase 
 * and hydrates the client-side Sortable Manager.
 */
export default async function AdminCategoriesPage() {
    // Fetch initial cards from the 'storefront_settings' table
    const initialCards = await getCategoryCards();

    return (
        <div className="container mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black font-headline text-accent uppercase tracking-tighter">Category Architecture</h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">Manage the visual hierarchy of your homepage collections.</p>
            </div>
            
            {/* Render the Sortable Manager with fetched data */}
            <CategoryManager initialCards={initialCards || []} />
        </div>
    );
}
