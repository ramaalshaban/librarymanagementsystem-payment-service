const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { PaymentCustomer } = require("models");

const getPaymentCustomerByCustomerId = async (customerId) => {
  try {
    const paymentCustomer = await PaymentCustomer.findOne({
      customerId: customerId,
      isActive: true,
    });

    if (!paymentCustomer) {
      return null;
    }

    return paymentCustomer.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerByCustomerId",
      err,
    );
  }
};

module.exports = getPaymentCustomerByCustomerId;
