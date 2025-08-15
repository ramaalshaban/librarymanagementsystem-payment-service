module.exports = (headers) => {
  // FeePayment Db Object Rest Api Router
  const feePaymentMcpRouter = [];
  // getPayment controller
  feePaymentMcpRouter.push(require("./get-payment")(headers));
  // getPaymentByOrderId controller
  feePaymentMcpRouter.push(require("./get-paymentbyorderid")(headers));
  // getPaymentByPaymentId controller
  feePaymentMcpRouter.push(require("./get-paymentbypaymentid")(headers));
  // createPayment controller
  feePaymentMcpRouter.push(require("./create-payment")(headers));
  // updatePayment controller
  feePaymentMcpRouter.push(require("./update-payment")(headers));
  // listPayments controller
  feePaymentMcpRouter.push(require("./list-payments")(headers));
  // deletePayment controller
  feePaymentMcpRouter.push(require("./delete-payment")(headers));
  return feePaymentMcpRouter;
};
