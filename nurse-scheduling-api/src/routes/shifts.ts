import express from 'express';
import { createShift, assignShift, getMySchedule } from '../controllers/shiftController';
import { authMiddleware } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';

const router = express.Router();

// Create a new shift (head_nurse only)
router.post('/shifts', authMiddleware, roleCheck('head_nurse'), createShift);

// Assign a shift to a nurse (head_nurse only)
router.post('/shift-assignments', authMiddleware, roleCheck('head_nurse'), assignShift);

// Get nurse's own schedule
router.get('/my-schedule', authMiddleware, getMySchedule);

export default router;