import express from 'express';
import {
  agentLogin,
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
} from '../controllers/agent.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public route - Agent login
router.post('/login', agentLogin);

// Admin-only routes - Agent management
router.get('/', adminAuth, getAllAgents);
router.post('/', adminAuth, createAgent);
router.put('/:id', adminAuth, updateAgent);
router.delete('/:id', adminAuth, deleteAgent);

export default router;
