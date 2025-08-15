const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { Fee } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("fee");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "userId",
    "amount",
    "currency",
    "status",
    "statusUpdateDate",
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

const createFee = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForFee`);
    }

    validateData(data);

    const newfee = new Fee(data);
    const createdfee = await newfee.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdfee.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingFee`, err);
  }
};

module.exports = createFee;
