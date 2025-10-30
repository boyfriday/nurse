'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import LeaveApproval from '@/components/headNurse/LeaveApproval';

export default function LeaveRequestsPage() {
    return (
        <ProtectedRoute allowedRole="head_nurse">
            <LeaveApproval />
        </ProtectedRoute>
    );
}