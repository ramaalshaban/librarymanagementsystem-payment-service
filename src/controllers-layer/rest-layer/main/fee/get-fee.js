const { GetFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("getFee", "getfee", req, res);
    this.dataName = "fee";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetFeeManager(this._req, "rest");
  }
}

const getFee = async (req, res, next) => {
  const getFeeRestController = new GetFeeRestController(req, res);
  try {
    await getFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getFee;
