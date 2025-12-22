import express from 'express';
import { registerVendor } from '../controllers/vendor.controller.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single('restaurantImage'), registerVendor);

export default router;
