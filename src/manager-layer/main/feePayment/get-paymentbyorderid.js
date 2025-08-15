const FeePaymentManager = require("./FeePaymentManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  PaymentbyorderidRetrivedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbGetPaymentbyorderid } = require("dbLayer");

class GetPaymentByOrderIdManager extends FeePaymentManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getPaymentByOrderId",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "feePayment";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.feePaymentId = this.feePaymentId;
  }

  readRestParameters(request) {
    this.feePaymentId = request.params?.feePaymentId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.feePaymentId = request.mcpParams.feePaymentId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

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

    this.isOwner = this.feePayment?.ownerId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetPaymentbyorderid function to get the paymentbyorderid and return the result to the controller
    const paymentbyorderid = await dbGetPaymentbyorderid(this);

    return paymentbyorderid;
  }

  async raiseEvent() {
    PaymentbyorderidRetrivedPublisher.Publish(this.output, this.session).catch(
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
}

module.exports = GetPaymentByOrderIdManager;
