const { UpdateFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class UpdateFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("updateFee", "updatefee", req, res);
    this.dataName = "fee";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateFeeManager(this._req, "rest");
  }
}

const updateFee = async (req, res, next) => {
  const updateFeeRestController = new UpdateFeeRestController(req, res);
  try {
    await updateFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateFee;
