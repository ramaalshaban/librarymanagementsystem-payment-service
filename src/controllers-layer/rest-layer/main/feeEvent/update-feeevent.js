const { UpdateFeeEventManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class UpdateFeeEventRestController extends PaymentRestController {
  constructor(req, res) {
    super("updateFeeEvent", "updatefeeevent", req, res);
    this.dataName = "feeEvent";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateFeeEventManager(this._req, "rest");
  }
}

const updateFeeEvent = async (req, res, next) => {
  const updateFeeEventRestController = new UpdateFeeEventRestController(
    req,
    res,
  );
  try {
    await updateFeeEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateFeeEvent;
