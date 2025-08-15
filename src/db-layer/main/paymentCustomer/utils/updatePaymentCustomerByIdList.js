const { HttpServerError } = require("common");

const { PaymentCustomer } = require("models");

const updatePaymentCustomerByIdList = async (idList, dataClause) => {
  try {
    await PaymentCustomer.updateMany(
      { _id: { $in: idList }, isActive: true },
      dataClause,
    );

    const updatedDocs = await PaymentCustomer.find(
      { _id: { $in: idList }, isActive: true },
      { _id: 1 },
    );

    const paymentCustomerIdList = updatedDocs.map((doc) => doc._id);

    return paymentCustomerIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenUpdatingPaymentCustomerByIdList",
      err,
    );
  }
};

module.exports = updatePaymentCustomerByIdList;
