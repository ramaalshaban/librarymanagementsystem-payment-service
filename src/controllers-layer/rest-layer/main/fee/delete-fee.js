const { DeleteFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class DeleteFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("deleteFee", "deletefee", req, res);
    this.dataName = "fee";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteFeeManager(this._req, "rest");
  }
}

const deleteFee = async (req, res, next) => {
  const deleteFeeRestController = new DeleteFeeRestController(req, res);
  try {
    await deleteFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteFee;
