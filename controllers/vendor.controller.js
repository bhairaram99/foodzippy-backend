import Vendor from '../models/Vendor.js';
import cloudinary from '../config/cloudinary.js';

export const registerVendor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant image is required',
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'foodzippy/vendors',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Helper to parse array fields
    const parseArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [field];
      } catch {
        return [field];
      }
    };

    // Parse form data
    const vendorData = {
      restaurantName: req.body.restaurantName,
      restaurantImage: uploadResult,
      restaurantStatus: 'pending', // Force pending status
      rating: req.body.rating || 0,
      approxDeliveryTime: req.body.approxDeliveryTime,
      approxPriceForTwo: req.body.approxPriceForTwo,
      certificateCode: req.body.certificateCode,
      mobileNumber: req.body.mobileNumber,
      shortDescription: req.body.shortDescription,
      services: parseArrayField(req.body.services),
      isPureVeg: req.body.isPureVeg === 'true',
      isPopular: req.body.isPopular === 'true',
      deliveryChargeType: req.body.deliveryChargeType,
      fixedCharge: req.body.fixedCharge || 0,
      dynamicCharge: req.body.dynamicCharge || 0,
      storeCharge: req.body.storeCharge || 0,
      deliveryRadius: req.body.deliveryRadius,
      minimumOrderPrice: req.body.minimumOrderPrice,
      commissionRate: req.body.commissionRate,
      bankName: req.body.bankName,
      bankCode: req.body.bankCode,
      recipientName: req.body.recipientName,
      accountNumber: req.body.accountNumber,
      paypalId: req.body.paypalId,
      upiId: req.body.upiId,
      searchLocation: req.body.searchLocation,
      fullAddress: req.body.fullAddress,
      pincode: req.body.pincode,
      landmark: req.body.landmark,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      city: req.body.city,
      state: req.body.state,
      mapType: req.body.mapType,
      loginEmail: req.body.loginEmail,
      loginPassword: req.body.loginPassword,
      categories: parseArrayField(req.body.categories),
      agentName: req.body.agentName,
    };

    const vendor = await Vendor.create(vendorData);

    res.status(201).json({
      success: true,
      message: 'Vendor registration submitted successfully',
      data: vendor,
    });
  } catch (error) {
    console.error('Vendor Registration Error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

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
      message: 'Failed to register vendor',
      error: error.message,
    });
  }
};
