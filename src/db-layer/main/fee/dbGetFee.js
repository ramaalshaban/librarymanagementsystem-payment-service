const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { Fee } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetFeeCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, Fee);
    this.commandName = "dbGetFee";
    this.nullResult = false;
    this.objectName = "fee";
    this.serviceLabel = "librarymanagementsystem-payment-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (Fee.getCqrsJoins) {
      await Fee.getCqrsJoins(data);
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

const dbGetFee = (input) => {
  input.id = input.feeId;
  const dbGetCommand = new DbGetFeeCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetFee;
