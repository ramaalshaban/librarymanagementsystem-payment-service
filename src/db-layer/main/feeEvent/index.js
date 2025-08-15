const utils = require("./utils");
const dbApiScripts = require("./dbApiScripts");

module.exports = {
  dbGetFeeevent: require("./dbGetFeeevent"),
  dbCreateFeeevent: require("./dbCreateFeeevent"),
  dbUpdateFeeevent: require("./dbUpdateFeeevent"),
  dbDeleteFeeevent: require("./dbDeleteFeeevent"),
  dbListFeeevents: require("./dbListFeeevents"),
  createFeeEvent: utils.createFeeEvent,
  getIdListOfFeeEventByField: utils.getIdListOfFeeEventByField,
  getFeeEventById: utils.getFeeEventById,
  getFeeEventAggById: utils.getFeeEventAggById,
  getFeeEventListByQuery: utils.getFeeEventListByQuery,
  getFeeEventStatsByQuery: utils.getFeeEventStatsByQuery,
  getFeeEventByQuery: utils.getFeeEventByQuery,
  updateFeeEventById: utils.updateFeeEventById,
  updateFeeEventByIdList: utils.updateFeeEventByIdList,
  updateFeeEventByQuery: utils.updateFeeEventByQuery,
  deleteFeeEventById: utils.deleteFeeEventById,
  deleteFeeEventByQuery: utils.deleteFeeEventByQuery,
};
