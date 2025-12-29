import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    restaurantImage: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    restaurantStatus: {
      type: String,
      enum: ['pending', 'publish', 'reject'],
      default: 'pending',
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    approxDeliveryTime: {
      type: String,
      required: false, // Changed to optional
    },
    approxPriceForTwo: {
      type: Number,
      required: false, // Changed to optional
    },
    certificateCode: {
      type: String,
      required: false, // Changed to optional
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: false, // Changed to optional
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: false, // Changed to optional
    },
    services: {
      type: [String],
      default: [],
    },
    isPureVeg: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    deliveryChargeType: {
      type: String,
      enum: ['fixed', 'dynamic'],
      required: false, // Changed to optional
    },
    fixedCharge: {
      type: Number,
      default: 0,
    },
    dynamicCharge: {
      type: Number,
      default: 0,
    },
    storeCharge: {
      type: Number,
      default: 0,
    },
    deliveryRadius: {
      type: Number,
      required: false, // Changed to optional
    },
    minimumOrderPrice: {
      type: Number,
      required: false, // Changed to optional
    },
    commissionRate: {
      type: Number,
      required: false, // Changed to optional
      min: 0,
      max: 100,
    },
    bankName: {
      type: String,
      trim: true,
    },
    bankCode: {
      type: String,
      trim: true,
    },
    recipientName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    paypalId: {
      type: String,
      trim: true,
    },
    upiId: {
      type: String,
      trim: true,
    },
    searchLocation: {
      type: String,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true, // Keep required
    },
    pincode: {
      type: String,
      required: false, // Changed to optional
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true, // Keep required
    },
    longitude: {
      type: Number,
      required: true, // Keep required
    },
    city: {
      type: String,
      required: false, // Changed to optional
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: false, // Changed to optional
      trim: true,
    },
    mapType: {
      type: String,
      trim: true,
    },
    loginEmail: {
      type: String,
      required: false, // Changed to optional
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
      sparse: true, // Allow multiple null/undefined values
    },
    loginPassword: {
      type: String,
      required: false, // Changed to optional
    },
    categories: {
      type: [String],
      default: [],
    },
    // User Information (Section 7) - Can be Agent or Employee
    createdByName: {
      type: String,
      trim: true,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdByUsername: {
      type: String,
      trim: true,
    },
    createdByRole: {
      type: String,
      enum: ['agent', 'employee'],
      trim: true,
    },
    // Edit Request Management
    editRequested: {
      type: Boolean,
      default: false,
    },
    editApproved: {
      type: Boolean,
      default: false,
    },
    editRequestDate: {
      type: Date,
      default: null,
    },
    editApprovalDate: {
      type: Date,
      default: null,
    },
    editRemark: {
      type: String,
      trim: true,
      default: '',
    },
    // Review Section - Captured by Agent/Employee after vendor registration
    review: {
      followUpDate: {
        type: Date,
        required: true,
      },
      convincingStatus: {
        type: String,
        enum: ['convenience', 'convertible', 'not_convertible'],
        required: true,
      },
      behavior: {
        type: String,
        enum: ['excellent', 'good', 'rude'],
        required: true,
      },
      audioUrl: {
        type: String, // Cloudinary URL for voice recording
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
