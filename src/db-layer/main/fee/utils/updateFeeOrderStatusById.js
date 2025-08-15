const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { Fee } = require("models");
const { ElasticIndexer } = require("serviceCommon");

const indexDataToElastic = async (data) => {
  const elasticIndexer = new ElasticIndexer("fee");
  await elasticIndexer.indexData(data);
};

const updateFeeOrderStatusById = async (id, status) => {
  try {
    const whereClause = { _id: id, isActive: true };

    const existingDoc = await Fee.findOne(whereClause);
    if (!existingDoc) {
      throw new NotFoundError(`Record with ID ${id} not found.`);
    }

    const updateData = {
      status: status,
      statusUpdateDate: new Date(),
    };

    const dbDoc = await Fee.findOneAndUpdate(whereClause, updateData, {
      new: true,
    });

    if (!dbDoc) {
      throw new NotFoundError("Record not found for update.");
    }

    const _data = dbDoc.getData();
    await indexDataToElastic(_data);
    return _data;
  } catch (err) {
    throw new HttpServerError(
      "An unexpected error occurred during the update operation.",
      err,
    );
  }
};

module.exports = updateFeeOrderStatusById;
