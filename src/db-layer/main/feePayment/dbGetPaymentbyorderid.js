const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { FeePayment } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetPaymentbyorderidCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, FeePayment);
    this.commandName = "dbGetPaymentbyorderid";
    this.nullResult = false;
    this.objectName = "feePayment";
    this.serviceLabel = "librarymanagementsystem-payment-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (FeePayment.getCqrsJoins) {
      await FeePayment.getCqrsJoins(data);
    }
  }

  // populateQuery(query) {
  //  if (!this.input.getJoins) return query;
  //
  //  return query;
  //}

  initOwnership(input) {
    super.initOwnership(input);
  }

  async checkEntityOwnership(entity) {
    return true;
  }

  // ask about this should i rename the whereClause to dataClause???

  async transposeResult() {
    // transpose dbData
  }
}

const dbGetPaymentbyorderid = (input) => {
  input.id = input.feePaymentId;
  const dbGetCommand = new DbGetPaymentbyorderidCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPaymentbyorderid;
