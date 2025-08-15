const FeeEventManager = require("./FeeEventManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { FeeeventCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateFeeevent } = require("dbLayer");

class CreateFeeEventManager extends FeeEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createFeeEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "feeEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.feeId = this.feeId;
    jsonObj.eventType = this.eventType;
    jsonObj.eventDate = this.eventDate;
    jsonObj.actorUserId = this.actorUserId;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.feeId = request.body?.feeId;
    this.eventType = request.body?.eventType;
    this.eventDate = request.body?.eventDate;
    this.actorUserId = request.body?.actorUserId;
    this.note = request.body?.note;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feeId = request.mcpParams.feeId;
    this.eventType = request.mcpParams.eventType;
    this.eventDate = request.mcpParams.eventDate;
    this.actorUserId = request.mcpParams.actorUserId;
    this.note = request.mcpParams.note;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.feeId == null) {
      throw new BadRequestError("errMsg_feeIdisRequired");
    }

    if (this.eventType == null) {
      throw new BadRequestError("errMsg_eventTypeisRequired");
    }

    if (this.eventDate == null) {
      throw new BadRequestError("errMsg_eventDateisRequired");
    }

    if (this.actorUserId == null) {
      throw new BadRequestError("errMsg_actorUserIdisRequired");
    }

    // ID
    if (
      this.feeId &&
      !isValidObjectId(this.feeId) &&
      !isValidUUID(this.feeId)
    ) {
      throw new BadRequestError("errMsg_feeIdisNotAValidID");
    }

    // ID
    if (
      this.actorUserId &&
      !isValidObjectId(this.actorUserId) &&
      !isValidUUID(this.actorUserId)
    ) {
      throw new BadRequestError("errMsg_actorUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.feeEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateFeeevent function to create the feeevent and return the result to the controller
    const feeevent = await dbCreateFeeevent(this);

    return feeevent;
  }

  async raiseEvent() {
    FeeeventCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.feeEventId = this.id;
    if (!this.feeEventId) this.feeEventId = newObjectId();

    const dataClause = {
      _id: this.feeEventId,
      feeId: this.feeId,
      eventType: this.eventType,
      eventDate: this.eventDate,
      actorUserId: this.actorUserId,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = CreateFeeEventManager;
