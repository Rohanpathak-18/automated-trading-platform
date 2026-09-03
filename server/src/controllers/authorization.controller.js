const authorizationService = require("../services/authorization.service");

const authorizeTrading = async (req, res) => {
  try {
    const authorization =
      await authorizationService.authorizeTrading(
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: "Trading authorized for today",
      authorization: {
        id: authorization._id,
        authorizationDate:
          authorization.authorizationDate,
        isAuthorized: authorization.isAuthorized,
        authorizedAt: authorization.authorizedAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodayAuthorization = async (req, res) => {
  try {
    const authorization =
      await authorizationService.getTodayAuthorization(
        req.user._id
      );

    res.status(200).json({
      success: true,
      authorization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const revokeTradingAuthorization = async (req, res) => {
  try {
    const authorization =
      await authorizationService.revokeTradingAuthorization(
        req.user._id
      );

    res.status(200).json({
      success: true,
      message: "Trading authorization revoked",
      authorization: {
        id: authorization._id,
        authorizationDate:
          authorization.authorizationDate,
        isAuthorized: authorization.isAuthorized,
        revokedAt: authorization.revokedAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  authorizeTrading,
  getTodayAuthorization,
  revokeTradingAuthorization,
};