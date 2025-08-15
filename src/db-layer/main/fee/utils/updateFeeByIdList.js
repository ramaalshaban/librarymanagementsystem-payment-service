const { HttpServerError } = require("common");

const { Fee } = require("models");

const updateFeeByIdList = async (idList, dataClause) => {
  try {
    await Fee.updateMany({ _id: { $in: idList }, isActive: true }, dataClause);

    const updatedDocs = await Fee.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const feeIdList = updatedDocs.map((doc) => doc._id);

    return feeIdList;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenUpdatingFeeByIdList", err);
  }
};

module.exports = updateFeeByIdList;
