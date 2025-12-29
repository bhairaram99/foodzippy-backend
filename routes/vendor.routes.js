import express from 'express';
import { registerVendor } from '../controllers/vendor.controller.js';
import upload from '../middleware/upload.js';
import combinedAuth from '../middleware/combinedAuth.js';

const router = express.Router();

router.post('/register', upload.single('restaurantImage'), combinedAuth, registerVendor);

export default router;
