const { HttpServerError } = require("common");

const { PaymentMethod } = require("models");

const updatePaymentMethodByIdList = async (idList, dataClause) => {
  try {
    await PaymentMethod.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await PaymentMethod.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const paymentMethodIdList = updatedDocs.map((doc) => doc._id);

    return paymentMethodIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPaymentMethodByIdList",
      err,
    );
  }
};

module.exports = updatePaymentMethodByIdList;
