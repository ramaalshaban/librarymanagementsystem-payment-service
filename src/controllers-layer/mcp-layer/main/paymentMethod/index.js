module.exports = (headers) => {
  // PaymentMethod Db Object Rest Api Router
  const paymentMethodMcpRouter = [];
  // listethods controller
  paymentMethodMcpRouter.push(require("./listethods")(headers));
  return paymentMethodMcpRouter;
};
