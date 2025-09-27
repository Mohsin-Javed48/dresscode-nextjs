const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cloth",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    shippingAddress: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
        default: "United States",
      },
    },
    paymentInfo: {
      method: {
        type: String,
        enum: [
          "credit_card",
          "debit_card",
          "paypal",
          "stripe",
          "cash_on_delivery",
        ],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: {
        type: String,
        trim: true,
      },
      paidAt: {
        type: Date,
      },
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      shippingCost: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      discount: {
        type: Number,
        min: 0,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Virtual for full shipping name
orderSchema.virtual("shippingAddress.fullName").get(function () {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Ensure orderNumber exists before validation
orderSchema.pre("validate", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Instance method to calculate total
orderSchema.methods.calculateTotal = function () {
  this.pricing.subtotal = this.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  this.pricing.total =
    this.pricing.subtotal + this.pricing.shippingCost + this.pricing.discount;
  return this.pricing.total;
};

// Instance method to update order status
orderSchema.methods.updateStatus = function (newStatus, additionalData = {}) {
  this.status = newStatus;

  if (newStatus === "shipped" && additionalData.trackingNumber) {
    this.trackingNumber = additionalData.trackingNumber;
  }

  if (newStatus === "delivered") {
    this.deliveredAt = new Date();
  }

  if (newStatus === "cancelled") {
    this.isActive = false;
  }

  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function (userId, options = {}) {
  const query = { user: userId, isActive: true };

  if (options.status) {
    query.status = options.status;
  }

  return this.find(query)
    .populate("user", "firstName lastName email")
    .populate("items.product", "name image price category")
    .sort({ created_at: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function (status) {
  return this.find({ status, isActive: true })
    .populate("user", "firstName lastName email")
    .populate("items.product", "name image price category")
    .sort({ created_at: -1 });
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = function (startDate, endDate) {
  const matchStage = {
    isActive: true,
  };

  if (startDate && endDate) {
    matchStage.created_at = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$pricing.total" },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: "$count" },
        totalRevenue: { $sum: "$totalRevenue" },
        statusBreakdown: {
          $push: {
            status: "$_id",
            count: "$count",
            revenue: "$totalRevenue",
          },
        },
      },
    },
  ]);
};

// Index for better query performance
orderSchema.index({ user: 1, created_at: -1 });
orderSchema.index({ status: 1, created_at: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "paymentInfo.transactionId": 1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
