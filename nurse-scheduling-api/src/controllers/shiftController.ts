import { Request, Response } from 'express';
import Shift from '../models/Shift';
import ShiftAssignment from '../models/ShiftAssignment';
import User from '../models/User';
import LeaveRequest from '../models/LeaveRequest';
import { Op } from 'sequelize';
import { ApiResponse } from '../types';

// Create a new shift (head_nurse only)
export const createShift = async (req: Request, res: Response) => {
    try {
        const { date_start_time, date_end_time } = req.body;

        const shift = await Shift.create({
            date_start_time,
            date_end_time
        });

        const response: ApiResponse = {
            success: true,
            data: shift
        };

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Assign a shift to a nurse (head_nurse only)
export const assignShift = async (req: Request, res: Response) => {
    try {
        const { user_id, shift_id } = req.body;

        // Check if user exists and is a nurse
        const user = await User.findByPk(user_id);
        if (!user || user.role !== 'nurse') {
            return res.status(400).json({ message: 'Invalid user' });
        }

        // Check if shift exists
        const shift = await Shift.findByPk(shift_id);
        if (!shift) {
            return res.status(400).json({ message: 'Invalid shift' });
        }

        // Check if assignment already exists
        const existingAssignment = await ShiftAssignment.findOne({
            where: { user_id, shift_id }
        });

        if (existingAssignment) {
            return res.status(400).json({ message: 'Shift already assigned to this nurse' });
        }

        // Create assignment
        const assignment = await ShiftAssignment.create({
            user_id,
            shift_id
        });

        const response: ApiResponse = {
            success: true,
            data: assignment
        };

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get nurse's own schedule
export const getMySchedule = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        let whereClause: any = {
            user_id: (req as any).user.id
        };

        // Add date range filter if provided
        if (startDate && endDate) {
            whereClause['$Shift.date_start_time$'] = {
                [Op.between]: [startDate, endDate]
            };
        }

        const assignments = await ShiftAssignment.findAll({
            where: whereClause,
            include: [
                {
                    model: Shift,
                    as: 'shift',
                    attributes: ['id', 'date_start_time', 'date_end_time']
                }
            ],
            order: [
                [{ model: Shift, as: 'shift' }, 'date_start_time', 'ASC']
            ]
        });

        // Get leave requests for these assignments
        const assignmentIds = assignments.map(a => a.id);
        const leaveRequests = await LeaveRequest.findAll({
            where: {
                shift_assignment_id: {
                    [Op.in]: assignmentIds
                }
            }
        });

        // Map leave requests to assignments
        const leaveMap: any = {};
        leaveRequests.forEach(lr => {
            leaveMap[lr.shift_assignment_id] = lr;
        });

        // Format response
        const schedule = assignments.map(assignment => {
            const shift = (assignment as any).shift;
            const leaveRequest = leaveMap[assignment.id];

            return {
                id: assignment.id,
                date_start_time: shift.date_start_time,
                date_end_time: shift.date_end_time,
                leaveRequest: leaveRequest ? {
                    id: leaveRequest.id,
                    reason: leaveRequest.reason,
                    status: leaveRequest.status
                } : null
            };
        });

        const response: ApiResponse = {
            success: true,
            data: { schedule }
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

