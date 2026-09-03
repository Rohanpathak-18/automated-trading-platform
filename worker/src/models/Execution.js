const mongoose = require("mongoose");

const executionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brokerOrderId: {
      type: String,
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

    transactionType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    executedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Execution", executionSchema);