const FeeManager = require("./FeeManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbGetFee } = require("dbLayer");

class GetFeeManager extends FeeManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getFee",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "fee";
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

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetFee function to get the fee and return the result to the controller
    const fee = await dbGetFee(this);

    return fee;
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
}

module.exports = GetFeeManager;
