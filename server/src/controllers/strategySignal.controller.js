const {
  createSignal,
  getSignals,
  processSignal,
} = require("../services/strategySignal.service");

const createStrategySignal = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (
      !strategyId ||
      !symbol ||
      !exchange ||
      !instrumentType ||
      !optionType ||
      strikePrice === undefined ||
      !expiryDate ||
      !transactionType ||
      !orderType ||
      !quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Required signal fields are missing",
      });
    }

    if (orderType === "LIMIT" && price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Price is required for LIMIT orders",
      });
    }

    const signal = await createSignal({
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
    });

    res.status(201).json({
      success: true,
      message: "Strategy signal created successfully",
      signal,
    });
  } catch (error) {
    console.error("Create signal error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create strategy signal",
    });
  }
};

const getStrategySignals = async (req, res) => {
  try {
    const signals = await getSignals(
      req.query.strategyId || null
    );

    res.status(200).json({
      success: true,
      count: signals.length,
      signals,
    });
  } catch (error) {
    console.error("Get signals error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch strategy signals",
    });
  }
};

const processStrategySignal = async (req, res) => {
  try {
    const result = await processSignal(
      req.params.signalId
    );

    res.status(200).json({
      success: true,
      message: "Strategy signal processed",
      result,
    });
  } catch (error) {
    console.error("Process signal error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStrategySignal,
  getStrategySignals,
  processStrategySignal,
};