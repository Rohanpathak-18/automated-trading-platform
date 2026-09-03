const Strategy = require("../models/Strategy");

// Create strategy
const createStrategy = async (req, res) => {
  try {
    const { name, description, config } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Strategy name is required",
      });
    }

    const strategy = await Strategy.create({
      name,
      description,
      config,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Strategy created successfully",
      strategy,
    });
  } catch (error) {
    console.error("Create strategy error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create strategy",
    });
  }
};

// Get all strategies
const getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      count: strategies.length,
      strategies,
    });
  } catch (error) {
    console.error("Get strategies error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch strategies",
    });
  }
};

// Get single strategy
const getStrategyById = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.strategyId)
      .populate("createdBy", "name email role");

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    res.status(200).json({
      success: true,
      strategy,
    });
  } catch (error) {
    console.error("Get strategy error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch strategy",
    });
  }
};

// Update strategy
const updateStrategy = async (req, res) => {
  try {
    const { name, description, config } = req.body;

    const strategy = await Strategy.findById(req.params.strategyId);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    if (name !== undefined) strategy.name = name;
    if (description !== undefined) strategy.description = description;
    if (config !== undefined) strategy.config = config;

    await strategy.save();

    res.status(200).json({
      success: true,
      message: "Strategy updated successfully",
      strategy,
    });
  } catch (error) {
    console.error("Update strategy error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update strategy",
    });
  }
};

// Activate / deactivate strategy
const updateStrategyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or INACTIVE",
      });
    }

    const strategy = await Strategy.findById(req.params.strategyId);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    strategy.status = status;

    await strategy.save();

    res.status(200).json({
      success: true,
      message: `Strategy ${status.toLowerCase()} successfully`,
      strategy,
    });
  } catch (error) {
    console.error("Update strategy status error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update strategy status",
    });
  }
};

// Delete strategy
const deleteStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findById(req.params.strategyId);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    await strategy.deleteOne();

    res.status(200).json({
      success: true,
      message: "Strategy deleted successfully",
    });
  } catch (error) {
    console.error("Delete strategy error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete strategy",
    });
  }
};

module.exports = {
  createStrategy,
  getStrategies,
  getStrategyById,
  updateStrategy,
  updateStrategyStatus,
  deleteStrategy,
};