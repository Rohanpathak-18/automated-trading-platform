const express = require("express");

const {
  assignStrategy,
  getAssignmentsForStrategy,
  getMyAssignments,
  removeAssignment,
} = require("../controllers/strategyAssignment.controller");

const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

const managers = authorizeRoles(
  "TRADER",
  "ADMIN",
  "SUPER_ADMIN"
);

// Assign strategy
router.post(
  "/",
  authMiddleware,
  managers,
  assignStrategy
);

// Get assignments for strategy
router.get(
  "/strategy/:strategyId",
  authMiddleware,
  managers,
  getAssignmentsForStrategy
);

// Client's assigned strategies
router.get(
  "/my",
  authMiddleware,
  getMyAssignments
);

// Deactivate assignment
router.patch(
  "/:assignmentId/deactivate",
  authMiddleware,
  managers,
  removeAssignment
);

module.exports = router;