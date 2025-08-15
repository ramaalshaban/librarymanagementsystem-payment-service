const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { Fee } = require("models");
const { ObjectId } = require("mongoose").Types;

const {
  getIdListOfFeePaymentByField,
  updateFeePaymentById,
  deleteFeePaymentById,
} = require("../feePayment");

const { FeeQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteFeeCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, Fee, instanceMode);
    this.commandName = "dbDeleteFee";
    this.nullResult = false;
    this.objectName = "fee";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.dbEvent =
      "librarymanagementsystem-payment-service" + "-dbevent-" + "fee-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new FeeQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "fee",
      this.session,
      this.requestId,
    );
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }

  async syncJoins() {
    const promises = [];
    const dataId = this.dbData.id;
    // relationTargetKey should be used instead of id
    try {
      // delete refrring objects

      // update referring objects

      // delete childs
      const idList_FeePayment_feeId_fee = await getIdListOfFeePaymentByField(
        "feeId",
        this.dbData.id,
        false,
      );
      for (const itemId of idList_FeePayment_feeId_fee) {
        promises.push(deleteFeePaymentById(itemId));
      }

      const idList_FeeEvent_feeId_fee = await getIdListOfFeeEventByField(
        "feeId",
        this.dbData.id,
        false,
      );
      for (const itemId of idList_FeeEvent_feeId_fee) {
        promises.push(deleteFeeEventById(itemId));
      }

      // update childs

      // delete & update parents ???

      // delete and update referred parents

      const results = await Promise.allSettled(promises);
      for (const result of results) {
        if (result instanceof Error) {
          console.log(
            "Single Error when synching delete of Fee on joined and parent objects:",
            dataId,
            result,
          );
          hexaLogger.insertError(
            "SyncJoinError",
            { function: "syncJoins", dataId: dataId },
            "->syncJoins",
            result,
          );
        }
      }
    } catch (err) {
      console.log(
        "Total Error when synching delete of Fee on joined and parent objects:",
        dataId,
        err,
      );
      hexaLogger.insertError(
        "SyncJoinsTotalError",
        { function: "syncJoins", dataId: dataId },
        "->syncJoins",
        err,
      );
    }
  }
}

const dbDeleteFee = async (input) => {
  input.id = input.feeId;
  const dbDeleteCommand = new DbDeleteFeeCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteFee;
