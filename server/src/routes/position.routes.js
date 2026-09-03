const express = require("express");

const {
  getMyPositions,
  getPositionById,
} = require("../controllers/position.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  getMyPositions
);

router.get(
  "/:positionId",
  authMiddleware,
  getPositionById
);

module.exports = router;