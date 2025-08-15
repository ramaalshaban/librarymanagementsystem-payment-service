const { HttpServerError, BadRequestError } = require("common");

const { Fee } = require("models");

const getFeeByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const fee = await Fee.findOne({
      ...query,
      isActive: true,
    });

    if (!fee) return null;

    return fee.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingFeeByQuery", err);
  }
};

module.exports = getFeeByQuery;
