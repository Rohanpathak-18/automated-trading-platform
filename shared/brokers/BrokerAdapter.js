class BrokerAdapter {
  async placeOrder(order) {
    throw new Error("placeOrder() must be implemented");
  }

  async getOrderStatus(brokerOrderId) {
    throw new Error("getOrderStatus() must be implemented");
  }

  async cancelOrder(brokerOrderId) {
    throw new Error("cancelOrder() must be implemented");
  }
}

module.exports = BrokerAdapter;