const { HttpServerError, BadRequestError } = require("common");

const { PaymentMethod } = require("models");

const getPaymentMethodByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const paymentMethod = await PaymentMethod.findOne({
      ...query,
      isActive: true,
    });

    if (!paymentMethod) return null;

    return paymentMethod.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodByQuery",
      err,
    );
  }
};

module.exports = getPaymentMethodByQuery;
