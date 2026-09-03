const StrategySignal = require("../models/StrategySignal");
const StrategyAssignment = require("../models/StrategyAssignment");
const Strategy = require("../models/Strategy");

const { createOrder } = require("./order.service");

// Create a strategy signal
const createSignal = async ({
  strategyId,
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
  reason,
}) => {
  const strategy = await Strategy.findById(strategyId);

  if (!strategy) {
    throw new Error("Strategy not found");
  }

  if (strategy.status !== "ACTIVE") {
    throw new Error("Cannot create signal for inactive strategy");
  }

  return StrategySignal.create({
    strategy: strategyId,
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
    reason,
  });
};


// Get strategy signals
const getSignals = async (strategyId = null) => {
  const filter = strategyId ? { strategy: strategyId } : {};

  return StrategySignal.find(filter)
    .sort({ createdAt: -1 })
    .populate("strategy", "name status");
};


// Process signal for all assigned clients
const processSignal = async (signalId) => {
  const signal = await StrategySignal.findById(signalId);

  if (!signal) {
    throw new Error("Strategy signal not found");
  }

  if (signal.status !== "GENERATED") {
    throw new Error("Signal has already been processed");
  }

  // Check strategy
  const strategy = await Strategy.findById(signal.strategy);

  if (!strategy || strategy.status !== "ACTIVE") {
    signal.status = "REJECTED";
    signal.rejectionReason = "Strategy is not active";
    signal.processedAt = new Date();

    await signal.save();

    throw new Error("Strategy is not active");
  }

  // Mark signal as processing
  signal.status = "PROCESSING";
  await signal.save();

  // Get active assignments
  const assignments = await StrategyAssignment.find({
    strategy: signal.strategy,
    status: "ACTIVE",
  });

  if (assignments.length === 0) {
    signal.status = "REJECTED";
    signal.rejectionReason = "No active clients assigned";
    signal.processedAt = new Date();

    await signal.save();

    throw new Error("No active clients assigned to strategy");
  }

  let processed = 0;
  let rejected = 0;

  const results = [];

  for (const assignment of assignments) {
    try {
      /*
       * IMPORTANT:
       *
       * Do not manually check authorization,
       * broker connection, risk rules, etc. here.
       *
       * order.service.js already handles those checks.
       */

      const idempotencyKey =
        `SIGNAL-${signal._id}-${assignment.client}-${assignment.brokerAccount}`;

      const order = await createOrder({
        userId: assignment.client,
        brokerAccountId: assignment.brokerAccount,

        symbol: signal.symbol,
        exchange: signal.exchange,
        instrumentType: signal.instrumentType,
        optionType: signal.optionType,
        strikePrice: signal.strikePrice,
        expiryDate: signal.expiryDate,

        transactionType: signal.transactionType,
        orderType: signal.orderType,
        quantity: signal.quantity,
        price: signal.price,

        orderSource: "STRATEGY",
        strategyId: signal.strategy,

        idempotencyKey,
      });

      processed++;

      results.push({
        client: assignment.client,
        brokerAccount: assignment.brokerAccount,
        success: true,
        orderId: order._id,
      });

    } catch (error) {
      rejected++;

      console.error(
        `Signal processing failed for client ${assignment.client}:`,
        error.message
      );

      results.push({
        client: assignment.client,
        brokerAccount: assignment.brokerAccount,
        success: false,
        message: error.message,
      });
    }
  }

  // Mark processing completion
  signal.processedAt = new Date();

  if (processed > 0 && rejected === 0) {
    signal.status = "PROCESSED";
  } else if (processed > 0 && rejected > 0) {
    signal.status = "PARTIALLY_PROCESSED";
  } else {
    signal.status = "REJECTED";
    signal.rejectionReason =
      "Signal could not be processed for any assigned client";
  }

  await signal.save();

  return {
    signal,
    processed,
    rejected,
    results,
  };
};


module.exports = {
  createSignal,
  getSignals,
  processSignal,
};