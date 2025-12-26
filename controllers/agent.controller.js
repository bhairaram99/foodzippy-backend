import Agent from '../models/Agent.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (agentId, agentName) => {
  return jwt.sign(
    { agentId, agentName },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    { expiresIn: '7d' }
  );
};

// @desc    Agent Login
// @route   POST /api/agent/login
// @access  Public
export const agentLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find agent by username
    const agent = await Agent.findOne({ username: username.toLowerCase() });

    if (!agent) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Check if agent is active
    if (!agent.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.',
      });
    }

    // Check password
    const isPasswordValid = await agent.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    // Generate token
    const token = generateToken(agent._id, agent.name);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        username: agent.username,
      },
    });
  } catch (error) {
    console.error('Agent login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get all agents (Admin only)
// @route   GET /api/agents
// @access  Private (Admin)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents',
      error: error.message,
    });
  }
};

// @desc    Create new agent (Admin only)
// @route   POST /api/agents
// @access  Private (Admin)
export const createAgent = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Validation
    if (!name || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, username, and password',
      });
    }

    // Check if username already exists
    const existingAgent = await Agent.findOne({ username: username.toLowerCase() });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Create agent
    const agent = await Agent.create({
      name,
      username: username.toLowerCase(),
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        username: agent.username,
        isActive: agent.isActive,
        createdAt: agent.createdAt,
      },
    });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create agent',
      error: error.message,
    });
  }
};

// @desc    Update agent (Admin only)
// @route   PUT /api/agents/:id
// @access  Private (Admin)
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, isActive } = req.body;

    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    // Check if new username conflicts with another agent
    if (username && username.toLowerCase() !== agent.username) {
      const existingAgent = await Agent.findOne({ username: username.toLowerCase() });
      if (existingAgent) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists',
        });
      }
      agent.username = username.toLowerCase();
    }

    // Update fields
    if (name) agent.name = name;
    if (password) agent.password = password; // Will be hashed by pre-save hook
    if (typeof isActive === 'boolean') agent.isActive = isActive;

    await agent.save();

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        username: agent.username,
        isActive: agent.isActive,
      },
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update agent',
      error: error.message,
    });
  }
};

// @desc    Delete agent (Admin only)
// @route   DELETE /api/agents/:id
// @access  Private (Admin)
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    await Agent.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete agent',
      error: error.message,
    });
  }
};
