const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { FeePayment } = require("models");

const getFeePaymentByOrderId = async (orderId) => {
  try {
    const feePayment = await FeePayment.findOne({
      orderId: orderId,
      isActive: true,
    });

    if (!feePayment) {
      return null;
    }

    return feePayment.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeePaymentByOrderId",
      err,
    );
  }
};

module.exports = getFeePaymentByOrderId;
