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
      required: true,
    },
    approxPriceForTwo: {
      type: Number,
      required: true,
    },
    certificateCode: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: true,
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
      required: true,
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
      required: true,
    },
    minimumOrderPrice: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      required: true,
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
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    mapType: {
      type: String,
      trim: true,
    },
    loginEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    loginPassword: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    // Agent Information (Section 7)
    agentName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
