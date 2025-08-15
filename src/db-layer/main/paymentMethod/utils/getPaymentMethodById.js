const { HttpServerError } = require("common");

const { PaymentMethod } = require("models");

const getPaymentMethodById = async (paymentMethodId) => {
  try {
    let paymentMethod;

    if (Array.isArray(paymentMethodId)) {
      paymentMethod = await PaymentMethod.find({
        _id: { $in: paymentMethodId },
        isActive: true,
      });
    } else {
      paymentMethod = await PaymentMethod.findOne({
        _id: paymentMethodId,
        isActive: true,
      });
    }

    if (!paymentMethod) {
      return null;
    }

    return Array.isArray(paymentMethodId)
      ? paymentMethod.map((item) => item.getData())
      : paymentMethod.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodById",
      err,
    );
  }
};

module.exports = getPaymentMethodById;
