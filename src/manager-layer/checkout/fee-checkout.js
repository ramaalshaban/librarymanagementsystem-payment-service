const CheckoutManager = require("./CheckoutManager");

const {
  getFeePaymentByOrderId,
  createFeePayment,
  updateFeePaymentById,
} = require("dbLayer");

class FeeCheckout extends CheckoutManager {
  constructor(name, apiManager) {
    super(name, apiManager);
  }

  async getPaymentTicket(orderId) {
    return await getFeePaymentByOrderId(orderId);
  }

  async upsertPaymentTicket(
    ticketId,
    orderId,
    paymentId,
    paymentStatus,
    statusLiteral,
    redirectUrl,
  ) {
    return ticketId
      ? await updateFeePaymentById(ticketId, {
          paymentId,
          paymentStatus,
          statusLiteral,
          redirectUrl,
        })
      : await createFeePayment({
          ownerId: this.session?._USERID,
          orderId,
          paymentId,
          paymentStatus,
          statusLiteral,
          redirectUrl,
        });
  }
}

module.exports = FeeCheckout;
