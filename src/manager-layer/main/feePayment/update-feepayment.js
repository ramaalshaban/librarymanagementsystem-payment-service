const FeePaymentManager = require("./FeePaymentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { FeepaymentUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateFeepayment } = require("dbLayer");

class UpdateFeePaymentManager extends FeePaymentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateFeePayment",
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
    jsonObj.paymentStatus = this.paymentStatus;
    jsonObj.paymentDate = this.paymentDate;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.feePaymentId = request.params?.feePaymentId;
    this.paymentStatus = request.body?.paymentStatus;
    this.paymentDate = request.body?.paymentDate;
    this.note = request.body?.note;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feePaymentId = request.mcpParams.feePaymentId;
    this.paymentStatus = request.mcpParams.paymentStatus;
    this.paymentDate = request.mcpParams.paymentDate;
    this.note = request.mcpParams.note;
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
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.feePayment?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateFeepayment function to update the feepayment and return the result to the controller
    const feepayment = await dbUpdateFeepayment(this);

    return feepayment;
  }

  async raiseEvent() {
    FeepaymentUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
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
      paymentStatus: this.paymentStatus,
      paymentDate: this.paymentDate,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = UpdateFeePaymentManager;
