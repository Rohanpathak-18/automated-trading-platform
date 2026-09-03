const Position = require("../models/Position");

// GET /api/positions/my
const getMyPositions = async (req, res) => {
  try {
    const positions = await Position.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: positions.length,
      positions,
    });
  } catch (error) {
    console.error("Get positions error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch positions",
    });
  }
};

// GET /api/positions/:positionId
const getPositionById = async (req, res) => {
  try {
    const position = await Position.findOne({
      _id: req.params.positionId,
      user: req.user._id,
    });

    if (!position) {
      return res.status(404).json({
        success: false,
        message: "Position not found",
      });
    }

    res.status(200).json({
      success: true,
      position,
    });
  } catch (error) {
    console.error("Get position error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch position",
    });
  }
};

module.exports = {
  getMyPositions,
  getPositionById,
};