const { HttpServerError } = require("common");

const { FeeEvent } = require("models");

const getFeeEventById = async (feeEventId) => {
  try {
    let feeEvent;

    if (Array.isArray(feeEventId)) {
      feeEvent = await FeeEvent.find({
        _id: { $in: feeEventId },
        isActive: true,
      });
    } else {
      feeEvent = await FeeEvent.findOne({
        _id: feeEventId,
        isActive: true,
      });
    }

    if (!feeEvent) {
      return null;
    }

    return Array.isArray(feeEventId)
      ? feeEvent.map((item) => item.getData())
      : feeEvent.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingFeeEventById", err);
  }
};

module.exports = getFeeEventById;
