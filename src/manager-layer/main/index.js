module.exports = {
  // main Database Crud Object Routes Manager Layer Classes
  // Fee Db Object
  GetFeeManager: require("./fee/get-fee"),
  CreateFeeManager: require("./fee/create-fee"),
  UpdateFeeManager: require("./fee/update-fee"),
  DeleteFeeManager: require("./fee/delete-fee"),
  ListFeesManager: require("./fee/list-fees"),
  CheckoutstartFeeManager: require("./fee/checkoutstart-fee"),
  CheckoutcompleteFeeManager: require("./fee/checkoutcomplete-fee"),
  CheckoutrefreshFeeManager: require("./fee/checkoutrefresh-fee"),
  // FeePayment Db Object
  GetFeePaymentManager: require("./feePayment/get-feepayment"),
  CreateFeePaymentManager: require("./feePayment/create-feepayment"),
  UpdateFeePaymentManager: require("./feePayment/update-feepayment"),
  DeleteFeePaymentManager: require("./feePayment/delete-feepayment"),
  ListFeePaymentsManager: require("./feePayment/list-feepayments"),
  // FeeEvent Db Object
  GetFeeEventManager: require("./feeEvent/get-feeevent"),
  CreateFeeEventManager: require("./feeEvent/create-feeevent"),
  UpdateFeeEventManager: require("./feeEvent/update-feeevent"),
  DeleteFeeEventManager: require("./feeEvent/delete-feeevent"),
  ListFeeEventsManager: require("./feeEvent/list-feeevents"),
  // FeePayment Db Object
  GetPaymentManager: require("./feePayment/get-payment"),
  GetPaymentByOrderIdManager: require("./feePayment/get-paymentbyorderid"),
  GetPaymentByPaymentIdManager: require("./feePayment/get-paymentbypaymentid"),
  CreatePaymentManager: require("./feePayment/create-payment"),
  UpdatePaymentManager: require("./feePayment/update-payment"),
  ListPaymentsManager: require("./feePayment/list-payments"),
  DeletePaymentManager: require("./feePayment/delete-payment"),
  // PaymentCustomer Db Object
  GetCustomerByUserIdManager: require("./paymentCustomer/get-customerbyuserid"),
  ListCustomersManager: require("./paymentCustomer/list-customers"),
  // PaymentMethod Db Object
  ListethodsManager: require("./paymentMethod/listethods"),
};
