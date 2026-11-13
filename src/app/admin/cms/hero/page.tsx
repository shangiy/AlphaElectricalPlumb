import { getHeroSlides } from '@/app/actions/cms-actions';
import HeroManager from '@/components/admin/HeroManager';
import AuthGuard from '@/components/auth/AuthGuard';

/**
 * Admin Hero CMS Page:
 * Server Component that fetches hero slides from storefront_settings
 * and hydrates the visual style manager.
 * Restricted to full administrators.
 */
export default async function AdminHeroPage() {
    const initialSlides = await getHeroSlides();

    return (
        <AuthGuard allowedRoles={['admin']}>
            <div className="container mx-auto py-6">
                <HeroManager initialSlides={initialSlides} />
            </div>
        </AuthGuard>
    );
}
