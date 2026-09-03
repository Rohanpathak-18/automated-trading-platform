const AuditLog = require("../models/AuditLog");

const getMyAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(200);

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get audit logs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};


const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .populate("user", "name email role");

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Get all audit logs error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};


module.exports = {
  getMyAuditLogs,
  getAllAuditLogs,
};