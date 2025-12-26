import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Vendor from '../models/Vendor.js';
import AgentAttendance from '../models/AgentAttendance.js';
import Agent from '../models/Agent.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        email: adminEmail,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, city, search, agentId } = req.query;

    const filter = {};

    if (status) {
      filter.restaurantStatus = status;
    }

    if (city) {
      filter.city = city;
    }

    if (agentId) {
      filter.agentId = agentId;
    }

    if (search) {
      filter.$or = [
        { restaurantName: { $regex: search, $options: 'i' } },
        { loginEmail: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const vendors = await Vendor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Vendor.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: vendors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get All Vendors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: error.message,
    });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id).lean();

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error('Get Vendor By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor',
      error: error.message,
    });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendor,
    });
  } catch (error) {
    console.error('Update Vendor Error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update vendor',
      error: error.message,
    });
  }
};

export const getVendorAnalytics = async (req, res) => {
  try {
    const analytics = await Vendor.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
    ]);

    const totalVendors = await Vendor.countDocuments();
    const pendingVendors = await Vendor.countDocuments({ restaurantStatus: 'pending' });
    const approvedVendors = await Vendor.countDocuments({ restaurantStatus: 'publish' });
    const rejectedVendors = await Vendor.countDocuments({ restaurantStatus: 'reject' });

    res.status(200).json({
      success: true,
      data: {
        monthlyRequests: analytics,
        summary: {
          total: totalVendors,
          pending: pendingVendors,
          approved: approvedVendors,
          rejected: rejectedVendors,
        },
      },
    });
  } catch (error) {
    console.error('Get Vendor Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

// ========================================
// ADMIN ATTENDANCE MANAGEMENT
// ========================================

// @desc    Get all agents' attendance
// @route   GET /api/admin/attendance
// @access  Private (Admin)
export const getAllAgentAttendance = async (req, res) => {
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
    // Default: current month
    else {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await AgentAttendance.find(query)
      .populate('agentId', 'name username email agentType profileImage')
      .sort({ date: -1, checkIn: -1 });

    // Calculate summary statistics
    const totalRecords = attendance.length;
    const uniqueAgents = [...new Set(attendance.map(a => a.agentId?._id.toString()))].length;
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const halfDayCount = attendance.filter(a => a.status === 'Half-Day').length;

    res.status(200).json({
      success: true,
      count: totalRecords,
      summary: {
        totalRecords,
        uniqueAgents,
        presentCount,
        halfDayCount,
      },
      attendance,
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message,
    });
  }
};

// @desc    Get specific agent's attendance (Admin view)
// @route   GET /api/admin/attendance/agent/:agentId
// @access  Private (Admin)
export const getAgentAttendanceByAdmin = async (req, res) => {
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
    // Default: last 30 days
    else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      query.date = { $gte: start, $lte: end };
    }

    const attendance = await AgentAttendance.find(query).sort({ date: -1 });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const halfDays = attendance.filter(a => a.status === 'Half-Day').length;
    const totalMinutes = attendance.reduce((sum, a) => sum + a.duration, 0);
    const avgDuration = totalDays > 0 ? Math.floor(totalMinutes / totalDays) : 0;

    res.status(200).json({
      success: true,
      agent: {
        id: agent._id,
        name: agent.name,
        username: agent.username,
        email: agent.email,
        agentType: agent.agentType,
        profileImage: agent.profileImage,
      },
      statistics: {
        totalDays,
        presentDays,
        halfDays,
        totalHours: Math.floor(totalMinutes / 60),
        avgHoursPerDay: Math.floor(avgDuration / 60),
      },
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error('Get agent attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent attendance',
      error: error.message,
    });
  }
};

// @desc    Approve vendor edit request
// @route   PUT /api/admin/vendors/:id/approve-edit
// @access  Private (Admin)
export const approveVendorEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    if (!vendor.editRequested) {
      return res.status(400).json({
        success: false,
        message: 'No edit request found for this vendor',
      });
    }

    vendor.editApproved = true;
    vendor.editApprovalDate = new Date();

    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Edit request approved successfully',
      vendor,
    });
  } catch (error) {
    console.error('Approve edit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve edit request',
      error: error.message,
    });
  }
};

// @desc    Reject vendor edit request
// @route   PUT /api/admin/vendors/:id/reject-edit
// @access  Private (Admin)
export const rejectVendorEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    if (!vendor.editRequested) {
      return res.status(400).json({
        success: false,
        message: 'No edit request found for this vendor',
      });
    }

    vendor.editRequested = false;
    vendor.editApproved = false;
    vendor.editRequestDate = null;
    vendor.editRemark = '';

    await vendor.save();

    res.status(200).json({
      success: true,
      message: 'Edit request rejected successfully',
      vendor,
    });
  } catch (error) {
    console.error('Reject edit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject edit request',
      error: error.message,
    });
  }
};

// @desc    Get vendors with pending edit requests
// @route   GET /api/admin/vendors/edit-requests
// @access  Private (Admin)
export const getPendingEditRequests = async (req, res) => {
  try {
    const vendors = await Vendor.find({ editRequested: true, editApproved: false })
      .populate('agentId', 'name username email')
      .sort({ editRequestDate: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error('Get edit requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch edit requests',
      error: error.message,
    });
  }
};
