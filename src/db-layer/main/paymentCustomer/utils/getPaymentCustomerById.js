const { HttpServerError } = require("common");

const { PaymentCustomer } = require("models");

const getPaymentCustomerById = async (paymentCustomerId) => {
  try {
    let paymentCustomer;

    if (Array.isArray(paymentCustomerId)) {
      paymentCustomer = await PaymentCustomer.find({
        _id: { $in: paymentCustomerId },
        isActive: true,
      });
    } else {
      paymentCustomer = await PaymentCustomer.findOne({
        _id: paymentCustomerId,
        isActive: true,
      });
    }

    if (!paymentCustomer) {
      return null;
    }

    return Array.isArray(paymentCustomerId)
      ? paymentCustomer.map((item) => item.getData())
      : paymentCustomer.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerById",
      err,
    );
  }
};

module.exports = getPaymentCustomerById;
