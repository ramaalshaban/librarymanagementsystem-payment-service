const { HttpServerError, BadRequestError, newUUID } = require("common");
//should i add the elastic for mongodb?
const { ElasticIndexer } = require("serviceCommon");

const { FeePayment } = require("models");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("feePayment");
  await elasticIndexer.indexData(data);
};

const validateData = (data) => {
  const requiredFields = [
    "orderId",
    "paymentId",
    "paymentStatus",
    "statusLiteral",
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

const createFeePayment = async (data) => {
  try {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestError(`errMsg_invalidInputDataForFeePayment`);
    }

    validateData(data);

    const newfeePayment = new FeePayment(data);
    const createdfeePayment = await newfeePayment.save();

    //shoul i use model's getData method for consistency with Sequelize
    const _data = createdfeePayment.getData();

    await indexDataToElastic(_data);

    return _data;
  } catch (err) {
    throw new HttpServerError(`errMsg_dbErrorWhenCreatingFeePayment`, err);
  }
};

module.exports = createFeePayment;
rr);
  }
};

module.exports = createFeePayment;
