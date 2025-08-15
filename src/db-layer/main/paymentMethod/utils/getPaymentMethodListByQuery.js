const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { PaymentMethod } = require("models");

const getPaymentMethodListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const paymentMethod = await PaymentMethod.find(query);

    if (!paymentMethod || paymentMethod.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!paymentMethod || paymentMethod.length === 0) {
    //      throw new NotFoundError(
    //      `PaymentMethod with the specified criteria not found`
    //  );
    //}

    return paymentMethod.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodListByQuery",
      err,
    );
  }
};

module.exports = getPaymentMethodListByQuery;
