'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import Schedule from '@/components/nurse/Schedule';

export default function NurseSchedulePage() {
    return (
        <ProtectedRoute allowedRole="nurse">
            <Schedule />
        </ProtectedRoute>
    );
}