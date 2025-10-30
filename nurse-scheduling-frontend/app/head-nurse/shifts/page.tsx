'use client';

import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useState, useEffect } from 'react';
import ShiftForm from '@/components/headNurse/ShiftForm';
import ShiftAssignment from '@/components/headNurse/ShiftAssignment';
import { getMySchedule } from '@/services/api';
import { Shift } from '@/types';

export default function ShiftManagementPage() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            // In a real app, you would have an API to get all shifts
            // For this example, we'll use mock data
            setShifts([
                { id: 1, date_start_time: '2023-06-01T08:00:00', date_end_time: '2023-06-01T16:00:00' },
                { id: 2, date_start_time: '2023-06-01T16:00:00', date_end_time: '2023-06-02T00:00:00' },
                { id: 3, date_start_time: '2023-06-02T08:00:00', date_end_time: '2023-06-02T16:00:00' },
                { id: 4, date_start_time: '2023-06-02T16:00:00', date_end_time: '2023-06-03T00:00:00' }
            ]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching shifts:', error);
            setLoading(false);
        }
    };

    const handleShiftCreated = () => {
        fetchShifts();
    };

    const handleAssignmentCreated = () => {
        // In a real app, you might want to refresh the assignments list
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <ProtectedRoute allowedRole="head_nurse">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Shift Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ShiftForm onShiftCreated={handleShiftCreated} />
                    <ShiftAssignment shifts={shifts} onAssignmentCreated={handleAssignmentCreated} />
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">All Shifts</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Time
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.map((shift) => (
                                    <tr key={shift.id}>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                            {new Date(shift.date_start_time).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                            {new Date(shift.date_start_time).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                            {new Date(shift.date_end_time).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}