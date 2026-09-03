const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  userId,
  action,
  entityType,
  entityId = null,
  description = "",
  metadata = {},
  ipAddress = null,
  status = "SUCCESS",
}) => {
  try {
    return await AuditLog.create({
      user: userId,
      action,
      entityType,
      entityId,
      description,
      metadata,
      ipAddress,
      status,
    });
  } catch (error) {
    // Audit failure should not break the trading flow
    console.error("Audit log failed:", error.message);
    return null;
  }
};

module.exports = {
  createAuditLog,
};