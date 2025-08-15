const { HttpServerError } = require("common");

const { Fee } = require("models");

const getFeeById = async (feeId) => {
  try {
    let fee;

    if (Array.isArray(feeId)) {
      fee = await Fee.find({
        _id: { $in: feeId },
        isActive: true,
      });
    } else {
      fee = await Fee.findOne({
        _id: feeId,
        isActive: true,
      });
    }

    if (!fee) {
      return null;
    }

    return Array.isArray(feeId)
      ? fee.map((item) => item.getData())
      : fee.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingFeeById", err);
  }
};

module.exports = getFeeById;
