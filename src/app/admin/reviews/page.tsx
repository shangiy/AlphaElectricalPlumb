import ReviewManager from '@/components/admin/ReviewManager';

/**
 * Admin Review Moderation Page:
 * Server Component that hosts the unified feedback management interface.
 */
export default function AdminReviewsPage() {
    return (
        <div className="container mx-auto">
            <ReviewManager />
        </div>
    );
}
