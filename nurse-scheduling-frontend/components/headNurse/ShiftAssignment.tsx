'use client';

import { useState, useEffect } from 'react';
import { assignShift } from '../../services/api';
import { toast } from 'react-toastify';
import { Shift } from '../../types';

interface ShiftAssignmentProps {
    shifts: Shift[];
    onAssignmentCreated?: () => void;
}

const ShiftAssignment = ({ shifts, onAssignmentCreated }: ShiftAssignmentProps) => {
    const [nurses, setNurses] = useState<{ id: number; name: string }[]>([]);
    const [selectedShift, setSelectedShift] = useState('');
    const [selectedNurse, setSelectedNurse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNurses([
            { id: 2, name: 'Nurse 1' },
            { id: 3, name: 'Nurse 2' },
            { id: 4, name: 'Nurse 3' }
        ]);
    }, []);

    const handleAssignShift = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedShift || !selectedNurse) {
            toast.error('Please select both a shift and a nurse');
            return;
        }

        setLoading(true);
        try {
            await assignShift({
                shift_id: parseInt(selectedShift),
                user_id: parseInt(selectedNurse)
            });
            toast.success('Shift assigned successfully');
            setSelectedShift('');
            setSelectedNurse('');
            if (onAssignmentCreated) onAssignmentCreated();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to assign shift';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Assign Shift to Nurse</h2>
            <form onSubmit={handleAssignShift}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shift">
                        Select Shift
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="shift"
                        value={selectedShift}
                        onChange={(e) => setSelectedShift(e.target.value)}
                    >
                        <option value="">Select a shift</option>
                        {shifts.map((shift) => (
                            <option key={shift.id} value={shift.id}>
                                {new Date(shift.date_start_time).toLocaleString()} - {new Date(shift.date_end_time).toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nurse">
                        Select Nurse
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="nurse"
                        value={selectedNurse}
                        onChange={(e) => setSelectedNurse(e.target.value)}
                    >
                        <option value="">Select a nurse</option>
                        {nurses.map((nurse) => (
                            <option key={nurse.id} value={nurse.id}>
                                {nurse.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Assigning...' : 'Assign Shift'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShiftAssignment;