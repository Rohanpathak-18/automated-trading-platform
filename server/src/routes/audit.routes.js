const express = require("express");

const {
  getMyAuditLogs,
  getAllAuditLogs,
} = require("../controllers/audit.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();


// Client can see own logs
router.get(
  "/my",
  authMiddleware,
  getMyAuditLogs
);


// Admin / trader can see all logs
router.get(
  "/",
  authMiddleware,
  authorizeRoles(
    "TRADER",
    "ADMIN",
    "SUPER_ADMIN"
  ),
  getAllAuditLogs
);


module.exports = router;