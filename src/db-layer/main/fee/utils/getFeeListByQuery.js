const { HttpServerError, BadRequestError, NotFoundError } = require("common");
const { Fee } = require("models");

const getFeeListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const fee = await Fee.find(query);

    if (!fee || fee.length === 0) return [];

    //should i add not found error or only return empty array?
    //      if (!fee || fee.length === 0) {
    //      throw new NotFoundError(
    //      `Fee with the specified criteria not found`
    //  );
    //}

    return fee.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeeListByQuery",
      err,
    );
  }
};

module.exports = getFeeListByQuery;
