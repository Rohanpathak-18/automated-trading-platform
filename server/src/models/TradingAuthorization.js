const mongoose = require("mongoose");

const tradingAuthorizationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    authorizationDate: {
      type: String,
      required: true,
    },

    isAuthorized: {
      type: Boolean,
      default: false,
    },

    authorizedAt: {
      type: Date,
      default: null,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One authorization record per user per day
tradingAuthorizationSchema.index(
  {
    user: 1,
    authorizationDate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "TradingAuthorization",
  tradingAuthorizationSchema
);