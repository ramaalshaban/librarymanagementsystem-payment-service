const { HttpServerError, BadRequestError } = require("common");

const { FeePayment } = require("models");

const getFeePaymentByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const feePayment = await FeePayment.findOne({
      ...query,
      isActive: true,
    });

    if (!feePayment) return null;

    return feePayment.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeePaymentByQuery",
      err,
    );
  }
};

module.exports = getFeePaymentByQuery;
