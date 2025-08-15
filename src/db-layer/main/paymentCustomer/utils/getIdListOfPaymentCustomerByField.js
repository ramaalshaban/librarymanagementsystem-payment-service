const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { PaymentCustomer } = require("models");

const getIdListOfPaymentCustomerByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    const paymentCustomerProperties = [
      "id",
      "userId",
      "customerId",
      "platform",
    ];

    if (!paymentCustomerProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = PaymentCustomer.schema.paths[fieldName];
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

    let paymentCustomerIdList = await PaymentCustomer.find(query, { _id: 1 })
      .lean()
      .exec();

    if (!paymentCustomerIdList || paymentCustomerIdList.length === 0) {
      throw new NotFoundError(
        `PaymentCustomer with the specified criteria not found`,
      );
    }

    paymentCustomerIdList = paymentCustomerIdList.map((item) =>
      item._id.toString(),
    );

    return paymentCustomerIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingPaymentCustomerIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfPaymentCustomerByField;
