const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { FeeEvent } = require("models");

const getFeeEventListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const feeEvent = await FeeEvent.find(query);

    if (!feeEvent || feeEvent.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!feeEvent || feeEvent.length === 0) {
    //      throw new NotFoundError(
    //      `FeeEvent with the specified criteria not found`
    //  );
    //}

    return feeEvent.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeeEventListByQuery",
      err,
    );
  }
};

module.exports = getFeeEventListByQuery;
