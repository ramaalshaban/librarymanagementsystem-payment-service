const { HttpServerError } = require("common");

const { PaymentCustomer } = require("models");

const getPaymentCustomerAggById = async (paymentCustomerId) => {
  try {
    let paymentCustomerQuery;

    if (Array.isArray(paymentCustomerId)) {
      paymentCustomerQuery = PaymentCustomer.find({
        _id: { $in: paymentCustomerId },
        isActive: true,
      });
    } else {
      paymentCustomerQuery = PaymentCustomer.findOne({
        _id: paymentCustomerId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const paymentCustomer = await paymentCustomerQuery.exec();

    if (!paymentCustomer) {
      return null;
    }
    const paymentCustomerData =
      Array.isArray(paymentCustomerId) && paymentCustomerId.length > 0
        ? paymentCustomer.map((item) => item.getData())
        : paymentCustomer.getData();

    // should i add this here?
    await PaymentCustomer.getCqrsJoins(paymentCustomerData);

    return paymentCustomerData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerAggById",
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

module.exports = getPaymentCustomerAggById;
