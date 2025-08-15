const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { FeeEvent } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("feeEvent");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "feeId",
    "eventType",
    "eventDate",
    "actorUserId",
    "isActive",
  ];

  requiredFields.forEach((field) => {
    if (data[field] === null || data[field] === undefined) {
      throw new BadRequestError(
        `Field "${field}" is required and cannot be null or undefined.`,
      );
    }
  });

  if (!data._id && !data.id) {
    data._id = newUUID();
  }
};

const createFeeEvent = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForFeeEvent`);
    }

    validateData(data);

    const newfeeEvent = new FeeEvent(data);
    const createdfeeEvent = await newfeeEvent.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdfeeEvent.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingFeeEvent`, err);
  }
};

module.exports = createFeeEvent;
