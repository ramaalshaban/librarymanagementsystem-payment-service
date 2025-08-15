const FeePaymentManager = require("./FeePaymentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { PaymentUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdatePayment } = require("dbLayer");

class UpdatePaymentManager extends FeePaymentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updatePayment",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "feePayment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.feePaymentId = this.feePaymentId;
    jsonObj.ownerId = this.ownerId;
    jsonObj.paymentId = this.paymentId;
    jsonObj.paymentStatus = this.paymentStatus;
    jsonObj.statusLiteral = this.statusLiteral;
    jsonObj.redirectUrl = this.redirectUrl;
  }

  readRestParameters(request) {
    this.feePaymentId = request.params?.feePaymentId;
    this.ownerId = request.session?.userId;
    this.paymentId = request.body?.paymentId;
    this.paymentStatus = request.body?.paymentStatus;
    this.statusLiteral = request.body?.statusLiteral;
    this.redirectUrl = request.body?.redirectUrl;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feePaymentId = request.mcpParams.feePaymentId;
    this.ownerId = request.session.userId;
    this.paymentId = request.mcpParams.paymentId;
    this.paymentStatus = request.mcpParams.paymentStatus;
    this.statusLiteral = request.mcpParams.statusLiteral;
    this.redirectUrl = request.mcpParams.redirectUrl;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getFeePaymentById } = require("dbLayer");
    this.feePayment = await getFeePaymentById(this.feePaymentId);
    if (!this.feePayment) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.feePaymentId == null) {
      throw new BadRequestError("errMsg_feePaymentIdisRequired");
    }

    // ID
    if (
      this.feePaymentId &&
      !isValidObjectId(this.feePaymentId) &&
      !isValidUUID(this.feePaymentId)
    ) {
      throw new BadRequestError("errMsg_feePaymentIdisNotAValidID");
    }

    // ID
    if (
      this.ownerId &&
      !isValidObjectId(this.ownerId) &&
      !isValidUUID(this.ownerId)
    ) {
      throw new BadRequestError("errMsg_ownerIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.feePayment?.ownerId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdatePayment function to update the payment and return the result to the controller
    const payment = await dbUpdatePayment(this);

    return payment;
  }

  async raiseEvent() {
    PaymentUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { $and: [{ id: this.feePaymentId }, { isActive: true }] };

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
      ownerId: this.ownerId,
      paymentId: this.paymentId,
      paymentStatus: this.paymentStatus,
      statusLiteral: this.statusLiteral,
      redirectUrl: this.redirectUrl,
    };

    return dataClause;
  }
}

module.exports = UpdatePaymentManager;
