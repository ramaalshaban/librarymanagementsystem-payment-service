// exsik olan :
//if exits update and if not exits create
//if index.onDuplicate == "throwError" throw error
//

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { FeePayment } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { FeePaymentQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getFeePaymentById = require("./utils/getFeePaymentById");

class DbCreateFeepaymentCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateFeepayment";
    this.objectName = "feePayment";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.dbEvent =
      "librarymanagementsystem-payment-service-dbevent-feepayment-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let feePayment = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        feeId: this.dataClause.feeId,
      };

      feePayment = feePayment || (await FeePayment.findOne(whereClause));

      if (feePayment) {
        delete this.dataClause.id;
        this.dataClause.isActive = true;
        if (!updated) await feePayment.update(this.dataClause);
        updated = true;
      }

      if (!updated && this.dataClause.id && !exists) {
        feePayment =
          feePayment || (await FeePayment.findById(this.dataClause.id));
        if (feePayment) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await feePayment.update(this.dataClause);
          updated = true;
        }
      }
    } catch (error) {
      const eDetail = {
        dataClause: this.dataClause,
        errorStack: error.stack,
        checkoutResult: this.input.checkoutResult,
      };
      throw new HttpServerError(
        "Error in checking unique index when creating FeePayment",
        eDetail,
      );
    }

    if (!updated && !exists) {
      feePayment = await FeePayment.create(this.dataClause);
    }

    this.dbData = feePayment.getData();
    this.input.feePayment = this.dbData;
    await this.create_childs();
  }
}

const dbCreateFeepayment = async (input) => {
  const dbCreateCommand = new DbCreateFeepaymentCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateFeepayment;
