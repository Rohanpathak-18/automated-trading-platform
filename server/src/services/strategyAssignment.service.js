const StrategyAssignment = require("../models/StrategyAssignment");

const createAssignment = async ({
  strategyId,
  clientId,
  brokerAccountId,
  assignedBy,
}) => {
  const assignment = await StrategyAssignment.create({
    strategy: strategyId,
    client: clientId,
    brokerAccount: brokerAccountId,
    assignedBy,
  });

  return assignment;
};

const getStrategyAssignments = async (strategyId) => {
  return StrategyAssignment.find({
    strategy: strategyId,
    status: "ACTIVE",
  })
    .populate("client", "name email role isActive")
    .populate(
      "brokerAccount",
      "accountName broker clientId isConnected"
    )
    .populate("strategy", "name status");
};

const getClientAssignments = async (clientId) => {
  return StrategyAssignment.find({
    client: clientId,
    status: "ACTIVE",
  })
    .populate("strategy", "name description status")
    .populate(
      "brokerAccount",
      "accountName broker clientId isConnected"
    );
};

const deactivateAssignment = async (assignmentId) => {
  const assignment = await StrategyAssignment.findById(
    assignmentId
  );

  if (!assignment) {
    throw new Error("Strategy assignment not found");
  }

  assignment.status = "INACTIVE";

  await assignment.save();

  return assignment;
};

module.exports = {
  createAssignment,
  getStrategyAssignments,
  getClientAssignments,
  deactivateAssignment,
};