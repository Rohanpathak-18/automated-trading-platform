const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
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
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    averagePrice: {
      type: Number,
      default: 0,
    },

    realizedPnL: {
      type: Number,
      default: 0,
    },

    unrealizedPnL: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Position", positionSchema);