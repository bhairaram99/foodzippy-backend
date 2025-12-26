import express from 'express';
import { registerVendor } from '../controllers/vendor.controller.js';
import upload from '../middleware/upload.js';
import agentAuth from '../middleware/agentAuth.js';

const router = express.Router();

router.post('/register', upload.single('restaurantImage'), agentAuth, registerVendor);

export default router;
