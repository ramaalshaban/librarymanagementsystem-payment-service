const { HttpServerError } = require("common");

const { PaymentMethod } = require("models");

const getPaymentMethodAggById = async (paymentMethodId) => {
  try {
    let paymentMethodQuery;

    if (Array.isArray(paymentMethodId)) {
      paymentMethodQuery = PaymentMethod.find({
        _id: { $in: paymentMethodId },
        isActive: true,
      });
    } else {
      paymentMethodQuery = PaymentMethod.findOne({
        _id: paymentMethodId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const paymentMethod = await paymentMethodQuery.exec();

    if (!paymentMethod) {
      return null;
    }
    const paymentMethodData =
      Array.isArray(paymentMethodId) && paymentMethodId.length > 0
        ? paymentMethod.map((item) => item.getData())
        : paymentMethod.getData();

    // should i add this here?
    await PaymentMethod.getCqrsJoins(paymentMethodData);

    return paymentMethodData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodAggById",
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

module.exports = getPaymentMethodAggById;
