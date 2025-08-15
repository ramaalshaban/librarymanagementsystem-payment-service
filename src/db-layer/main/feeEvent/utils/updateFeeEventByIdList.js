const { HttpServerError } = require("common");

const { FeeEvent } = require("models");

const updateFeeEventByIdList = async (idList, dataClause) => {
  try {
    await FeeEvent.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await FeeEvent.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const feeEventIdList = updatedDocs.map((doc) => doc._id);

    return feeEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingFeeEventByIdList",
      err,
    );
  }
};

module.exports = updateFeeEventByIdList;
