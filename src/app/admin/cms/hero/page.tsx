import { getHeroSlides } from '@/app/actions/cms-actions';
import HeroManager from '@/components/admin/HeroManager';

/**
 * Admin Hero CMS Page:
 * Server Component that fetches hero slides from storefront_settings
 * and hydrates the visual style manager.
 */
export default async function AdminHeroPage() {
    const initialSlides = await getHeroSlides();

    return (
        <div className="container mx-auto py-6">
            <HeroManager initialSlides={initialSlides} />
        </div>
    );
}
