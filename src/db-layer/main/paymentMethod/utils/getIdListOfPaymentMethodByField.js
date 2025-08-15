const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { PaymentMethod } = require("models");

const getIdListOfPaymentMethodByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const paymentMethodProperties = [
      "id",
      "paymentMethodId",
      "userId",
      "customerId",
      "cardHolderName",
      "cardHolderZip",
      "platform",
      "cardInfo",
    ];

    if (!paymentMethodProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = PaymentMethod.schema.paths[fieldName];
    if (schemaPath && fieldValue !== undefined && fieldValue !== null) {
      const expectedType = schemaPath.instance.toLowerCase();
      const actualType = typeof fieldValue;

      const typeMapping = {
        string: "string",
        number: "number",
        boolean: "boolean",
        objectid: "string", // ObjectIds are typically passed as strings
      };

      const expectedJSType = typeMapping[expectedType];
      if (expectedJSType && actualType !== expectedJSType) {
        throw new BadRequestError(
          `Invalid field value type for ${fieldName}. Expected ${expectedJSType}, got ${actualType}.`,
        );
      }
    }

    let query = isArray
      ? {
          [fieldName]: {
            $in: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          },
        }
      : { [fieldName]: fieldValue };

    query.isActive = true;

    let paymentMethodIdList = await PaymentMethod.find(query, { _id: 1 })
      .lean()
      .exec();

    if (!paymentMethodIdList || paymentMethodIdList.length === 0) {
      throw new NotFoundError(
        `PaymentMethod with the specified criteria not found`,
      );
    }

    paymentMethodIdList = paymentMethodIdList.map((item) =>
      item._id.toString(),
    );

    return paymentMethodIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentMethodIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPaymentMethodByField;
