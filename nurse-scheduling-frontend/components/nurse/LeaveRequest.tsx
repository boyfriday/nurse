'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { requestLeave } from '../../services/api';
import { toast } from 'react-toastify';
import { ScheduleItem } from '../../types';

interface LeaveRequestProps {
    shift: ScheduleItem;
    onClose: () => void;
}

const LeaveRequest = ({ shift, onClose }: LeaveRequestProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<{ reason: string }>();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: { reason: string }) => {
        setLoading(true);
        try {
            await requestLeave({
                shift_assignment_id: shift.id,
                reason: data.reason
            });
            toast.success('Leave request submitted successfully');
            onClose();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to submit leave request';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Request Leave
                    </h3>
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">
                            Date: {new Date(shift.date_start_time).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                            Time: {new Date(shift.date_start_time).toLocaleTimeString()} - {new Date(shift.date_end_time).toLocaleTimeString()}
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                Reason for Leave
                            </label>
                            <textarea
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.reason ? 'border-red-500' : ''}`}
                                id="reason"
                                rows={4}
                                placeholder="Please provide a reason for your leave request"
                                {...register('reason', { required: 'Reason is required' })}
                            ></textarea>
                            {errors.reason && <p className="text-red-500 text-xs italic mt-1">{errors.reason.message}</p>}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequest;