const { HttpServerError } = require("common");

const { FeePayment } = require("models");

const getFeePaymentAggById = async (feePaymentId) => {
  try {
    let feePaymentQuery;

    if (Array.isArray(feePaymentId)) {
      feePaymentQuery = FeePayment.find({
        _id: { $in: feePaymentId },
        isActive: true,
      });
    } else {
      feePaymentQuery = FeePayment.findOne({
        _id: feePaymentId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const feePayment = await feePaymentQuery.exec();

    if (!feePayment) {
      return null;
    }
    const feePaymentData =
      Array.isArray(feePaymentId) && feePaymentId.length > 0
        ? feePayment.map((item) => item.getData())
        : feePayment.getData();

    // should i add this here?
    await FeePayment.getCqrsJoins(feePaymentData);

    return feePaymentData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeePaymentAggById",
      err,
    );
  }
};

// "__PropertyEnumSettings.doc": "Enum configuration for the data property, applicable when the property type is set to Enum. While enum values are stored as integers in the database, defining the enum options here allows Mindbricks to enrich API responses with human-readable labels, easing interpretation and UI integration. If not defined, only the numeric value will be returned.",
// "PropertyEnumSettings": {
//   "__hasEnumOptions.doc": "Enables support for named enum values when the property type is Enum. Though values are stored as integers, enabling this adds the symbolic name to API responses for clarity.",
//   "__config.doc": "The configuration object for enum options. Leave it null if hasEnumOptions is false.",
//   "__activation": "hasEnumOptions",
//  "__lines": "\
//  a-hasEnumOptions\
//  g-config",
//  "hasEnumOptions": "Boolean",
//  "config": "PropertyEnumSettingsConfig"
//},

module.exports = getFeePaymentAggById;
