const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  connectBroker,
  getMyBrokers,
  disconnectBroker,
} = require("../controllers/broker.controller");

const router = express.Router();

// Connect a broker
router.post("/connect", protect, connectBroker);

// Get logged-in user's brokers
router.get("/my", protect, getMyBrokers);

// Disconnect a broker
router.patch(
  "/disconnect/:brokerId",
  protect,
  disconnectBroker
);

module.exports = router;