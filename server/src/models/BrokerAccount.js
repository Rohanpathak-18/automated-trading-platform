const mongoose = require("mongoose");

const brokerAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    broker: {
      type: String,
      enum: ["DHAN", "UPSTOX", "ANGEL_ONE"],
      required: true,
    },

    accountName: {
      type: String,
      required: true,
      trim: true,
    },

    clientId: {
      type: String,
      required: true,
      trim: true,
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    isConnected: {
      type: Boolean,
      default: true,
    },

    lastConnectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BrokerAccount",
  brokerAccountSchema
);