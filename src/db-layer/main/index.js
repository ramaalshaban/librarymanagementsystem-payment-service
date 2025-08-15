const feeFunctions = require("./fee");
const feePaymentFunctions = require("./feePayment");
const feeEventFunctions = require("./feeEvent");
const feePaymentFunctions = require("./feePayment");
const paymentCustomerFunctions = require("./paymentCustomer");
const paymentMethodFunctions = require("./paymentMethod");

module.exports = {
  // main Database
  // Fee Db Object
  dbGetFee: feeFunctions.dbGetFee,
  dbCreateFee: feeFunctions.dbCreateFee,
  dbUpdateFee: feeFunctions.dbUpdateFee,
  dbDeleteFee: feeFunctions.dbDeleteFee,
  dbListFees: feeFunctions.dbListFees,
  dbCheckoutstartFee: feeFunctions.dbCheckoutstartFee,
  dbCheckoutcompleteFee: feeFunctions.dbCheckoutcompleteFee,
  dbCheckoutrefreshFee: feeFunctions.dbCheckoutrefreshFee,
  createFee: feeFunctions.createFee,
  getIdListOfFeeByField: feeFunctions.getIdListOfFeeByField,
  getFeeById: feeFunctions.getFeeById,
  getFeeAggById: feeFunctions.getFeeAggById,
  getFeeListByQuery: feeFunctions.getFeeListByQuery,
  getFeeStatsByQuery: feeFunctions.getFeeStatsByQuery,
  getFeeByQuery: feeFunctions.getFeeByQuery,
  updateFeeById: feeFunctions.updateFeeById,
  updateFeeByIdList: feeFunctions.updateFeeByIdList,
  updateFeeByQuery: feeFunctions.updateFeeByQuery,
  deleteFeeById: feeFunctions.deleteFeeById,
  deleteFeeByQuery: feeFunctions.deleteFeeByQuery,
  updateFeeOrderStatusById: feeFunctions.updateFeeOrderStatusById,

  // FeePayment Db Object
  dbGetFeepayment: feePaymentFunctions.dbGetFeepayment,
  dbCreateFeepayment: feePaymentFunctions.dbCreateFeepayment,
  dbUpdateFeepayment: feePaymentFunctions.dbUpdateFeepayment,
  dbDeleteFeepayment: feePaymentFunctions.dbDeleteFeepayment,
  dbListFeepayments: feePaymentFunctions.dbListFeepayments,
  createFeePayment: feePaymentFunctions.createFeePayment,
  getIdListOfFeePaymentByField:
    feePaymentFunctions.getIdListOfFeePaymentByField,
  getFeePaymentById: feePaymentFunctions.getFeePaymentById,
  getFeePaymentAggById: feePaymentFunctions.getFeePaymentAggById,
  getFeePaymentListByQuery: feePaymentFunctions.getFeePaymentListByQuery,
  getFeePaymentStatsByQuery: feePaymentFunctions.getFeePaymentStatsByQuery,
  getFeePaymentByQuery: feePaymentFunctions.getFeePaymentByQuery,
  updateFeePaymentById: feePaymentFunctions.updateFeePaymentById,
  updateFeePaymentByIdList: feePaymentFunctions.updateFeePaymentByIdList,
  updateFeePaymentByQuery: feePaymentFunctions.updateFeePaymentByQuery,
  deleteFeePaymentById: feePaymentFunctions.deleteFeePaymentById,
  deleteFeePaymentByQuery: feePaymentFunctions.deleteFeePaymentByQuery,

  // FeeEvent Db Object
  dbGetFeeevent: feeEventFunctions.dbGetFeeevent,
  dbCreateFeeevent: feeEventFunctions.dbCreateFeeevent,
  dbUpdateFeeevent: feeEventFunctions.dbUpdateFeeevent,
  dbDeleteFeeevent: feeEventFunctions.dbDeleteFeeevent,
  dbListFeeevents: feeEventFunctions.dbListFeeevents,
  createFeeEvent: feeEventFunctions.createFeeEvent,
  getIdListOfFeeEventByField: feeEventFunctions.getIdListOfFeeEventByField,
  getFeeEventById: feeEventFunctions.getFeeEventById,
  getFeeEventAggById: feeEventFunctions.getFeeEventAggById,
  getFeeEventListByQuery: feeEventFunctions.getFeeEventListByQuery,
  getFeeEventStatsByQuery: feeEventFunctions.getFeeEventStatsByQuery,
  getFeeEventByQuery: feeEventFunctions.getFeeEventByQuery,
  updateFeeEventById: feeEventFunctions.updateFeeEventById,
  updateFeeEventByIdList: feeEventFunctions.updateFeeEventByIdList,
  updateFeeEventByQuery: feeEventFunctions.updateFeeEventByQuery,
  deleteFeeEventById: feeEventFunctions.deleteFeeEventById,
  deleteFeeEventByQuery: feeEventFunctions.deleteFeeEventByQuery,

  // FeePayment Db Object
  dbGetPayment: feePaymentFunctions.dbGetPayment,
  dbGetPaymentbyorderid: feePaymentFunctions.dbGetPaymentbyorderid,
  dbGetPaymentbypaymentid: feePaymentFunctions.dbGetPaymentbypaymentid,
  dbCreatePayment: feePaymentFunctions.dbCreatePayment,
  dbUpdatePayment: feePaymentFunctions.dbUpdatePayment,
  dbListPayments: feePaymentFunctions.dbListPayments,
  dbDeletePayment: feePaymentFunctions.dbDeletePayment,
  createFeePayment: feePaymentFunctions.createFeePayment,
  getIdListOfFeePaymentByField:
    feePaymentFunctions.getIdListOfFeePaymentByField,
  getFeePaymentById: feePaymentFunctions.getFeePaymentById,
  getFeePaymentAggById: feePaymentFunctions.getFeePaymentAggById,
  getFeePaymentListByQuery: feePaymentFunctions.getFeePaymentListByQuery,
  getFeePaymentStatsByQuery: feePaymentFunctions.getFeePaymentStatsByQuery,
  getFeePaymentByQuery: feePaymentFunctions.getFeePaymentByQuery,
  updateFeePaymentById: feePaymentFunctions.updateFeePaymentById,
  updateFeePaymentByIdList: feePaymentFunctions.updateFeePaymentByIdList,
  updateFeePaymentByQuery: feePaymentFunctions.updateFeePaymentByQuery,
  deleteFeePaymentById: feePaymentFunctions.deleteFeePaymentById,
  deleteFeePaymentByQuery: feePaymentFunctions.deleteFeePaymentByQuery,
  getFeePaymentByOrderId: feePaymentFunctions.getFeePaymentByOrderId,

  // PaymentCustomer Db Object
  dbGetCustomerbyuserid: paymentCustomerFunctions.dbGetCustomerbyuserid,
  dbListCustomers: paymentCustomerFunctions.dbListCustomers,
  createPaymentCustomer: paymentCustomerFunctions.createPaymentCustomer,
  getIdListOfPaymentCustomerByField:
    paymentCustomerFunctions.getIdListOfPaymentCustomerByField,
  getPaymentCustomerById: paymentCustomerFunctions.getPaymentCustomerById,
  getPaymentCustomerAggById: paymentCustomerFunctions.getPaymentCustomerAggById,
  getPaymentCustomerListByQuery:
    paymentCustomerFunctions.getPaymentCustomerListByQuery,
  getPaymentCustomerStatsByQuery:
    paymentCustomerFunctions.getPaymentCustomerStatsByQuery,
  getPaymentCustomerByQuery: paymentCustomerFunctions.getPaymentCustomerByQuery,
  updatePaymentCustomerById: paymentCustomerFunctions.updatePaymentCustomerById,
  updatePaymentCustomerByIdList:
    paymentCustomerFunctions.updatePaymentCustomerByIdList,
  updatePaymentCustomerByQuery:
    paymentCustomerFunctions.updatePaymentCustomerByQuery,
  deletePaymentCustomerById: paymentCustomerFunctions.deletePaymentCustomerById,
  deletePaymentCustomerByQuery:
    paymentCustomerFunctions.deletePaymentCustomerByQuery,
  getPaymentCustomerByUserId:
    paymentCustomerFunctions.getPaymentCustomerByUserId,
  getPaymentCustomerByCustomerId:
    paymentCustomerFunctions.getPaymentCustomerByCustomerId,

  // PaymentMethod Db Object
  dbDoListethods: paymentMethodFunctions.dbDoListethods,
  createPaymentMethod: paymentMethodFunctions.createPaymentMethod,
  getIdListOfPaymentMethodByField:
    paymentMethodFunctions.getIdListOfPaymentMethodByField,
  getPaymentMethodById: paymentMethodFunctions.getPaymentMethodById,
  getPaymentMethodAggById: paymentMethodFunctions.getPaymentMethodAggById,
  getPaymentMethodListByQuery:
    paymentMethodFunctions.getPaymentMethodListByQuery,
  getPaymentMethodStatsByQuery:
    paymentMethodFunctions.getPaymentMethodStatsByQuery,
  getPaymentMethodByQuery: paymentMethodFunctions.getPaymentMethodByQuery,
  updatePaymentMethodById: paymentMethodFunctions.updatePaymentMethodById,
  updatePaymentMethodByIdList:
    paymentMethodFunctions.updatePaymentMethodByIdList,
  updatePaymentMethodByQuery: paymentMethodFunctions.updatePaymentMethodByQuery,
  deletePaymentMethodById: paymentMethodFunctions.deletePaymentMethodById,
  deletePaymentMethodByQuery: paymentMethodFunctions.deletePaymentMethodByQuery,
  getPaymentMethodByPaymentMethodId:
    paymentMethodFunctions.getPaymentMethodByPaymentMethodId,
  getPaymentMethodByUserId: paymentMethodFunctions.getPaymentMethodByUserId,
  getPaymentMethodByCustomerId:
    paymentMethodFunctions.getPaymentMethodByCustomerId,
};
