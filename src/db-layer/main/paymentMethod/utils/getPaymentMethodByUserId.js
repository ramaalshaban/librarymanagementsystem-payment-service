const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PaymentMethod } = require("models");

const getPaymentMethodByUserId = async (userId) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      userId: userId,
      isActive: true,
    });

    if (!paymentMethod) {
      return null;
    }

    return paymentMethod.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodByUserId",
      err,
    );
  }
};

module.exports = getPaymentMethodByUserId;
