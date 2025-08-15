const FeeManager = require("./FeeManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  FeeCheckoutstartkedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCheckoutstartFee } = require("dbLayer");

class CheckoutstartFeeManager extends FeeManager {
  constructor(request, controllerType) {
    super(request, {
      name: "checkoutstartFee",
      controllerType: controllerType,
      pagination: false,
      doCheckout: "start",
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "fee";

    this.paymentUserParams =
      request.inputData?.paymentUserParams ?? request.body?.paymentUserParams;
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.feeId = this.feeId;
  }

  readRestParameters(request) {
    this.feeId = request.params?.feeId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feeId = request.mcpParams.feeId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getFeeById } = require("dbLayer");
    this.fee = await getFeeById(this.feeId);
    if (!this.fee) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.feeId == null) {
      throw new BadRequestError("errMsg_feeIdisRequired");
    }

    // ID
    if (
      this.feeId &&
      !isValidObjectId(this.feeId) &&
      !isValidUUID(this.feeId)
    ) {
      throw new BadRequestError("errMsg_feeIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.fee?._owner === this.session.userId;
  }

  async checkLayer3AuthValidations() {
    // check ownership of the record agianst the session user
    if (!this.isOwner) {
      throw new ForbiddenError("errMsg_feeCanBeAccessedByOwner");
    }

    //check "403" validations
  }

  async handleCheckout() {
    try {
      this.checkoutResult = await this.checkoutManager.startCheckout(
        this.paymentUserParams,
      );
    } catch (err) {
      if (err instanceof PaymentGateError)
        this.checkoutResult = err.serializeError();
      else throw err;
    }
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCheckoutstartFee function to update the fee and return the result to the controller
    const fee = await dbCheckoutstartFee(this);

    return fee;
  }

  async raiseEvent() {
    FeeCheckoutstartkedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { $and: [{ id: this.feeId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      status: this.status,
      statusUpdateDate: this.statusUpdateDate,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = CheckoutstartFeeManager;
