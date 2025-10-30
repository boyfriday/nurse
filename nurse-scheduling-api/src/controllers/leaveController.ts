import { Request, Response } from 'express';
import LeaveRequest from '../models/LeaveRequest';
import ShiftAssignment from '../models/ShiftAssignment';
import User from '../models/User';
import { ApiResponse } from '../types';

// Request leave for a shift (nurse only)
export const requestLeave = async (req: Request, res: Response) => {
    try {
        const { shift_assignment_id, reason } = req.body;

        // Check if assignment exists and belongs to the user
        const assignment = await ShiftAssignment.findByPk(shift_assignment_id);
        if (!assignment) {
            return res.status(400).json({ message: 'Invalid shift assignment' });
        }

        if (assignment.user_id !== (req as any).user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if leave request already exists
        const existingRequest = await LeaveRequest.findOne({
            where: { shift_assignment_id }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Leave request already exists for this shift' });
        }

        // Create leave request
        const leaveRequest = await LeaveRequest.create({
            shift_assignment_id,
            reason
        });

        const response: ApiResponse = {
            success: true,
            data: leaveRequest
        };

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all leave requests (head_nurse only)
export const getAllLeaveRequests = async (req: Request, res: Response) => {
    try {
        const leaveRequests = await LeaveRequest.findAll({
            include: [
                {
                    model: ShiftAssignment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'approver',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const response: ApiResponse = {
            success: true,
            data: { leaveRequests }
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Approve or reject a leave request (head_nurse only)
export const updateLeaveRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const leaveRequest = await LeaveRequest.findByPk(id);
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Update leave request
        leaveRequest.status = status;
        leaveRequest.approved_by = (req as any).user.id;
        await leaveRequest.save();

        const response: ApiResponse = {
            success: true,
            data: leaveRequest
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};