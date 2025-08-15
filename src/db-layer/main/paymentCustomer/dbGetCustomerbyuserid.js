const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");

const { PaymentCustomer } = require("models");
const { ObjectId } = require("mongoose").Types;

const { DBGetMongooseCommand } = require("dbCommand");

class DbGetCustomerbyuseridCommand extends DBGetMongooseCommand {
  constructor(input) {
    super(input, PaymentCustomer);
    this.commandName = "dbGetCustomerbyuserid";
    this.nullResult = false;
    this.objectName = "paymentCustomer";
    this.serviceLabel = "librarymanagementsystem-payment-service";
  }

  loadHookFunctions() {
    super.loadHookFunctions({});
  }

  async getCqrsJoins(data) {
    if (PaymentCustomer.getCqrsJoins) {
      await PaymentCustomer.getCqrsJoins(data);
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

const dbGetCustomerbyuserid = (input) => {
  input.id = input.paymentCustomerId;
  const dbGetCommand = new DbGetCustomerbyuseridCommand(input);
  return dbGetCommand.execute();
};

module.exports = dbGetCustomerbyuserid;
