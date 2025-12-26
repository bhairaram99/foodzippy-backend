import express from 'express';
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayAttendance,
} from '../controllers/attendance.controller.js';
import agentAuth from '../middleware/agentAuth.js';

const router = express.Router();

// All routes are protected with agentAuth middleware
router.use(agentAuth);

// Agent attendance routes
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/my', getMyAttendance);
router.get('/today', getTodayAttendance);

export default router;
