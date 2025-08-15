const { HttpServerError, BadRequestError } = require("common");

const { PaymentCustomer } = require("models");

const getPaymentCustomerByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const paymentCustomer = await PaymentCustomer.findOne({
      ...query,
      isActive: true,
    });

    if (!paymentCustomer) return null;

    return paymentCustomer.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerByQuery",
      err,
    );
  }
};

module.exports = getPaymentCustomerByQuery;
