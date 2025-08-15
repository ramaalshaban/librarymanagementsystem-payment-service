const { HttpServerError, BadRequestError } = require("common");

const { PaymentCustomer } = require("models");

const deletePaymentCustomerByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }
    // sholuld i match the resul returned with sequlize?

    const docs = await PaymentCustomer.find({ ...query, isActive: true });
    if (!docs || docs.length === 0) return [];

    await PaymentCustomer.updateMany(
      { ...query, isActive: true },
      { isActive: false, updatedAt: new Date() },
    );
    return docs.map((doc) => doc.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenDeletingPaymentCustomerByQuery",
      err,
    );
  }
};

module.exports = deletePaymentCustomerByQuery;
