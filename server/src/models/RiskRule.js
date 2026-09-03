const mongoose = require("mongoose");

const riskRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    maxOrderQuantity: {
      type: Number,
      default: 1000,
      min: 1,
    },

    maxOrdersPerDay: {
      type: Number,
      default: 100,
      min: 1,
    },

    maxOpenOrders: {
      type: Number,
      default: 20,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RiskRule",
  riskRuleSchema
);