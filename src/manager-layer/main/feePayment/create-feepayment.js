const FeePaymentManager = require("./FeePaymentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { FeepaymentCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateFeepayment } = require("dbLayer");

class CreateFeePaymentManager extends FeePaymentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createFeePayment",
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
    jsonObj.feeId = this.feeId;
    jsonObj.amountPaid = this.amountPaid;
    jsonObj.currency = this.currency;
    jsonObj.userId = this.userId;
    jsonObj.paymentMethod = this.paymentMethod;
    jsonObj.paymentStatus = this.paymentStatus;
    jsonObj.paymentDate = this.paymentDate;
    jsonObj.stripePaymentIntentId = this.stripePaymentIntentId;
    jsonObj.handledByUserId = this.handledByUserId;
    jsonObj.note = this.note;
  }

  readRestParameters(request) {
    this.feeId = request.body?.feeId;
    this.amountPaid = request.body?.amountPaid;
    this.currency = request.body?.currency;
    this.userId = request.body?.userId;
    this.paymentMethod = request.body?.paymentMethod;
    this.paymentStatus = request.body?.paymentStatus;
    this.paymentDate = request.body?.paymentDate;
    this.stripePaymentIntentId = request.body?.stripePaymentIntentId;
    this.handledByUserId = request.body?.handledByUserId;
    this.note = request.body?.note;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feeId = request.mcpParams.feeId;
    this.amountPaid = request.mcpParams.amountPaid;
    this.currency = request.mcpParams.currency;
    this.userId = request.mcpParams.userId;
    this.paymentMethod = request.mcpParams.paymentMethod;
    this.paymentStatus = request.mcpParams.paymentStatus;
    this.paymentDate = request.mcpParams.paymentDate;
    this.stripePaymentIntentId = request.mcpParams.stripePaymentIntentId;
    this.handledByUserId = request.mcpParams.handledByUserId;
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

    if (this.amountPaid == null) {
      throw new BadRequestError("errMsg_amountPaidisRequired");
    }

    if (this.currency == null) {
      throw new BadRequestError("errMsg_currencyisRequired");
    }

    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.paymentMethod == null) {
      throw new BadRequestError("errMsg_paymentMethodisRequired");
    }

    if (this.paymentStatus == null) {
      throw new BadRequestError("errMsg_paymentStatusisRequired");
    }

    if (this.paymentDate == null) {
      throw new BadRequestError("errMsg_paymentDateisRequired");
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
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }

    // ID
    if (
      this.handledByUserId &&
      !isValidObjectId(this.handledByUserId) &&
      !isValidUUID(this.handledByUserId)
    ) {
      throw new BadRequestError("errMsg_handledByUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.feePayment?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateFeepayment function to create the feepayment and return the result to the controller
    const feepayment = await dbCreateFeepayment(this);

    return feepayment;
  }

  async raiseEvent() {
    FeepaymentCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newObjectId } = require("common");

    const { hashString } = require("common");

    if (this.id) this.feePaymentId = this.id;
    if (!this.feePaymentId) this.feePaymentId = newObjectId();

    const dataClause = {
      _id: this.feePaymentId,
      feeId: this.feeId,
      amountPaid: this.amountPaid,
      currency: this.currency,
      userId: this.userId,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      paymentDate: this.paymentDate,
      stripePaymentIntentId: this.stripePaymentIntentId,
      handledByUserId: this.handledByUserId,
      note: this.note,
    };

    return dataClause;
  }
}

module.exports = CreateFeePaymentManager;
