import UserDirectory from '@/components/admin/UserDirectory';
import AuthGuard from '@/components/auth/AuthGuard';

export default function AdminUsersPage() {
    return (
        <AuthGuard allowedRoles={['admin']}>
            <UserDirectory />
        </AuthGuard>
    );
}
