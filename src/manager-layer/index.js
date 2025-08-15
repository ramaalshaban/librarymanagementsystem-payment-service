module.exports = {
  PaymentServiceManager: require("./service-manager/PaymentServiceManager"),
  // main Database Crud Object Routes Manager Layer Classes
  // Fee Db Object
  GetFeeManager: require("./main/fee/get-fee"),
  CreateFeeManager: require("./main/fee/create-fee"),
  UpdateFeeManager: require("./main/fee/update-fee"),
  DeleteFeeManager: require("./main/fee/delete-fee"),
  ListFeesManager: require("./main/fee/list-fees"),
  CheckoutstartFeeManager: require("./main/fee/checkoutstart-fee"),
  CheckoutcompleteFeeManager: require("./main/fee/checkoutcomplete-fee"),
  CheckoutrefreshFeeManager: require("./main/fee/checkoutrefresh-fee"),
  // FeePayment Db Object
  GetFeePaymentManager: require("./main/feePayment/get-feepayment"),
  CreateFeePaymentManager: require("./main/feePayment/create-feepayment"),
  UpdateFeePaymentManager: require("./main/feePayment/update-feepayment"),
  DeleteFeePaymentManager: require("./main/feePayment/delete-feepayment"),
  ListFeePaymentsManager: require("./main/feePayment/list-feepayments"),
  // FeeEvent Db Object
  GetFeeEventManager: require("./main/feeEvent/get-feeevent"),
  CreateFeeEventManager: require("./main/feeEvent/create-feeevent"),
  UpdateFeeEventManager: require("./main/feeEvent/update-feeevent"),
  DeleteFeeEventManager: require("./main/feeEvent/delete-feeevent"),
  ListFeeEventsManager: require("./main/feeEvent/list-feeevents"),
  // FeePayment Db Object
  GetPaymentManager: require("./main/feePayment/get-payment"),
  GetPaymentByOrderIdManager: require("./main/feePayment/get-paymentbyorderid"),
  GetPaymentByPaymentIdManager: require("./main/feePayment/get-paymentbypaymentid"),
  CreatePaymentManager: require("./main/feePayment/create-payment"),
  UpdatePaymentManager: require("./main/feePayment/update-payment"),
  ListPaymentsManager: require("./main/feePayment/list-payments"),
  DeletePaymentManager: require("./main/feePayment/delete-payment"),
  // PaymentCustomer Db Object
  GetCustomerByUserIdManager: require("./main/paymentCustomer/get-customerbyuserid"),
  ListCustomersManager: require("./main/paymentCustomer/list-customers"),
  // PaymentMethod Db Object
  ListethodsManager: require("./main/paymentMethod/listethods"),
};
