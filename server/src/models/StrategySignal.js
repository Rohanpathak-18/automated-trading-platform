const mongoose = require("mongoose");

const strategySignalSchema = new mongoose.Schema(
  {
    strategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
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

    reason: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "GENERATED",
        "PROCESSING",
        "PROCESSED",
        "PARTIALLY_PROCESSED",
        "REJECTED",
        "FAILED",
      ],
      default: "GENERATED",
    },

    processedAt: {
      type: Date,
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

module.exports = mongoose.model(
  "StrategySignal",
  strategySignalSchema
);