const { stripeGateWay, HttpServerError } = require("common");

const { getPaymentCustomerId } = require("utils").paymentUtils;

class ChekckoutManager {
  constructor(name, apiManager) {
    this.name = apiManager.objectName;
    this.apiManager = apiManager;
    this.objectName = apiManager.objectName;
    this.modelName = apiManager.modelName;
    this.routeResourcePath = apiManager.routeResourcePath;
    this.session = apiManager.session;
  }

  async createPaymentGate() {
    this.paymentGate = stripeGateWay;
    this.paymentGate.initPaymentGate();
    this.paymentGate.registerWebHook(
      process.env.SERVICE_URL + "/checkout-webhook/" + this.objectName,
    );
  }

  async getPaymentTicket(orderId) {
    // implement in child class
  }

  async upsertPaymentTicket(
    ticketId,
    orderId,
    paymentId,
    paymentStatus,
    statusLiteral,
    redirectUrl,
  ) {
    // implement in child class
  }

  getCheckoutParameters(userParams) {
    return this.apiManager.getCheckoutParameters(userParams);
  }

  async startCheckout(userParams) {
    const coParams = this.getCheckoutParameters(userParams);

    const customerId = await getPaymentCustomerId(this.session);
    coParams.customerId = customerId;

    if (userParams && userParams.return_url) {
      coParams.return_url = userParams.return_url;
    }

    const currentPaymentTicket = await this.getPaymentTicket(coParams.orderId);

    if (
      currentPaymentTicket &&
      currentPaymentTicket.statusLiteral == "success"
    ) {
      throw new HttpServerError(
        `Checkout already completed for this ${this.objectName} order:` +
          coParams.orderId,
      );
    }

    try {
      // Create a PaymentStart with the order amount and currency
      const { paymentId, paymentStatus, paymentIntentInfo, statusLiteral } =
        await this.paymentGate.startCheckout(coParams);

      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        coParams.orderId,
        paymentId,
        paymentStatus,
        statusLiteral,
        coParams.redirectUrl,
      );

      console.log("Checkout payment start created...", paymentId);

      this.checkoutUpdated(statusLiteral);

      if (paymentIntentInfo.requires_redirect) {
        console.log("Redirecting to ", paymentIntentInfo.redirectToUrl);
      }

      return {
        paymentTicketId: paymentTicket.id,
        orderId: coParams.orderId,
        paymentId: paymentId,
        paymentStatus: paymentStatus,
        paymentIntentInfo: paymentIntentInfo,
        statusLiteral: statusLiteral,
        amount: coParams.amount,
        currency: coParams.currency,
        success: true,
        description: coParams.description,
        metadata: coParams.metadata,
        paymentUserParams: userParams,
      };
    } catch (err) {
      console.log(err);
      const gateResult = "rejected"; // analyze from error later
      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        coParams.orderId,
        coParams.orderId,
        gateResult,
        "failed",
      );
      this.checkoutUpdated("failed");

