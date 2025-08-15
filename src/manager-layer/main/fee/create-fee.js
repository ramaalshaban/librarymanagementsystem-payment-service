const FeeManager = require("./FeeManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { FeeCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateFee } = require("dbLayer");

class CreateFeeManager extends FeeManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createFee",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "fee";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.loanId = this.loanId;
    jsonObj.amount = this.amount;
    jsonObj.currency = this.currency;
    jsonObj.status = this.status;
    jsonObj.statusUpdateDate = this.statusUpdateDate;
    jsonObj.reason = this.reason;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.userId = request.body?.userId;
    this.loanId = request.body?.loanId;
    this.amount = request.body?.amount;
    this.currency = request.body?.currency;
    this.status = request.body?.status;
    this.statusUpdateDate = request.body?.statusUpdateDate;
    this.reason = request.body?.reason;
    this.note = request.body?.note;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.userId = request.mcpParams.userId;
    this.loanId = request.mcpParams.loanId;
    this.amount = request.mcpParams.amount;
    this.currency = request.mcpParams.currency;
    this.status = request.mcpParams.status;
    this.statusUpdateDate = request.mcpParams.statusUpdateDate;
    this.reason = request.mcpParams.reason;
    this.note = request.mcpParams.note;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.amount == null) {
      throw new BadRequestError("errMsg_amountisRequired");
    }

    if (this.currency == null) {
      throw new BadRequestError("errMsg_currencyisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    if (this.statusUpdateDate == null) {
      throw new BadRequestError("errMsg_statusUpdateDateisRequired");
    }

    // ID
    if (
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }

    // ID
    if (
      this.loanId &&
      !isValidObjectId(this.loanId) &&
      !isValidUUID(this.loanId)
    ) {
      throw new BadRequestError("errMsg_loanIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.fee?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateFee function to create the fee and return the result to the controller
    const fee = await dbCreateFee(this);

    return fee;
  }

  async raiseEvent() {
    FeeCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.feeId = this.id;
    if (!this.feeId) this.feeId = newObjectId();

    const dataClause = {
      _id: this.feeId,
      userId: this.userId,
      loanId: this.loanId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      statusUpdateDate: this.statusUpdateDate,
      reason: this.reason,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = CreateFeeManager;
