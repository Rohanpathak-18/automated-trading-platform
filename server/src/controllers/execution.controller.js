const Execution = require("../models/Execution");

// GET /api/executions/my
const getMyExecutions = async (req, res) => {
  try {
    const executions = await Execution.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("order");

    res.status(200).json({
      success: true,
      count: executions.length,
      executions,
    });
  } catch (error) {
    console.error("Get executions error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch executions",
    });
  }
};

module.exports = {
  getMyExecutions,
};