const { GetFeeEventManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetFeeEventRestController extends PaymentRestController {
  constructor(req, res) {
    super("getFeeEvent", "getfeeevent", req, res);
    this.dataName = "feeEvent";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetFeeEventManager(this._req, "rest");
  }
}

const getFeeEvent = async (req, res, next) => {
  const getFeeEventRestController = new GetFeeEventRestController(req, res);
  try {
    await getFeeEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getFeeEvent;
