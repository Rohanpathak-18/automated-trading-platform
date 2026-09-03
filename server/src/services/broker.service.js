const BrokerAccount = require("../models/BrokerAccount");

const connectBroker = async ({
  userId,
  broker,
  accountName,
  clientId,
  accessToken,
  refreshToken,
}) => {
  // Check if user already has this broker connected
  const existingAccount = await BrokerAccount.findOne({
    user: userId,
    broker,
  });

  if (existingAccount) {
    throw new Error(`${broker} account is already connected`);
  }

  const brokerAccount = await BrokerAccount.create({
    user: userId,
    broker,
    accountName,
    clientId,
    accessToken,
    refreshToken: refreshToken || null,
    isConnected: true,
    lastConnectedAt: new Date(),
  });

  return {
    id: brokerAccount._id,
    broker: brokerAccount.broker,
    accountName: brokerAccount.accountName,
    clientId: brokerAccount.clientId,
    isConnected: brokerAccount.isConnected,
    lastConnectedAt: brokerAccount.lastConnectedAt,
  };
};

const getUserBrokers = async (userId) => {
  const brokers = await BrokerAccount.find({
    user: userId,
  }).select("-accessToken -refreshToken");

  return brokers;
};

const disconnectBroker = async ({ userId, brokerId }) => {
  const brokerAccount = await BrokerAccount.findOne({
    _id: brokerId,
    user: userId,
  });

  if (!brokerAccount) {
    throw new Error("Broker account not found");
  }

  brokerAccount.isConnected = false;

  await brokerAccount.save();

  return {
    id: brokerAccount._id,
    broker: brokerAccount.broker,
    accountName: brokerAccount.accountName,
    isConnected: brokerAccount.isConnected,
  };
};

module.exports = {
  connectBroker,
  getUserBrokers,
  disconnectBroker,
};