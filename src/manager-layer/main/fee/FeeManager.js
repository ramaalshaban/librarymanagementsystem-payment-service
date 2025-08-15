const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const FeeCheckout = require("../../checkout/fee-checkout");

const PaymentServiceManager = require("../../service-manager/PaymentServiceManager");

/* Base Class For the Crud Routes Of DbObject Fee */
class FeeManager extends PaymentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "fee";
    this.modelName = "Fee";

    this.checkoutManager = new FeeCheckout("fee", this);
    this.checkoutOrderStatus = 0;
    this.checkoutManager.createPaymentGate();
  }

  toJSON() {
    const jsonObj = super.toJSON();

    jsonObj.paymentGateName = this.checkoutManager?.paymentGate?.gateName;

    return jsonObj;
  }

  getOrderId() {
    return this.feeId;
  }

  async checkoutUpdated(statusLiteral) {
    switch (statusLiteral) {
      case "started":
        await this.checkoutStarted();
        break;
      case "canceled":
        await this.checkoutCanceled();
        break;
      case "failed":
        await this.checkoutFailed();
        break;
      case "success":
        await this.checkoutDone();
        break;
      default:
        await this.checkoutFailed();
        break;
    }
  }

  async checkoutStarted() {
    this.status = 1;
  }

  async checkoutCanceled() {
    this.status = 3;
  }

  async checkoutFailed() {
    this.status = 4;
  }

  async checkoutDone() {
    this.status = 2;
  }

  getCheckoutParameters(userParams) {
    const description = `Library overdue fee for user ${this.fee.userId}, fee ${this.fee.id}`;

    return {
      userId: this.session._USERID,
      fullname: this.session.name + " " + this.session.surname,
      email: this.session.email,
      description,
      amount: this.fee.amount,
      currency: this.fee.currency,
      orderId: this.fee.id,
      metadata: {
        order: "Payment-Fee-order",
        orderId: this.fee.id,
        checkoutName: "fee",
      },
      storeCard: userParams?.storeCard,
      paymentUserParams: userParams,
      bodyParams: this.bodyParams,
    };
  }
}

module.exports = FeeManager;
