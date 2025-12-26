import express from 'express';
import {
  adminLogin,
  getAllVendors,
  getVendorById,
  updateVendor,
  getVendorAnalytics,
  getAllAgentAttendance,
  getAgentAttendanceByAdmin,
  approveVendorEdit,
  rejectVendorEdit,
  getPendingEditRequests,
} from '../controllers/admin.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', adminLogin);

// Vendor routes
router.get('/vendors', adminAuth, getAllVendors);
router.get('/vendors/analytics', adminAuth, getVendorAnalytics);
router.get('/vendors/:id', adminAuth, getVendorById);
router.patch('/vendors/:id', adminAuth, updateVendor);

// Edit request routes
router.get('/edit-requests/pending', adminAuth, getPendingEditRequests);
router.patch('/edit-requests/:id/approve', adminAuth, approveVendorEdit);
router.patch('/edit-requests/:id/reject', adminAuth, rejectVendorEdit);

// Attendance routes
router.get('/attendance', adminAuth, getAllAgentAttendance);
router.get('/attendance/:agentId', adminAuth, getAgentAttendanceByAdmin);

export default router;
