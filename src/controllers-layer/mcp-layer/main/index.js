module.exports = (headers) => {
  // main Database Crud Object Mcp Api Routers
  return {
    feeMcpRouter: require("./fee")(headers),
    feePaymentMcpRouter: require("./feePayment")(headers),
    feeEventMcpRouter: require("./feeEvent")(headers),
    feePaymentMcpRouter: require("./feePayment")(headers),
    paymentCustomerMcpRouter: require("./paymentCustomer")(headers),
    paymentMethodMcpRouter: require("./paymentMethod")(headers),
  };
};
