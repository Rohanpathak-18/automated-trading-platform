const express = require("express");

const {
  createStrategy,
  getStrategies,
  getStrategyById,
  updateStrategy,
  updateStrategyStatus,
  deleteStrategy,
} = require("../controllers/strategy.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

// Only TRADER / ADMIN / SUPER_ADMIN can manage strategies
const strategyManagers = roleMiddleware(
  "TRADER",
  "ADMIN",
  "SUPER_ADMIN"
);

// Create strategy
router.post(
  "/",
  authMiddleware,
  strategyManagers,
  createStrategy
);

// Get all strategies
router.get(
  "/",
  authMiddleware,
  strategyManagers,
  getStrategies
);

// Get strategy by ID
router.get(
  "/:strategyId",
  authMiddleware,
  strategyManagers,
  getStrategyById
);

// Update strategy
router.patch(
  "/:strategyId",
  authMiddleware,
  strategyManagers,
  updateStrategy
);

// Activate / deactivate
router.patch(
  "/:strategyId/status",
  authMiddleware,
  strategyManagers,
  updateStrategyStatus
);

// Delete strategy
router.delete(
  "/:strategyId",
  authMiddleware,
  strategyManagers,
  deleteStrategy
);

module.exports = router;