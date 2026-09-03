const brokerService = require("../services/broker.service");

const connectBroker = async (req, res) => {
  try {
    const {
      broker,
      accountName,
      clientId,
      accessToken,
      refreshToken,
    } = req.body;

    if (!broker || !accountName || !clientId || !accessToken) {
      return res.status(400).json({
        success: false,
        message:
          "Broker, account name, client ID and access token are required",
      });
    }

    const result = await brokerService.connectBroker({
      userId: req.user._id,
      broker,
      accountName,
      clientId,
      accessToken,
      refreshToken,
    });

    res.status(201).json({
      success: true,
      message: "Broker connected successfully",
      brokerAccount: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyBrokers = async (req, res) => {
  try {
    const brokers = await brokerService.getUserBrokers(
      req.user._id
    );

    res.status(200).json({
      success: true,
      brokers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const disconnectBroker = async (req, res) => {
  try {
    const { brokerId } = req.params;

    const result = await brokerService.disconnectBroker({
      userId: req.user._id,
      brokerId,
    });

    res.status(200).json({
      success: true,
      message: "Broker disconnected successfully",
      brokerAccount: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  connectBroker,
  getMyBrokers,
  disconnectBroker,
};