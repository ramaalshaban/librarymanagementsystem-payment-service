const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { FeeEvent } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetFeeeventCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, FeeEvent);
    this.commandName = "dbGetFeeevent";
    this.nullResult = false;
    this.objectName = "feeEvent";
    this.serviceLabel = "librarymanagementsystem-payment-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (FeeEvent.getCqrsJoins) {
      await FeeEvent.getCqrsJoins(data);
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

const dbGetFeeevent = (input) => {
  input.id = input.feeEventId;
  const dbGetCommand = new DbGetFeeeventCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetFeeevent;
