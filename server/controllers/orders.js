const Order = require("../models/orders");
const User = require("../models/user");
const Cloth = require("../models/cloths");
const emailService = require("../services/emailService");

// Create a new order
async function handleCreateOrder(req, res) {
  try {
    const orderData = req.body;
    console.log("orderData", orderData);

    const { items, shippingAddress, paymentInfo, pricing, notes, userId } =
      orderData || {};

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    // Basic shipping address validation
    const requiredShipFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    for (const f of requiredShipFields) {
      if (!shippingAddress?.[f]) {
        return res
          .status(400)
          .json({ message: `shippingAddress.${f} is required` });
      }
    }

    // Fetch product details and compute line totals
    const productIds = items.map((i) => i.product);
    const products = await Cloth.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const normalizedItems = [];
    for (const line of items) {
      const prod = productMap.get(String(line.product));
      if (!prod) {
        return res
          .status(400)
          .json({ message: `Product not found: ${line.product}` });
      }
      if (!line.size) {
        return res
          .status(400)
          .json({ message: `Size is required for product ${line.product}` });
      }
      const quantity = Number(line.quantity || 0);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return res
          .status(400)
          .json({ message: `Invalid quantity for product ${line.product}` });
      }

      const unitPrice = prod.price;
      const totalPrice = unitPrice * quantity;
      normalizedItems.push({
        product: prod._id,
        quantity,
        size: line.size,
        price: unitPrice,
        totalPrice,
      });
    }

    // Pricing calculation
    const subtotal = normalizedItems.reduce(
      (sum, li) => sum + li.totalPrice,
      0
    );
    const shippingCost = Number(pricing?.shippingCost || 0);
    const discount = Number(pricing?.discount || 0);
    const total = subtotal + shippingCost - discount;

    // Build order document
    const order = await Order.create({
      user: userId,
      items: normalizedItems,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
      },
      paymentInfo: {
        method: paymentInfo?.method || "credit_card",
        status: paymentInfo?.status || "pending",
        transactionId: paymentInfo?.transactionId,
        paidAt: paymentInfo?.paidAt,
      },
      pricing: {
        subtotal,
        shippingCost,
        discount,
        total,
      },
      status: "pending",
      notes: notes || "",
    });

    // Reduce stock for each item
    for (const li of normalizedItems) {
      await Cloth.findByIdAndUpdate(li.product, {
        $inc: { stockAvailable: -li.quantity },
      });
    }

    const populated = await Order.findById(order._id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name image price category");

    // Send order confirmation email
    try {
      console.log("📧 Sending order confirmation email...");
      const emailResult =
        await emailService.sendOrderConfirmationEmail(populated);

      if (emailResult.success) {
        console.log("✅ Order confirmation email sent successfully");
      } else {
        console.error(
          "❌ Failed to send order confirmation email:",
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error("❌ Error sending order confirmation email:", emailError);
      // Don't fail the order creation if email fails
    }

    return res.status(201).json({
      message: "Order created successfully",
      order: populated,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get all orders for a user
async function handleGetUserOrders(req, res) {
  try {
    const userId = req.user?.id || req.params.userId;
    const { status, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    // If the provided userId is not a valid ObjectId (e.g., guest UUID),
    // return an empty list instead of throwing a CastError
    const isValidObjectId = require("mongoose").Types.ObjectId.isValid(userId);
    if (!isValidObjectId) {
      return res.status(200).json({
        orders: [],
        pagination: { current: parseInt(page), pages: 0, total: 0 },
      });
    }

    const options = {};
    if (status) {
      options.status = status;
    }

    const orders = await Order.findByUser(userId, options)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ user: userId, isActive: true });

    return res.status(200).json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get all orders (admin only)
async function handleGetAllOrders(req, res) {
  try {
    const { status, page = 1, limit = 10, startDate, endDate } = req.query;

    const query = { isActive: true };
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.created_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name image price category")
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return res.status(200).json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get order by ID
async function handleGetOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "firstName lastName email phone")
      .populate("items.product", "name image price category description");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check if user can access this order
    const userId = req.user?.id;
    if (
      userId &&
      order.user._id.toString() !== userId &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Update order status
async function handleUpdateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const additionalData = {};
    if (trackingNumber) {
      additionalData.trackingNumber = trackingNumber;
    }

    await order.updateStatus(status, additionalData);

    if (notes) {
      order.notes = notes;
      await order.save();
    }

    // Send order status update email
    try {
      console.log("📧 Sending order status update email...");
      const populatedOrder = await Order.findById(order._id)
        .populate("user", "firstName lastName email")
        .populate("items.product", "name image price category");

      const emailResult = await emailService.sendOrderStatusUpdateEmail(
        populatedOrder,
        status
      );

      if (emailResult.success) {
        console.log("✅ Order status update email sent successfully");
      } else {
        console.error(
          "❌ Failed to send order status update email:",
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error("❌ Error sending order status update email:", emailError);
      // Don't fail the status update if email fails
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        updated_at: order.updated_at,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Cancel order
async function handleCancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    // Update order status
    await order.updateStatus("cancelled");

    // Restore product stock
    for (const item of order.items) {
      await Cloth.findByIdAndUpdate(item.product, {
        $inc: { stockAvailable: item.quantity },
      });
    }

    if (reason) {
      order.notes = reason;
      await order.save();
    }

    // Send order cancellation email
    try {
      console.log("📧 Sending order cancellation email...");
      const populatedOrder = await Order.findById(order._id)
        .populate("user", "firstName lastName email")
        .populate("items.product", "name image price category");

      const emailResult = await emailService.sendOrderStatusUpdateEmail(
        populatedOrder,
        "cancelled"
      );

      if (emailResult.success) {
        console.log("✅ Order cancellation email sent successfully");
      } else {
        console.error(
          "❌ Failed to send order cancellation email:",
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error("❌ Error sending order cancellation email:", emailError);
      // Don't fail the cancellation if email fails
    }

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        cancelled_at: order.updated_at,
      },
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get order statistics
async function handleGetOrderStats(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const stats = await Order.getOrderStats(startDate, endDate);

    return res.status(200).json({
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        statusBreakdown: [],
      },
    });
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Search orders
async function handleSearchOrders(req, res) {
  try {
    const { q, status, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    if (status) {
      query.status = status;
    }

    if (q) {
      query.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { "shippingAddress.firstName": { $regex: q, $options: "i" } },
        { "shippingAddress.lastName": { $regex: q, $options: "i" } },
        { "shippingAddress.email": { $regex: q, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name image price category")
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return res.status(200).json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  handleCreateOrder,
  handleGetUserOrders,
  handleGetAllOrders,
  handleGetOrderById,
  handleUpdateOrderStatus,
  handleCancelOrder,
  handleGetOrderStats,
  handleSearchOrders,
};
