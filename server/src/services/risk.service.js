const Order = require("../models/Order");
const RiskRule = require("../models/RiskRule");

const validateOrderRisk = async ({
  userId,
  quantity,
  orderType,
  price,
}) => {
  // Get active risk rule
  const riskRule = await RiskRule.findOne({
    isActive: true,
  });

  // If no rule exists, use safe defaults
  const maxOrderQuantity =
    riskRule?.maxOrderQuantity || 1000;

  const maxOrdersPerDay =
    riskRule?.maxOrdersPerDay || 100;

  const maxOpenOrders =
    riskRule?.maxOpenOrders || 20;

  // 1. Quantity validation
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (quantity > maxOrderQuantity) {
    throw new Error(
      `Order quantity exceeds maximum allowed quantity of ${maxOrderQuantity}`
    );
  }

  // 2. LIMIT order price validation
  if (orderType === "LIMIT") {
    if (!price || price <= 0) {
      throw new Error(
        "Valid price is required for LIMIT orders"
      );
    }
  }

  // 3. Count today's orders
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const ordersToday = await Order.countDocuments({
    user: userId,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  if (ordersToday >= maxOrdersPerDay) {
    throw new Error(
      `Daily order limit of ${maxOrdersPerDay} reached`
    );
  }

  // 4. Count currently open orders
  const openOrders = await Order.countDocuments({
    user: userId,
    status: {
      $in: [
        "CREATED",
        "VALIDATING",
        "AUTHORIZED",
        "QUEUED",
        "SUBMITTED",
        "OPEN",
        "PARTIALLY_FILLED",
      ],
    },
  });

  if (openOrders >= maxOpenOrders) {
    throw new Error(
      `Maximum open order limit of ${maxOpenOrders} reached`
    );
  }

  return {
    allowed: true,
  };
};

module.exports = {
  validateOrderRisk,
};