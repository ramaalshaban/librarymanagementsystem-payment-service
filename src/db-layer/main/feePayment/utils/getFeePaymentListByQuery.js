const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { FeePayment } = require("models");

const getFeePaymentListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const feePayment = await FeePayment.find(query);

    if (!feePayment || feePayment.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!feePayment || feePayment.length === 0) {
    //      throw new NotFoundError(
    //      `FeePayment with the specified criteria not found`
    //  );
    //}

    return feePayment.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeePaymentListByQuery",
      err,
    );
  }
};

module.exports = getFeePaymentListByQuery;
