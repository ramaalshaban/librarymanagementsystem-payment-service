const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PaymentMethod } = require("models");

const getPaymentMethodByCustomerId = async (customerId) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      customerId: customerId,
      isActive: true,
    });

    if (!paymentMethod) {
      return null;
    }

    return paymentMethod.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodByCustomerId",
      err,
    );
  }
};

module.exports = getPaymentMethodByCustomerId;
