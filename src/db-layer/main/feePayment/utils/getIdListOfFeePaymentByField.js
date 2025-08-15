const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { FeePayment } = require("models");

const getIdListOfFeePaymentByField = async (fieldName, fieldValue, isArray) => {
  try {
    const feePaymentProperties = [
      "id",
      "ownerId",
      "orderId",
      "paymentId",
      "paymentStatus",
      "statusLiteral",
      "redirectUrl",
    ];

    if (!feePaymentProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = FeePayment.schema.paths[fieldName];
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

    let feePaymentIdList = await FeePayment.find(query, { _id: 1 })
      .lean()
      .exec();

    if (!feePaymentIdList || feePaymentIdList.length === 0) {
      throw new NotFoundError(
        `FeePayment with the specified criteria not found`,
      );
    }

    feePaymentIdList = feePaymentIdList.map((item) => item._id.toString());

    return feePaymentIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeePaymentIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfFeePaymentByField;
istByField",
      err,
    );
  }
};

module.exports = getIdListOfFeePaymentByField;
