'use client';

import { useForm } from 'react-hook-form';
import { createShift } from '../../services/api';
import { toast } from 'react-toastify';

interface ShiftFormData {
    date_start_time: string;
    date_end_time: string;
}

interface ShiftFormProps {
    onShiftCreated?: () => void;
}

const ShiftForm = ({ onShiftCreated }: ShiftFormProps) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ShiftFormData>();

    const onSubmit = async (data: ShiftFormData) => {
        try {
            await createShift(data);
            toast.success('Shift created successfully');
            reset();
            if (onShiftCreated) onShiftCreated();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create shift';
            toast.error(message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create New Shift</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_start_time">
                        Start Date & Time
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date_start_time ? 'border-red-500' : ''}`}
                        id="date_start_time"
                        type="datetime-local"
                        {...register('date_start_time', { required: 'Start date and time is required' })}
                    />
                    {errors.date_start_time && <p className="text-red-500 text-xs italic mt-1">{errors.date_start_time.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_end_time">
                        End Date & Time
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.date_end_time ? 'border-red-500' : ''}`}
                        id="date_end_time"
                        type="datetime-local"
                        {...register('date_end_time', { required: 'End date and time is required' })}
                    />
                    {errors.date_end_time && <p className="text-red-500 text-xs italic mt-1">{errors.date_end_time.message}</p>}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create Shift
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShiftForm;