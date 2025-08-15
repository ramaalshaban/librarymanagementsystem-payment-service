const { HttpServerError, BadRequestError } = require("common");

const { FeeEvent } = require("models");

const getFeeEventByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const feeEvent = await FeeEvent.findOne({
      ...query,
      isActive: true,
    });

    if (!feeEvent) return null;

    return feeEvent.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeeEventByQuery",
      err,
    );
  }
};

module.exports = getFeeEventByQuery;
