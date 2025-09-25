const express = require("express");
const router = express.Router();

const {
  handleCreateOrder,
  handleGetUserOrders,
  handleGetAllOrders,
  handleGetOrderById,
  handleUpdateOrderStatus,
  handleCancelOrder,
  handleGetOrderStats,
  handleSearchOrders,
} = require("../controllers/orders");

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  // Placeholder auth: accept if any identifier is present
  const bodyUserId = req.body?.userId;
  const paramUserId = req.params?.userId;
  const queryUserId = req.query?.userId;
  if (!req.user && !bodyUserId && !paramUserId && !queryUserId) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }
  next();
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }
  next();
};

// Public routes (with authentication)
router.post("/", authenticateUser, handleCreateOrder);
router.get("/user/:userId", authenticateUser, handleGetUserOrders);
router.get("/user", authenticateUser, handleGetUserOrders); // For current user
router.get("/:orderId", authenticateUser, handleGetOrderById);

// Admin routes
router.get("/", requireAdmin, handleGetAllOrders);
router.put("/:orderId/status", requireAdmin, handleUpdateOrderStatus);
router.put("/:orderId/cancel", authenticateUser, handleCancelOrder);
router.get("/stats/overview", requireAdmin, handleGetOrderStats);
router.get("/search/query", requireAdmin, handleSearchOrders);

// Additional utility routes
router.get("/stats/status/:status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.findByStatus(status)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ status, isActive: true });

    return res.status(200).json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Route to get order by order number
router.get("/number/:orderNumber", authenticateUser, async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber })
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
    console.error("Error fetching order by number:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Route to get user's order history with filters
router.get("/user/:userId/history", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Check if user can access this data
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const query = { user: userId, isActive: true };

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
    console.error("Error fetching user order history:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
