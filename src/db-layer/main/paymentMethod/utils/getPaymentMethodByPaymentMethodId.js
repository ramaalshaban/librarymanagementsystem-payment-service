const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PaymentMethod } = require("models");

const getPaymentMethodByPaymentMethodId = async (paymentMethodId) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      paymentMethodId: paymentMethodId,
      isActive: true,
    });

    if (!paymentMethod) {
      return null;
    }

    return paymentMethod.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodByPaymentMethodId",
      err,
    );
  }
};

module.exports = getPaymentMethodByPaymentMethodId;
