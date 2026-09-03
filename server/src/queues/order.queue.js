const { Queue } = require("bullmq");

const redisConnection = require("../config/redis");

const orderQueue = new Queue("order-execution", {
  connection: redisConnection,
});

orderQueue.on("error", (error) => {
  console.error("Order queue error:", error.message);
});

const addOrderToQueue = async (orderId) => {
  const job = await orderQueue.add(
    "execute-order",
    {
      orderId: orderId.toString(),
    },
    {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 1000,
      },

      removeOnComplete: 100,
      removeOnFail: 500,
    }
  );

  return job;
};

module.exports = {
  orderQueue,
  addOrderToQueue,
};