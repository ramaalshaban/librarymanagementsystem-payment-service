const { HttpServerError } = require("common");

const { FeeEvent } = require("models");

const getFeeEventAggById = async (feeEventId) => {
  try {
    let feeEventQuery;

    if (Array.isArray(feeEventId)) {
      feeEventQuery = FeeEvent.find({
        _id: { $in: feeEventId },
        isActive: true,
      });
    } else {
      feeEventQuery = FeeEvent.findOne({
        _id: feeEventId,
        isActive: true,
      });
    }

    // Populate associations as needed

    const feeEvent = await feeEventQuery.exec();

    if (!feeEvent) {
      return null;
    }
    const feeEventData =
      Array.isArray(feeEventId) && feeEventId.length > 0
        ? feeEvent.map((item) => item.getData())
        : feeEvent.getData();

    // should i add this here?
    await FeeEvent.getCqrsJoins(feeEventData);

    return feeEventData;
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeeEventAggById",
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

module.exports = getFeeEventAggById;
