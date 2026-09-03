const Position = require("../models/Position");

const updatePosition = async ({
  order,
  execution,
}) => {
  const position = await Position.findOne({
    user: order.user,
    brokerAccount: order.brokerAccount,
    symbol: order.symbol,
    exchange: order.exchange,
    instrumentType: order.instrumentType,
    optionType: order.optionType,
    strikePrice: order.strikePrice,
    expiryDate: order.expiryDate,
  });

  if (!position) {
    const initialQuantity =
      order.transactionType === "BUY"
        ? execution.quantity
        : -execution.quantity;

    const newPosition = await Position.create({
      user: order.user,
      brokerAccount: order.brokerAccount,

      symbol: order.symbol,
      exchange: order.exchange,
      instrumentType: order.instrumentType,
      optionType: order.optionType,
      strikePrice: order.strikePrice,
      expiryDate: order.expiryDate,

      quantity: initialQuantity,
      averagePrice: execution.price,
      realizedPnL: 0,
      unrealizedPnL: 0,
    });

    return newPosition;
  }

  if (order.transactionType === "BUY") {
    const totalQuantity =
      position.quantity + execution.quantity;

    position.averagePrice =
      (
        position.quantity * position.averagePrice +
        execution.quantity * execution.price
      ) / totalQuantity;

    position.quantity = totalQuantity;
  }

  if (order.transactionType === "SELL") {
    position.quantity -= execution.quantity;
  }

  await position.save();

  return position;
};

const getUserPositions = async (userId) => {
  return Position.find({
    user: userId,
  })
    .populate(
      "brokerAccount",
      "broker accountName"
    )
    .sort({ updatedAt: -1 });
};

module.exports = {
  updatePosition,
  getUserPositions,
};