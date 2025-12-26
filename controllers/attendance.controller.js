import AgentAttendance from '../models/AgentAttendance.js';
import Agent from '../models/Agent.js';

// @desc    Agent Check-in
// @route   POST /api/agent/attendance/check-in
// @access  Private (Agent)
export const checkIn = async (req, res) => {
  try {
    const agentId = req.agent.agentId;
    const { location } = req.body;

    // Get agent details
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await AgentAttendance.findOne({
      agentId,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today',
        attendance: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = await AgentAttendance.create({
      agentId,
      agentName: agent.name,
      date: today,
      checkIn: new Date(),
      location: {
        checkInLocation: location || {},
      },
    });

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      attendance,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check in',
    });
  }
};

// @desc    Agent Check-out
// @route   POST /api/agent/attendance/check-out
// @access  Private (Agent)
export const checkOut = async (req, res) => {
  try {
    const agentId = req.agent.agentId;
    const { location, remark } = req.body;

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance
    const attendance = await AgentAttendance.findOne({
      agentId,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'You have not checked in today',
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out today',
        attendance,
      });
    }

    // Update check-out
    attendance.checkOut = new Date();
    if (location) {
      attendance.location.checkOutLocation = location;
    }
    if (remark) {
      attendance.remark = remark;
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      attendance,
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check out',
    });
  }
};

// @desc    Get agent's own attendance records
// @route   GET /api/agent/attendance/my
// @access  Private (Agent)
export const getMyAttendance = async (req, res) => {
  try {
    const agentId = req.agent.agentId;
    const { month, year, startDate, endDate } = req.query;

    let query = { agentId };

    // Filter by month and year
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    // Filter by date range
    else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    // Default: current month
    else {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await AgentAttendance.find(query).sort({ date: -1 });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === 'Present').length;
    const halfDays = attendance.filter((a) => a.status === 'Half-Day').length;
    const totalMinutes = attendance.reduce((sum, a) => sum + a.duration, 0);
    const avgDuration = totalDays > 0 ? Math.floor(totalMinutes / totalDays) : 0;

    res.status(200).json({
      success: true,
      count: attendance.length,
      statistics: {
        totalDays,
        presentDays,
        halfDays,
        avgDuration,
        totalHours: Math.floor(totalMinutes / 60),
      },
      attendance,
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch attendance',
    });
  }
};

// @desc    Get today's attendance status
// @route   GET /api/agent/attendance/today
// @access  Private (Agent)
export const getTodayAttendance = async (req, res) => {
  try {
    const agentId = req.agent.agentId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await AgentAttendance.findOne({
      agentId,
      date: today,
    });

    res.status(200).json({
      success: true,
      attendance: attendance || null,
      hasCheckedIn: !!attendance,
      hasCheckedOut: attendance ? !!attendance.checkOut : false,
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch today attendance',
    });
  }
};

// @desc    Get all agents' attendance (Admin only)
// @route   GET /api/admin/attendance
// @access  Private (Admin)
export const getAllAttendance = async (req, res) => {
  try {
    const { agentId, month, year, startDate, endDate, status } = req.query;

    let query = {};

    // Filter by agent
    if (agentId) {
      query.agentId = agentId;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by month and year
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    // Filter by date range
    else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await AgentAttendance.find(query)
      .populate('agentId', 'name username email agentType')
      .sort({ date: -1, checkIn: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch attendance',
    });
  }
};

// @desc    Get specific agent's attendance (Admin only)
// @route   GET /api/admin/attendance/:agentId
// @access  Private (Admin)
export const getAgentAttendance = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { month, year, startDate, endDate } = req.query;

    // Verify agent exists
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found',
      });
    }

    let query = { agentId };

    // Filter by month and year
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    // Filter by date range
    else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await AgentAttendance.find(query).sort({ date: -1 });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === 'Present').length;
    const halfDays = attendance.filter((a) => a.status === 'Half-Day').length;
    const totalMinutes = attendance.reduce((sum, a) => sum + a.duration, 0);

    res.status(200).json({
      success: true,
      agent: {
        id: agent._id,
        name: agent.name,
        username: agent.username,
        email: agent.email,
        agentType: agent.agentType,
      },
      statistics: {
        totalDays,
        presentDays,
        halfDays,
        totalHours: Math.floor(totalMinutes / 60),
      },
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error('Get agent attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch agent attendance',
    });
  }
};
