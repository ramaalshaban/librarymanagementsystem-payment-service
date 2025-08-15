const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { PaymentCustomer } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("paymentCustomer");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = ["customerId", "platform", "isActive"];

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

const createPaymentCustomer = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForPaymentCustomer`);
    }

    validateData(data);

    const newpaymentCustomer = new PaymentCustomer(data);
    const createdpaymentCustomer = await newpaymentCustomer.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdpaymentCustomer.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingPaymentCustomer`, err);
  }
};

module.exports = createPaymentCustomer;
