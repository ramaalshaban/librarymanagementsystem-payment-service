module.exports = {
  GetPaymentManager: require("./get-payment"),
  GetPaymentByOrderIdManager: require("./get-paymentbyorderid"),
  GetPaymentByPaymentIdManager: require("./get-paymentbypaymentid"),
  CreatePaymentManager: require("./create-payment"),
  UpdatePaymentManager: require("./update-payment"),
  ListPaymentsManager: require("./list-payments"),
  DeletePaymentManager: require("./delete-payment"),
};
