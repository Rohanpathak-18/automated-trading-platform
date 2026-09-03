const orderService = require("../services/order.service");

const createOrder = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (
      !brokerAccountId ||
      !symbol ||
      !exchange ||
      !instrumentType ||
      !optionType ||
      strikePrice === undefined ||
      !expiryDate ||
      !transactionType ||
      !orderType ||
      !quantity ||
      !idempotencyKey
    ) {
      return res.status(400).json({
        success: false,
        message: "Required order fields are missing",
      });
    }

    const order = await orderService.createOrder({
      userId: req.user._id,

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
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(
      req.user._id
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById({
      userId: req.user._id,
      orderId: req.params.orderId,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
};