const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brokerAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrokerAccount",
      required: true,
    },

    symbol: {
      type: String,
      required: true,
      trim: true,
    },

    exchange: {
      type: String,
      enum: ["NSE", "MCX"],
      required: true,
    },

    instrumentType: {
      type: String,
      enum: ["OPTION"],
      required: true,
    },

    optionType: {
      type: String,
      enum: ["CE", "PE"],
      required: true,
    },

    strikePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      default: null,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "VALIDATING",
        "AUTHORIZED",
        "QUEUED",
        "SUBMITTED",
        "OPEN",
        "PARTIALLY_FILLED",
        "FILLED",
        "REJECTED",
        "FAILED",
        "CANCELLED",
      ],
      default: "CREATED",
    },

    orderSource: {
      type: String,
      enum: ["MANUAL", "STRATEGY", "TRADER"],
      default: "STRATEGY",
    },

    strategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
      default: null,
    },

    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
    },

    brokerOrderId: {
      type: String,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);