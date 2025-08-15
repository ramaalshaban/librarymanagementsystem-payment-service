const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Fee } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { FeeQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getFeeById = require("./utils/getFeeById");

class DbCheckoutcompleteFeeCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, Fee, instanceMode);
    this.commandName = "dbCheckoutcompleteFee";
    this.nullResult = false;
    this.objectName = "fee";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-payment-service-dbevent-fee-updated";
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
    this.queryCacheInvalidator = new FeeQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "fee",
      this.session,
      this.requestId,
    );
    const dbData = await getFeeById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbCheckoutcompleteFee = async (input) => {
  input.id = input.feeId;
  const dbUpdateCommand = new DbCheckoutcompleteFeeCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbCheckoutcompleteFee;
