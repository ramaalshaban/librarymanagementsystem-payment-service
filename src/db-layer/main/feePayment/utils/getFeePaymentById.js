const { HttpServerError } = require("common");

const { FeePayment } = require("models");

const getFeePaymentById = async (feePaymentId) => {
  try {
    let feePayment;

    if (Array.isArray(feePaymentId)) {
      feePayment = await FeePayment.find({
        _id: { $in: feePaymentId },
        isActive: true,
      });
    } else {
      feePayment = await FeePayment.findOne({
        _id: feePaymentId,
        isActive: true,
      });
    }

    if (!feePayment) {
      return null;
    }

    return Array.isArray(feePaymentId)
      ? feePayment.map((item) => item.getData())
      : feePayment.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeePaymentById",
      err,
    );
  }
};

module.exports = getFeePaymentById;
