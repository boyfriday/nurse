'use client';

import { useState, useEffect } from 'react';
import { getAllLeaveRequests, updateLeaveRequestStatus } from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const LeaveApproval = () => {
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const response = await getAllLeaveRequests();
            if (response.success && response.data) {
                setLeaveRequests(response.data.leaveRequests);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            setLoading(false);
        }
    };

    const handleApproveReject = async (id: number, status: string) => {
        try {
            await updateLeaveRequestStatus(id, status);
            toast.success(`Leave request ${status} successfully`);
            fetchLeaveRequests();
        } catch (error: any) {
            const message = error.response?.data?.message || `Failed to ${status} leave request`;
            toast.error(message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Leave Requests</h1>

            {leaveRequests.length === 0 ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                    <p>No leave requests found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nurse
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map((request) => (
                                <tr key={request.id}>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {request.ShiftAssignment.User.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {format(new Date(request.ShiftAssignment.Shift.date_start_time), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {format(new Date(request.ShiftAssignment.Shift.date_start_time), 'HH:mm')} - {format(new Date(request.ShiftAssignment.Shift.date_end_time), 'HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-200">
                                        <div className="max-w-xs truncate" title={request.reason}>
                                            {request.reason}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {request.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                    onClick={() => handleApproveReject(request.id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                    onClick={() => handleApproveReject(request.id, 'rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveApproval;