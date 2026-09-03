const mongoose = require("mongoose");

const strategyAssignmentSchema = new mongoose.Schema(
  {
    strategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brokerAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrokerAccount",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

strategyAssignmentSchema.index(
  {
    strategy: 1,
    client: 1,
    brokerAccount: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "StrategyAssignment",
  strategyAssignmentSchema
);