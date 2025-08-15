const FeePaymentManager = require("./FeePaymentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { PaymentCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreatePayment } = require("dbLayer");

class CreatePaymentManager extends FeePaymentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createPayment",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "feePayment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.ownerId = this.ownerId;
    jsonObj.orderId = this.orderId;
    jsonObj.paymentId = this.paymentId;
    jsonObj.paymentStatus = this.paymentStatus;
    jsonObj.statusLiteral = this.statusLiteral;
    jsonObj.redirectUrl = this.redirectUrl;
  }

  readRestParameters(request) {
    this.ownerId = request.session?.userId;
    this.orderId = request.body?.orderId;
    this.paymentId = request.body?.paymentId;
    this.paymentStatus = request.body?.paymentStatus;
    this.statusLiteral = request.body?.statusLiteral;
    this.redirectUrl = request.body?.redirectUrl;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.ownerId = request.session.userId;
    this.orderId = request.mcpParams.orderId;
    this.paymentId = request.mcpParams.paymentId;
    this.paymentStatus = request.mcpParams.paymentStatus;
    this.statusLiteral = request.mcpParams.statusLiteral;
    this.redirectUrl = request.mcpParams.redirectUrl;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.orderId == null) {
      throw new BadRequestError("errMsg_orderIdisRequired");
    }

    if (this.paymentId == null) {
      throw new BadRequestError("errMsg_paymentIdisRequired");
    }

    if (this.paymentStatus == null) {
      throw new BadRequestError("errMsg_paymentStatusisRequired");
    }

    if (this.statusLiteral == null) {
      throw new BadRequestError("errMsg_statusLiteralisRequired");
    }

    // ID
    if (
      this.ownerId &&
      !isValidObjectId(this.ownerId) &&
      !isValidUUID(this.ownerId)
    ) {
      throw new BadRequestError("errMsg_ownerIdisNotAValidID");
    }

    // ID
    if (
      this.orderId &&
      !isValidObjectId(this.orderId) &&
      !isValidUUID(this.orderId)
    ) {
      throw new BadRequestError("errMsg_orderIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.feePayment?.ownerId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreatePayment function to create the payment and return the result to the controller
    const payment = await dbCreatePayment(this);

    return payment;
  }

  async raiseEvent() {
    PaymentCreatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.feePaymentId = this.id;
    if (!this.feePaymentId) this.feePaymentId = newObjectId();

    const dataClause = {
      _id: this.feePaymentId,
      ownerId: this.ownerId,
      orderId: this.orderId,
      paymentId: this.paymentId,
      paymentStatus: this.paymentStatus,
      statusLiteral: this.statusLiteral,
      redirectUrl: this.redirectUrl,
    };

    return dataClause;
  }
}

module.exports = CreatePaymentManager;
