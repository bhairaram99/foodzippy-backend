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
  getUnreadEditRequestsCount,
  markEditRequestsAsSeen,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserAttendance,
  getAllUserAttendance,
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
router.get('/edit-requests/unread-count', adminAuth, getUnreadEditRequestsCount);
router.patch('/edit-requests/mark-seen', adminAuth, markEditRequestsAsSeen);
router.patch('/edit-requests/:id/approve', adminAuth, approveVendorEdit);
router.patch('/edit-requests/:id/reject', adminAuth, rejectVendorEdit);

// Attendance routes
router.get('/attendance', adminAuth, getAllAgentAttendance);
router.get('/attendance/:agentId', adminAuth, getAgentAttendanceByAdmin);

// User Management routes (Agents & Employees)
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id', adminAuth, getUserById);
router.post('/users', adminAuth, createUser);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

// User Attendance routes
router.get('/users-attendance', adminAuth, getAllUserAttendance);
router.get('/users-attendance/:userId', adminAuth, getUserAttendance);

export default router;
