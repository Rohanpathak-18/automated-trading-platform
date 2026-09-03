const TradingAuthorization = require("../models/TradingAuthorization");

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const authorizeTrading = async (userId) => {
  const today = getTodayDate();

  const authorization =
    await TradingAuthorization.findOneAndUpdate(
      {
        user: userId,
        authorizationDate: today,
      },
      {
        $set: {
          isAuthorized: true,
          authorizedAt: new Date(),
          revokedAt: null,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

  return authorization;
};

const getTodayAuthorization = async (userId) => {
  const today = getTodayDate();

  const authorization =
    await TradingAuthorization.findOne({
      user: userId,
      authorizationDate: today,
    });

  return authorization;
};

const revokeTradingAuthorization = async (userId) => {
  const today = getTodayDate();

  const authorization =
    await TradingAuthorization.findOne({
      user: userId,
      authorizationDate: today,
    });

  if (!authorization) {
    throw new Error("No trading authorization found for today");
  }

  authorization.isAuthorized = false;
  authorization.revokedAt = new Date();

  await authorization.save();

  return authorization;
};

const isTradingAuthorized = async (userId) => {
  const authorization = await getTodayAuthorization(userId);

  if (!authorization) {
    return false;
  }

  return authorization.isAuthorized === true;
};

module.exports = {
  authorizeTrading,
  getTodayAuthorization,
  revokeTradingAuthorization,
  isTradingAuthorized,
};