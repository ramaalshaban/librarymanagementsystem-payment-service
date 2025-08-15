const { DeleteFeeEventManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class DeleteFeeEventRestController extends PaymentRestController {
  constructor(req, res) {
    super("deleteFeeEvent", "deletefeeevent", req, res);
    this.dataName = "feeEvent";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteFeeEventManager(this._req, "rest");
  }
}

const deleteFeeEvent = async (req, res, next) => {
  const deleteFeeEventRestController = new DeleteFeeEventRestController(
    req,
    res,
  );
  try {
    await deleteFeeEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteFeeEvent;
