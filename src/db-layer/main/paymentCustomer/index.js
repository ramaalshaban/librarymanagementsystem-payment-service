const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetCustomerbyuserid: require("./dbGetCustomerbyuserid"),
  dbListCustomers: require("./dbListCustomers"),
  createPaymentCustomer: utils.createPaymentCustomer,
  getIdListOfPaymentCustomerByField: utils.getIdListOfPaymentCustomerByField,
  getPaymentCustomerById: utils.getPaymentCustomerById,
  getPaymentCustomerAggById: utils.getPaymentCustomerAggById,
  getPaymentCustomerListByQuery: utils.getPaymentCustomerListByQuery,
  getPaymentCustomerStatsByQuery: utils.getPaymentCustomerStatsByQuery,
  getPaymentCustomerByQuery: utils.getPaymentCustomerByQuery,
  updatePaymentCustomerById: utils.updatePaymentCustomerById,
  updatePaymentCustomerByIdList: utils.updatePaymentCustomerByIdList,
  updatePaymentCustomerByQuery: utils.updatePaymentCustomerByQuery,
  deletePaymentCustomerById: utils.deletePaymentCustomerById,
  deletePaymentCustomerByQuery: utils.deletePaymentCustomerByQuery,
  getPaymentCustomerByUserId: utils.getPaymentCustomerByUserId,
  getPaymentCustomerByCustomerId: utils.getPaymentCustomerByCustomerId,
};
