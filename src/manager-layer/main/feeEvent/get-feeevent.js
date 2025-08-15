const FeeEventManager = require("./FeeEventManager");
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
const { dbGetFeeevent } = require("dbLayer");

class GetFeeEventManager extends FeeEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getFeeEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "feeEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.feeEventId = this.feeEventId;
  }

  readRestParameters(request) {
    this.feeEventId = request.params?.feeEventId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feeEventId = request.mcpParams.feeEventId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.feeEventId == null) {
      throw new BadRequestError("errMsg_feeEventIdisRequired");
    }

    // ID
    if (
      this.feeEventId &&
      !isValidObjectId(this.feeEventId) &&
      !isValidUUID(this.feeEventId)
    ) {
      throw new BadRequestError("errMsg_feeEventIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.feeEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetFeeevent function to get the feeevent and return the result to the controller
    const feeevent = await dbGetFeeevent(this);

    return feeevent;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.feeEventId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToMongoDbQuery } = require("common");

    const routeQuery = await this.getRouteQuery();
    return convertUserQueryToMongoDbQuery(routeQuery);
  }
}

module.exports = GetFeeEventManager;
