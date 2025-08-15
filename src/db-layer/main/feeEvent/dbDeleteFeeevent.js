const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
// do i need to add the referring part or does the mongodb use the things differently
// is there specific approch to handle the referential integrity or it done interrenly
const { FeeEvent } = require("models");
const { ObjectId } = require("mongoose").Types;

const { FeeEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");

const { DBSoftDeleteMongooseCommand } = require("dbCommand");

class DbDeleteFeeeventCommand extends DBSoftDeleteMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    super(input, FeeEvent, instanceMode);
    this.commandName = "dbDeleteFeeevent";
    this.nullResult = false;
    this.objectName = "feeEvent";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.dbEvent =
      "librarymanagementsystem-payment-service" +
      "-dbevent-" +
      "feeevent-deleted";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async createQueryCacheInvalidator() {
    this.queryCacheInvalidator = new FeeEventQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "feeEvent",
      this.session,
      this.requestId,
    );
    await elasticIndexer.deleteData(this.dbData.id);
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbDeleteFeeevent = async (input) => {
  input.id = input.feeEventId;
  const dbDeleteCommand = new DbDeleteFeeeventCommand(input);
  return dbDeleteCommand.execute();
};

module.exports = dbDeleteFeeevent;
