require("dotenv").config();

const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const Order = require("../models/Order");

const MockBrokerAdapter = require("../../../shared/brokers/MockBroker/MockBrokerAdapter");

const executionService = require("../services/execution.service");

const positionService = require("../services/position.service");

const redisConnection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  },
);

const broker = new MockBrokerAdapter();

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/trading_platform",
  );

  console.log("Worker MongoDB connected");
};

const startWorker = async () => {
  try {
    // Connect MongoDB BEFORE starting the worker
    await connectDB();

    const orderWorker = new Worker(
      "order-execution",

      async (job) => {
        const { orderId } = job.data;

        console.log(`Processing order: ${orderId}`);

        const order = await Order.findById(orderId);

        if (!["AUTHORIZED", "QUEUED"].includes(order.status)) {
          console.log(
            `Skipping order ${orderId}. Current status: ${order.status}`,
          );

          return {
            success: true,
            skipped: true,
            orderId,
            status: order.status,
          };
        }

        /*
         * STEP 1
         * Send order to broker
         */

        const brokerResponse = await broker.placeOrder(order);

        if (!brokerResponse.success) {
          order.status = "REJECTED";

          order.rejectionReason =
            brokerResponse.message || "Broker rejected order";

          await order.save();

          throw new Error(brokerResponse.message || "Broker rejected order");
        }

        /*
         * STEP 2
         * Save broker order ID
         */

        order.brokerOrderId = brokerResponse.brokerOrderId;

        order.status = "SUBMITTED";

        await order.save();

        console.log(`Broker order ID: ${order.brokerOrderId}`);

        /*
         * STEP 3
         * Check broker order status
         */

        const statusResponse = await broker.getOrderStatus(order.brokerOrderId);

        /*
         * STEP 4
         * Handle FILLED order
         */

        if (statusResponse.status === "FILLED") {
          order.status = "FILLED";

          await order.save();

          console.log(`Order ${orderId} status: FILLED`);

          /*
           * STEP 5
           * Create execution
           */

          // Mock broker does not return actual fill price yet.
          const executionPrice = order.price || 100;

          const execution = await executionService.createExecution({
            order,
            brokerOrderId: order.brokerOrderId,
            quantity: order.quantity,
            price: executionPrice,
          });

          console.log(`Execution created: ${execution._id}`);

          /*
           * STEP 6
           * Update position
           */

          const position = await positionService.updatePosition({
            order,
            execution,
          });

          console.log(`Position updated: ${position._id}`);

          return {
            success: true,
            orderId,
            brokerOrderId: order.brokerOrderId,
            executionId: execution._id,
            positionId: position._id,
            status: order.status,
          };
        }

        /*
         * Order is not filled yet
         */

        return {
          success: true,
          orderId,
          brokerOrderId: order.brokerOrderId,
          status: order.status,
        };
      },

      {
        connection: redisConnection,
      },
    );

    orderWorker.on("completed", (job) => {
      console.log(`Order job completed: ${job.id}`);
    });

    orderWorker.on("failed", (job, error) => {
      console.error(`Order job failed: ${job?.id}`, error.message);
    });

    console.log("Order worker started");
  } catch (error) {
    console.error("Worker startup failed:", error.message);

    process.exit(1);
  }
};

startWorker();
