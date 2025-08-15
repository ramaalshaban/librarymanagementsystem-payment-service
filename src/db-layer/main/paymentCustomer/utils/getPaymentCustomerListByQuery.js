const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { PaymentCustomer } = require("models");

const getPaymentCustomerListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const paymentCustomer = await PaymentCustomer.find(query);

    if (!paymentCustomer || paymentCustomer.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!paymentCustomer || paymentCustomer.length === 0) {
    //      throw new NotFoundError(
    //      `PaymentCustomer with the specified criteria not found`
    //  );
    //}

    return paymentCustomer.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerListByQuery",
      err,
    );
  }
};

module.exports = getPaymentCustomerListByQuery;
