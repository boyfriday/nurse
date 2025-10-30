'use client';

import { useState, useEffect } from 'react';
import { getMySchedule } from '../../services/api';
import { format } from 'date-fns';
import LeaveRequest from './LeaveRequest';
import { ScheduleItem } from '../../types';

const Schedule = () => {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState(new Date());
    const [showLeaveRequest, setShowLeaveRequest] = useState(false);
    const [selectedShift, setSelectedShift] = useState<ScheduleItem | null>(null);

    useEffect(() => {
        fetchSchedule();
    }, [selectedWeek]);

    const fetchSchedule = async () => {
        try {
            // Calculate start and end of the week
            const startOfWeek = new Date(selectedWeek);
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            startOfWeek.setDate(diff);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const startDate = format(startOfWeek, 'yyyy-MM-dd');
            const endDate = format(endOfWeek, 'yyyy-MM-dd');

            const response = await getMySchedule({ startDate, endDate });
            if (response.success && response.data) {
                setSchedule(response.data.schedule);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setLoading(false);
        }
    };

    const handleWeekChange = (direction: 'next' | 'prev') => {
        const newWeek = new Date(selectedWeek);
        newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
        setSelectedWeek(newWeek);
    };

    const handleRequestLeave = (shift: ScheduleItem) => {
        setSelectedShift(shift);
        setShowLeaveRequest(true);
    };

    const handleLeaveRequestClose = () => {
        setShowLeaveRequest(false);
        setSelectedShift(null);
        fetchSchedule();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Schedule</h1>

            <div className="flex justify-between items-center mb-6">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleWeekChange('prev')}
                >
                    Previous Week
                </button>
                <h2 className="text-xl font-semibold">
                    {format(new Date(selectedWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 1)), 'MMM dd, yyyy')} -
                    {format(new Date(selectedWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 7)), 'MMM dd, yyyy')}
                </h2>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleWeekChange('next')}
                >
                    Next Week
                </button>
            </div>

            {schedule.length === 0 ? (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                    <p>No shifts assigned for this week.</p>
                </div>
            ) : (
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
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((shift) => (
                                <tr key={shift.id}>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {format(new Date(shift.date_start_time), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {format(new Date(shift.date_start_time), 'HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {format(new Date(shift.date_end_time), 'HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {shift.leaveRequest ? (
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${shift.leaveRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    shift.leaveRequest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {shift.leaveRequest.status}
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Scheduled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                                        {!shift.leaveRequest && (
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                onClick={() => handleRequestLeave(shift)}
                                            >
                                                Request Leave
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showLeaveRequest && selectedShift && (
                <LeaveRequest
                    shift={selectedShift}
                    onClose={handleLeaveRequestClose}
                />
            )}
        </div>
    );
};

export default Schedule;