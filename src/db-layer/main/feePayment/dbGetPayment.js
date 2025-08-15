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

class DbGetPaymentCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, FeePayment);
    this.commandName = "dbGetPayment";
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

const dbGetPayment = (input) => {
  input.id = input.feePaymentId;
  const dbGetCommand = new DbGetPaymentCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetPayment;
