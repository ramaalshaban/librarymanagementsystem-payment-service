const { HttpServerError, BadRequestError, NotFoundError } = require("common");

const { FeeEvent } = require("models");

const getIdListOfFeeEventByField = async (fieldName, fieldValue, isArray) => {
  try {
    const feeEventProperties = [
      "id",
      "feeId",
      "eventType",
      "eventDate",
      "actorUserId",
      "note",
    ];

    if (!feeEventProperties.includes(fieldName)) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    // type validation different from sequelize for mongodb
    const schemaPath = FeeEvent.schema.paths[fieldName];
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

    let feeEventIdList = await FeeEvent.find(query, { _id: 1 }).lean().exec();

    if (!feeEventIdList || feeEventIdList.length === 0) {
      throw new NotFoundError(`FeeEvent with the specified criteria not found`);
    }

    feeEventIdList = feeEventIdList.map((item) => item._id.toString());

    return feeEventIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingFeeEventIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfFeeEventByField;
