import express from 'express';
import {
  adminLogin,
  getAllVendors,
  getVendorById,
  updateVendor,
  getVendorAnalytics,
} from '../controllers/admin.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/login', adminLogin);

router.get('/vendors', adminAuth, getAllVendors);
router.get('/vendors/analytics', adminAuth, getVendorAnalytics);
router.get('/vendors/:id', adminAuth, getVendorById);
router.patch('/vendors/:id', adminAuth, updateVendor);

export default router;
