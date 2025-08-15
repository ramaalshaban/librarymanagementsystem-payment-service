const FeeEventManager = require("./FeeEventManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { FeeeventUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateFeeevent } = require("dbLayer");

class UpdateFeeEventManager extends FeeEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateFeeEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
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

  async fetchInstance() {
    const { getFeeEventById } = require("dbLayer");
    this.feeEvent = await getFeeEventById(this.feeEventId);
    if (!this.feeEvent) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

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
    // make an awaited call to the dbUpdateFeeevent function to update the feeevent and return the result to the controller
    const feeevent = await dbUpdateFeeevent(this);

    return feeevent;
  }

  async raiseEvent() {
    FeeeventUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {};

    return dataClause;
  }
}

module.exports = UpdateFeeEventManager;
