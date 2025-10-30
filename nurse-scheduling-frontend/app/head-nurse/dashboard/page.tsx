'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllLeaveRequests } from '@/services/api';

export default function HeadNurseDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalShifts: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getAllLeaveRequests();
            const leaveRequests = response.data?.leaveRequests || [];

            setStats({
                totalShifts: 0, // This would be fetched from another API
                pendingLeaves: leaveRequests.filter(lr => lr.status === 'pending').length,
                approvedLeaves: leaveRequests.filter(lr => lr.status === 'approved').length,
                rejectedLeaves: leaveRequests.filter(lr => lr.status === 'rejected').length
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <ProtectedRoute allowedRole="head_nurse">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <p className="mb-6">Welcome, {user?.name}!</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Shifts</h2>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalShifts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Leaves</h2>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pendingLeaves}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Approved Leaves</h2>
                        <p className="text-3xl font-bold text-green-600">{stats.approvedLeaves}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Rejected Leaves</h2>
                        <p className="text-3xl font-bold text-red-600">{stats.rejectedLeaves}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => router.push('/head-nurse/shifts')}
                            >
                                Manage Shifts
                            </button>
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => router.push('/head-nurse/leave-requests')}
                            >
                                Review Leave Requests
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
                        <p className="text-gray-500">No recent activity to display.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}