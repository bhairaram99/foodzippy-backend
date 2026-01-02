import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    // ==========================================
    // DYNAMIC FORM DATA (All form fields go here)
    // ==========================================
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ==========================================
    // VENDOR TYPE (New field)
    // ==========================================
    vendorType: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      default: 'restaurant',
      index: true,
    },

    // ==========================================
    // CORE SYSTEM FIELDS (Non-configurable)
    // ==========================================
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
    fullAddress: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },

    // ==========================================
    // REVIEW SECTION (Structured but Configurable)
    // ==========================================
    review: {
      followUpDate: {
        type: Date,
      },
      convincingStatus: {
        type: String,
        enum: ['convenience', 'convertible', 'not_convertible'],
      },
      behavior: {
        type: String,
        enum: ['excellent', 'good', 'rude'],
      },
      audioUrl: {
        type: String, // Cloudinary URL for voice recording
        trim: true,
      },
    },

    // ==========================================
    // USER TRACKING (Who created this vendor)
    // ==========================================
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

    // ==========================================
    // EDIT REQUEST MANAGEMENT
    // ==========================================
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
    editSeenByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
