const { HttpServerError } = require("common");

const { FeePayment } = require("models");

const updateFeePaymentByIdList = async (idList, dataClause) => {
  try {
    await FeePayment.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await FeePayment.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const feePaymentIdList = updatedDocs.map((doc) => doc._id);

    return feePaymentIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingFeePaymentByIdList",
      err,
    );
  }
};

module.exports = updateFeePaymentByIdList;
