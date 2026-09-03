const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  authorizeTrading,
  getTodayAuthorization,
  revokeTradingAuthorization,
} = require("../controllers/authorization.controller");

const router = express.Router();

router.post(
  "/authorize",
  protect,
  authorizeTrading
);

router.get(
  "/today",
  protect,
  getTodayAuthorization
);

router.patch(
  "/revoke",
  protect,
  revokeTradingAuthorization
);

module.exports = router;