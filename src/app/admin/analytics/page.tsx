import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AnalyticsPage() {
    return (
        <AuthGuard allowedRoles={['admin']}>
            <AnalyticsDashboard />
        </AuthGuard>
    );
}
