const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { Fee } = require("models");

const getIdListOfFeeByField = async (fieldName, fieldValue, isArray) => {
  try {
    const feeProperties = [
      "id",
      "userId",
      "loanId",
      "amount",
      "currency",
      "status",
      "statusUpdateDate",
      "reason",
      "note",
    ];

    if (!feeProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = Fee.schema.paths[fieldName];
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

    let feeIdList = await Fee.find(query, { _id: 1 }).lean().exec();

    if (!feeIdList || feeIdList.length === 0) {
      throw new NotFoundError(`Fee with the specified criteria not found`);
    }

    feeIdList = feeIdList.map((item) => item._id.toString());

    return feeIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeeIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfFeeByField;
