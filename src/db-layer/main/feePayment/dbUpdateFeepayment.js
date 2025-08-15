const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { FeePayment } = require("models");

const { DBUpdateMongooseCommand } = require("dbCommand");

const { FeePaymentQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getFeePaymentById = require("./utils/getFeePaymentById");

class DbUpdateFeepaymentCommand extends DBUpdateMongooseCommand {
  constructor(input) {
    const instanceMode = true;
    input.isBulk = false;
    input.updateEach = false;
    super(input, FeePayment, instanceMode);
    this.commandName = "dbUpdateFeepayment";
    this.nullResult = false;
    this.objectName = "feePayment";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.joinedCriteria = false;
    this.dbEvent =
      "librarymanagementsystem-payment-service-dbevent-feepayment-updated";
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
    this.queryCacheInvalidator = new FeePaymentQueryCacheInvalidator();
  }

  async indexDataToElastic() {
    const elasticIndexer = new ElasticIndexer(
      "feePayment",
      this.session,
      this.requestId,
    );
    const dbData = await getFeePaymentById(this.dbData.id);
    await elasticIndexer.indexData(dbData);
  }

  // ask about this should i rename the whereClause to dataClause???

  async setCalculatedFieldsAfterInstance(data) {
    const input = this.input;
  }
}

const dbUpdateFeepayment = async (input) => {
  input.id = input.feePaymentId;
  const dbUpdateCommand = new DbUpdateFeepaymentCommand(input);
  return await dbUpdateCommand.execute();
};

module.exports = dbUpdateFeepayment;
