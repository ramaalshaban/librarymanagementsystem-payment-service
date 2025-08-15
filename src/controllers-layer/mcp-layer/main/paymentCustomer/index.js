module.exports = (headers) => {
  // PaymentCustomer Db Object Rest Api Router
  const paymentCustomerMcpRouter = [];
  // getCustomerByUserId controller
  paymentCustomerMcpRouter.push(require("./get-customerbyuserid")(headers));
  // listCustomers controller
  paymentCustomerMcpRouter.push(require("./list-customers")(headers));
  return paymentCustomerMcpRouter;
};
