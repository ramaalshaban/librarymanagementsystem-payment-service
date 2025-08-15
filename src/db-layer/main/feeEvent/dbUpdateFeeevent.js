const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { FeeEvent } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { FeeEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getFeeEventById = require("./utils/getFeeEventById");

class DbUpdateFeeeventCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, FeeEvent, instanceMode);
    this.commandName = "dbUpdateFeeevent";
    this.nullResult = false;
    this.objectName = "feeEvent";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-payment-service-dbevent-feeevent-updated";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  initOwnership(input) {
    super.initOwnership(input);
  }

  async transposeResult() {
    // transpose dbData
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
    const dbData = await getFeeEventById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateFeeevent = async (input) => {
  input.id = input.feeEventId;
  const dbUpdateCommand = new DbUpdateFeeeventCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateFeeevent;
