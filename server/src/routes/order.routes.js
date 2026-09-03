const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  createOrder,
  getMyOrders,
  getOrder,
} = require("../controllers/order.controller");

const router = express.Router();

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/my",
  protect,
  getMyOrders
);

router.get(
  "/:orderId",
  protect,
  getOrder
);

module.exports = router;