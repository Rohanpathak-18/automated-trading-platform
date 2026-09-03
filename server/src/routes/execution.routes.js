const express = require("express");

const {
  getMyExecutions,
} = require("../controllers/execution.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  getMyExecutions
);

module.exports = router;