const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PaymentCustomer } = require("models");

const getPaymentCustomerByUserId = async (userId) => {
  try {
    const paymentCustomer = await PaymentCustomer.findOne({
      userId: userId,
      isActive: true,
    });

    if (!paymentCustomer) {
      return null;
    }

    return paymentCustomer.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerByUserId",
      err,
    );
  }
};

module.exports = getPaymentCustomerByUserId;
