const Order = require("../models/Order");
const BrokerAccount = require("../models/BrokerAccount");
const authorizationService = require("./authorization.service");
const riskService = require("./risk.service");
const { addOrderToQueue } = require("../queues/order.queue");

const createOrder = async ({
  userId,
  brokerAccountId,
  symbol,
  exchange,
  instrumentType,
  optionType,
  strikePrice,
  expiryDate,
  transactionType,
  orderType,
  quantity,
  price,
  orderSource,
  strategy,
  idempotencyKey,
}) => {
  // 1. Check daily trading authorization
  const isAuthorized = await authorizationService.isTradingAuthorized(userId);

  if (!isAuthorized) {
    throw new Error("Trading is not authorized for today");
  }

  // 2. Check broker account
  const brokerAccount = await BrokerAccount.findOne({
    _id: brokerAccountId,
    user: userId,
    isConnected: true,
  });

  if (!brokerAccount) {
    throw new Error("Connected broker account not found");
  }

  // 3. Risk validation
  await riskService.validateOrderRisk({
    userId,
    quantity,
    orderType,
    price,
  });

  // 3. Check duplicate order
  const existingOrder = await Order.findOne({
    idempotencyKey,
  });

  if (existingOrder) {
    return existingOrder;
  }

  // 4. Validate LIMIT order price
  if (orderType === "LIMIT" && (!price || price <= 0)) {
    throw new Error("Price is required for LIMIT orders");
  }

  // 5. Create order
  const order = await Order.create({
    user: userId,
    brokerAccount: brokerAccountId,

    symbol,
    exchange,
    instrumentType,
    optionType,
    strikePrice,
    expiryDate,

    transactionType,
    orderType,

    quantity,
    price: orderType === "MARKET" ? null : price,

    status: "AUTHORIZED",

    orderSource: orderSource || "STRATEGY",

    strategy: strategy || null,

    idempotencyKey,
  });
  
  await addOrderToQueue(order._id);

  order.status = "QUEUED";

  await order.save();

  return order;
};


const getUserOrders = async (userId) => {
  return Order.find({
    user: userId,
  })
    .populate("brokerAccount", "broker accountName clientId isConnected")
    .sort({ createdAt: -1 });
};

const getOrderById = async ({ userId, orderId }) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).populate("brokerAccount", "broker accountName clientId isConnected");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};
