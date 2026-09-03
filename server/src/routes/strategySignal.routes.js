const express = require("express");

const {
  createStrategySignal,
  getStrategySignals,
  processStrategySignal,
} = require("../controllers/strategySignal.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

const strategyManagers = authorizeRoles(
  "TRADER",
  "ADMIN",
  "SUPER_ADMIN"
);

// Create signal
router.post(
  "/",
  authMiddleware,
  strategyManagers,
  createStrategySignal
);

// Get signals
router.get(
  "/",
  authMiddleware,
  strategyManagers,
  getStrategySignals
);

// Process signal
router.post(
  "/:signalId/process",
  authMiddleware,
  strategyManagers,
  processStrategySignal
);

module.exports = router;