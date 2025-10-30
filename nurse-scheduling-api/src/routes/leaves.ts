import express from 'express';
import { requestLeave, getAllLeaveRequests, updateLeaveRequestStatus } from '../controllers/leaveController';
import { authMiddleware } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';

const router = express.Router();

// Request leave for a shift (nurse only)
router.post('/leave-requests', authMiddleware, roleCheck('nurse'), requestLeave);

// Get all leave requests (head_nurse only)
router.get('/leave-requests', authMiddleware, roleCheck('head_nurse'), getAllLeaveRequests);

// Approve or reject a leave request (head_nurse only)
router.patch('/leave-requests/:id/approve', authMiddleware, roleCheck('head_nurse'), updateLeaveRequestStatus);

export default router;