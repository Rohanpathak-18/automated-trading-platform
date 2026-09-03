const Execution = require("../models/Execution");

const createExecution = async ({
  order,
  brokerOrderId,
  quantity,
  price,
}) => {
  const existingExecution = await Execution.findOne({
    order: order._id,
  });

  if (existingExecution) {
    return existingExecution;
  }

  const execution = await Execution.create({
    order: order._id,
    user: order.user,
    brokerOrderId,

    symbol: order.symbol,
    exchange: order.exchange,

    transactionType: order.transactionType,

    quantity,
    price,

    executedAt: new Date(),
  });

  return execution;
};

module.exports = {
  createExecution,
};