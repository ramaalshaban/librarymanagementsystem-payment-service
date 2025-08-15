const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbDoListethods: require("./dbDoListethods"),
  createPaymentMethod: utils.createPaymentMethod,
  getIdListOfPaymentMethodByField: utils.getIdListOfPaymentMethodByField,
  getPaymentMethodById: utils.getPaymentMethodById,
  getPaymentMethodAggById: utils.getPaymentMethodAggById,
  getPaymentMethodListByQuery: utils.getPaymentMethodListByQuery,
  getPaymentMethodStatsByQuery: utils.getPaymentMethodStatsByQuery,
  getPaymentMethodByQuery: utils.getPaymentMethodByQuery,
  updatePaymentMethodById: utils.updatePaymentMethodById,
  updatePaymentMethodByIdList: utils.updatePaymentMethodByIdList,
  updatePaymentMethodByQuery: utils.updatePaymentMethodByQuery,
  deletePaymentMethodById: utils.deletePaymentMethodById,
  deletePaymentMethodByQuery: utils.deletePaymentMethodByQuery,
  getPaymentMethodByPaymentMethodId: utils.getPaymentMethodByPaymentMethodId,
  getPaymentMethodByUserId: utils.getPaymentMethodByUserId,
  getPaymentMethodByCustomerId: utils.getPaymentMethodByCustomerId,
};