      throw err;
    }
  }

  async completeCheckout(userParams) {
    // this step is used to complete the payment in the bckend side
    // this is not used in stripe implematation
    const coParams = {
      orderId: this.apiManager.getOrderId(),
      paymentUserParams: userParams,
      bodyParams: this.bodyParams,
    };

    const currentPaymentTicket = await this.getPaymentTicket(coParams.orderId);
    if (
      currentPaymentTicket &&
      currentPaymentTicket.statusLiteral == "success"
    ) {
      throw new HttpServerError(
        `Checkout already completed for this  ${this.objectName} order:${coParams.orderId}`,
      );
    }

    if (!currentPaymentTicket) {
      throw new HttpServerError(
        `Checkout didnt started for this  ${this.objectName} order:${coParams.orderId}`,
      );
    }

    coParams.paymentId = currentPaymentTicket.paymentId;
    coParams.returnUrl = currentPaymentTicket.redirectUrl;

    try {
      // Create a PaymentStart with the order amount and currency
      const {
        paymentId,
        paymentStatus,
        paymentCompleteInfo,
        metadata,
        statusLiteral,
      } = await this.paymentGate.completeCheckout(coParams);

      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        coParams.orderId,
        paymentId,
        paymentStatus,
        statusLiteral,
      );

      this.checkoutUpdated(statusLiteral);

      console.log("Checkout payment completed...", paymentId);

      return {
        paymentId: paymentId,
        paymentStatus: paymentStatus,
        paymentTicketId: paymentTicket.id,
        paymentCompleteInfo: paymentCompleteInfo,
        statusLiteral: statusLiteral,
        success: true,
        metadata: metadata,
        paymentUserParams: userParams,
        redirectUrl: paymentTicket.redirectUrl,
      };
    } catch (err) {
      this.checkoutUpdated("failed");
      const gateResult = "rejected"; // analyze from error later
      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        coParams.orderId,
        coParams.paymentId,
        gateResult,
        "failed",
      );

      throw err;
    }
  }

  async refreshCheckout(userParams) {
    const coParams = this.getCheckoutParameters(userParams);

    const currentPaymentTicket = await this.getPaymentTicket(coParams.orderId);
    if (!currentPaymentTicket) {
      throw new HttpServerError(
        `Checkout didnt started for this  ${this.objectName} order:${coParams.orderId}`,
      );
    }
    coParams.paymentId = currentPaymentTicket.paymentId;
    try {
      // Create a PaymentStart with the order amount and currency
      const {
        paymentId,
        paymentStatus,
        metadata,
        paymentRefreshInfo,
        statusLiteral,
      } = await this.paymentGate.refreshCheckout(coParams);

      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        coParams.orderId,
        paymentId,
        paymentStatus,
        statusLiteral,
      );

      this.checkoutUpdated(statusLiteral);

      console.log("Checkout payment refreshed...", paymentId);

      return {
        paymentId: paymentId,
        paymentStatus: paymentStatus,
        paymentTicketId: paymentTicket.id,
        paymentRefreshInfo: paymentRefreshInfo,
        statusLiteral: statusLiteral,
        success: true,
        metadata: metadata,
        paymentUserParams: userParams,
      };
    } catch (err) {
      this.checkoutUpdated("failed");
      const gateResult = "rejected"; // analyze from error later
      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        coParams.orderId,
        coParams.paymentId,
        gateResult,
        "failed",
      );

      throw err;
    }
  }

  async processCheckoutCallbackResult(paymentCallbackParams) {
    try {
      const statusLiteral = paymentCallbackParams.statusLiteral;

      this.checkoutUpdated(statusLiteral);

      const orderId = paymentCallbackParams.orderId;
      const paymentId = paymentCallbackParams.paymentId;
      const paymentStatus = paymentCallbackParams.paymentStatus;

      const currentPaymentTicket = await this.getPaymentTicket(orderId);

      if (
        (currentPaymentTicket &&
          currentPaymentTicket.statusLiteral === "success") ||
        currentPaymentTicket.statusLiteral === statusLiteral
      ) {
        return {
          noUpdate: true,
          paymentId: paymentId,
          paymentStatus: paymentStatus,
          paymentTicketId: currentPaymentTicket.id,
          statusLiteral: statusLiteral,
          paymentCallbackParams: paymentCallbackParams,
        };
      }

      const paymentTicket = await this.upsertPaymentTicket(
        currentPaymentTicket?.id,
        orderId,
        paymentId,
        paymentStatus,
        statusLiteral,
      );

      this.checkoutUpdated(statusLiteral);

      return {
        paymentId: paymentId,
        paymentStatus: paymentStatus,
        paymentTicketId: paymentTicket.id,
        statusLiteral: statusLiteral,
        paymentCallbackParams: paymentCallbackParams,
      };
    } catch (err) {
      console.log(err);
    }
  }

  checkoutUpdated(statusLiteral) {
    this.apiManager.checkoutUpdated(statusLiteral);
  }
}

module.exports = ChekckoutManager;
