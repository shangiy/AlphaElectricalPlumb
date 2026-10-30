import FeaturedProductManager from '@/components/admin/FeaturedProductManager';

/**
 * Admin Featured Portal:
 * Specialized route for managing the homepage spotlight hierarchy.
 */
export default function AdminFeaturedPage() {
    return (
        <div className="container mx-auto">
            <FeaturedProductManager />
        </div>
    );
}
