const BrokerAdapter = require("../BrokerAdapter");

class MockBrokerAdapter extends BrokerAdapter {
  async placeOrder(order) {
    console.log("Mock Broker: placing order");

    return {
      success: true,
      brokerOrderId: `MOCK-${Date.now()}`,
      status: "SUBMITTED",
      message: "Order submitted to mock broker",
    };
  }

  async getOrderStatus(brokerOrderId) {
    console.log(
      `Mock Broker: checking order ${brokerOrderId}`
    );

    return {
      success: true,
      brokerOrderId,
      status: "FILLED",
    };
  }

  async cancelOrder(brokerOrderId) {
    console.log(
      `Mock Broker: cancelling order ${brokerOrderId}`
    );

    return {
      success: true,
      brokerOrderId,
      status: "CANCELLED",
    };
  }
}

module.exports = MockBrokerAdapter;