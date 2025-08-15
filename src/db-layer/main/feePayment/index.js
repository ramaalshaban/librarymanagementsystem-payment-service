const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetPayment: require("./dbGetPayment"),
  dbGetPaymentbyorderid: require("./dbGetPaymentbyorderid"),
  dbGetPaymentbypaymentid: require("./dbGetPaymentbypaymentid"),
  dbCreatePayment: require("./dbCreatePayment"),
  dbUpdatePayment: require("./dbUpdatePayment"),
  dbListPayments: require("./dbListPayments"),
  dbDeletePayment: require("./dbDeletePayment"),
  createFeePayment: utils.createFeePayment,
  getIdListOfFeePaymentByField: utils.getIdListOfFeePaymentByField,
  getFeePaymentById: utils.getFeePaymentById,
  getFeePaymentAggById: utils.getFeePaymentAggById,
  getFeePaymentListByQuery: utils.getFeePaymentListByQuery,
  getFeePaymentStatsByQuery: utils.getFeePaymentStatsByQuery,
  getFeePaymentByQuery: utils.getFeePaymentByQuery,
  updateFeePaymentById: utils.updateFeePaymentById,
  updateFeePaymentByIdList: utils.updateFeePaymentByIdList,
  updateFeePaymentByQuery: utils.updateFeePaymentByQuery,
  deleteFeePaymentById: utils.deleteFeePaymentById,
  deleteFeePaymentByQuery: utils.deleteFeePaymentByQuery,
  getFeePaymentByOrderId: utils.getFeePaymentByOrderId,
};
