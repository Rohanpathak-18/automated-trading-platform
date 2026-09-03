const Order = require("../models/Order");
const BrokerAccount = require("../models/BrokerAccount");

const authorizationService = require("./authorization.service");
const riskService = require("./risk.service");
const { createAuditLog } = require("./audit.service");

const { addOrderToQueue } = require("../queues/order.queue");


// ===============================
// CREATE ORDER
// ===============================

const createOrder = async ({
  userId,
  brokerAccountId,
  auditUserId = null,

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
  const isAuthorized =
    await authorizationService.isTradingAuthorized(userId);

  if (!isAuthorized) {
    throw new Error("Trading is not authorized for today");
  }


  // 2. Check broker account
  const brokerAccount =
    await BrokerAccount.findOne({
      _id: brokerAccountId,
      user: userId,
      isConnected: true,
    });

  if (!brokerAccount) {
    throw new Error(
      "Connected broker account not found"
    );
  }


  // 3. Risk validation
  await riskService.validateOrderRisk({
    userId,
    quantity,
    orderType,
    price,
  });


  // 4. Idempotency check
  const existingOrder =
    await Order.findOne({
      idempotencyKey,
    });

  if (existingOrder) {
    return existingOrder;
  }


  // 5. LIMIT order validation
  if (
    orderType === "LIMIT" &&
    (!price || price <= 0)
  ) {
    throw new Error(
      "Price is required for LIMIT orders"
    );
  }


  // 6. Create order
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

    price:
      orderType === "MARKET"
        ? null
        : price,

    status: "AUTHORIZED",

    orderSource:
      orderSource || "STRATEGY",

    strategy:
      strategy || null,

    idempotencyKey,
  });


  // 7. Add order to BullMQ
  try {

    await addOrderToQueue(order._id);

    order.status = "QUEUED";

    await order.save();

  } catch (error) {

    console.error(
      "Failed to queue order:",
      error.message
    );

    order.status = "FAILED";
    order.rejectionReason =
      "Failed to queue order for execution";

    await order.save();

    throw new Error(
      "Order created but failed to enter execution queue"
    );
  }


  // 8. Audit log
  await createAuditLog({
    userId,

    action: "ORDER_CREATED",

    entityType: "Order",

    entityId: order._id,

    description:
      `Order created for ${symbol}`,

    metadata: {
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
      price:

        orderType === "MARKET"
          ? null
          : price,

      orderSource:
        orderSource || "STRATEGY",

      strategy:
        strategy || null,

      status: order.status,
    },
  });


  return order;
};


// ===============================
// GET USER ORDERS
// ===============================

const getUserOrders = async (userId) => {

  return Order.find({
    user: userId,
  })
    .populate(
      "brokerAccount",
      "broker accountName clientId isConnected"
    )
    .populate(
      "strategy",
      "name status"
    )
    .sort({
      createdAt: -1,
    });
};


// ===============================
// GET ORDER BY ID
// ===============================

const getOrderById = async ({
  userId,
  orderId,
}) => {

  const order =
    await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate(
        "brokerAccount",
        "broker accountName clientId isConnected"
      )
      .populate(
        "strategy",
        "name status"
      );

  if (!order) {
    throw new Error(
      "Order not found"
    );
  }

  return order;
};


module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};