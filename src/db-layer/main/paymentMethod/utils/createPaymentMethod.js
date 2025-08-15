const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { PaymentMethod } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("paymentMethod");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "paymentMethodId",
    "userId",
    "customerId",
    "platform",
    "cardInfo",
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

const createPaymentMethod = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForPaymentMethod`);
    }

    validateData(data);

    const newpaymentMethod = new PaymentMethod(data);
    const createdpaymentMethod = await newpaymentMethod.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdpaymentMethod.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingPaymentMethod`, err);
  }
};

module.exports = createPaymentMethod;
