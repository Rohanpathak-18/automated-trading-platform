const StrategyAssignment = require("../models/StrategyAssignment");

const {
  createAssignment,
  getStrategyAssignments,
  getClientAssignments,
  deactivateAssignment,
} = require("../services/strategyAssignment.service");

const Strategy = require("../models/Strategy");
const User = require("../models/User");
const BrokerAccount = require("../models/BrokerAccount");

// Assign strategy to client
const assignStrategy = async (req, res) => {
  try {
    const {
      strategyId,
      clientId,
      brokerAccountId,
    } = req.body;

    if (!strategyId || !clientId || !brokerAccountId) {
      return res.status(400).json({
        success: false,
        message:
          "strategyId, clientId and brokerAccountId are required",
      });
    }

    const strategy = await Strategy.findById(strategyId);

    if (!strategy) {
      return res.status(404).json({
        success: false,
        message: "Strategy not found",
      });
    }

    const client = await User.findById(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    if (client.role !== "CLIENT") {
      return res.status(400).json({
        success: false,
        message: "Strategy can only be assigned to clients",
      });
    }

    const brokerAccount = await BrokerAccount.findById(
      brokerAccountId
    );

    if (!brokerAccount) {
      return res.status(404).json({
        success: false,
        message: "Broker account not found",
      });
    }

    if (
      brokerAccount.user.toString() !== client._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Broker account does not belong to this client",
      });
    }

    const assignment = await createAssignment({
      strategyId,
      clientId,
      brokerAccountId,
      assignedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Strategy assigned successfully",
      assignment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Strategy is already assigned to this client",
      });
    }

    console.error("Assign strategy error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to assign strategy",
    });
  }
};

// Get assignments for a strategy
const getAssignmentsForStrategy = async (req, res) => {
  try {
    const assignments = await getStrategyAssignments(
      req.params.strategyId
    );

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error(
      "Get strategy assignments error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch strategy assignments",
    });
  }
};

// Get my strategy assignments
const getMyAssignments = async (req, res) => {
  try {
    const assignments = await getClientAssignments(
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error(
      "Get client assignments error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
    });
  }
};

// Deactivate assignment
const removeAssignment = async (req, res) => {
  try {
    const assignment = await deactivateAssignment(
      req.params.assignmentId
    );

    res.status(200).json({
      success: true,
      message: "Strategy assignment deactivated",
      assignment,
    });
  } catch (error) {
    console.error(
      "Remove assignment error:",
      error.message
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  assignStrategy,
  getAssignmentsForStrategy,
  getMyAssignments,
  removeAssignment,
};