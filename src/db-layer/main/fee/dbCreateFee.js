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

const { Fee } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { FeeQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getFeeById = require("./utils/getFeeById");

class DbCreateFeeCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateFee";
    this.objectName = "fee";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.dbEvent =
      "librarymanagementsystem-payment-service-dbevent-fee-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let fee = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        userId: this.dataClause.userId,
        loanId: this.dataClause.loanId,
      };

      fee = fee || (await Fee.findOne(whereClause));

      if (fee) {
        delete this.dataClause.id;
        this.dataClause.isActive = true;
        if (!updated) await fee.update(this.dataClause);
        updated = true;
      }

      if (!updated && this.dataClause.id && !exists) {
        fee = fee || (await Fee.findById(this.dataClause.id));
        if (fee) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await fee.update(this.dataClause);
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
        "Error in checking unique index when creating Fee",
        eDetail,
      );
    }

    if (!updated && !exists) {
      fee = await Fee.create(this.dataClause);
    }

    this.dbData = fee.getData();
    this.input.fee = this.dbData;
    await this.create_childs();
  }
}

const dbCreateFee = async (input) => {
  const dbCreateCommand = new DbCreateFeeCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateFee;
