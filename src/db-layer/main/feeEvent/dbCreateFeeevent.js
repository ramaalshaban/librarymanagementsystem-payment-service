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

const { FeeEvent } = require("models");

const { DBCreateMongooseCommand } = require("dbCommand");

const { FeeEventQueryCacheInvalidator } = require("./query-cache-classes");

const { ElasticIndexer } = require("serviceCommon");
const getFeeEventById = require("./utils/getFeeEventById");

class DbCreateFeeeventCommand extends DBCreateMongooseCommand {
  constructor(input) {
    super(input);
    this.commandName = "dbCreateFeeevent";
    this.objectName = "feeEvent";
    this.serviceLabel = "librarymanagementsystem-payment-service";
    this.dbEvent =
      "librarymanagementsystem-payment-service-dbevent-feeevent-created";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
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

  async create_childs() {}

  async transposeResult() {
    // transpose dbData
  }

  async runDbCommand() {
    await super.runDbCommand();

    let feeEvent = null;
    let whereClause = {};
    let updated = false;
    let exists = false;
    try {
      whereClause = {
        feeId: this.dataClause.feeId,
      };

      feeEvent = feeEvent || (await FeeEvent.findOne(whereClause));

      if (feeEvent) {
        delete this.dataClause.id;
        this.dataClause.isActive = true;
        if (!updated) await feeEvent.update(this.dataClause);
        updated = true;
      }

      if (!updated && this.dataClause.id && !exists) {
        feeEvent = feeEvent || (await FeeEvent.findById(this.dataClause.id));
        if (feeEvent) {
          delete this.dataClause.id;
          this.dataClause.isActive = true;
          await feeEvent.update(this.dataClause);
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
        "Error in checking unique index when creating FeeEvent",
        eDetail,
      );
    }

    if (!updated && !exists) {
      feeEvent = await FeeEvent.create(this.dataClause);
    }

    this.dbData = feeEvent.getData();
    this.input.feeEvent = this.dbData;
    await this.create_childs();
  }
}

const dbCreateFeeevent = async (input) => {
  const dbCreateCommand = new DbCreateFeeeventCommand(input);
  return await dbCreateCommand.execute();
};

module.exports = dbCreateFeeevent;
