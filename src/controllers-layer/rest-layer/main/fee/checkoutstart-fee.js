const { CheckoutstartFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CheckoutstartFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("checkoutstartFee", "checkoutstartfee", req, res);
    this.dataName = "fee";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new CheckoutstartFeeManager(this._req, "rest");
  }
}

const checkoutstartFee = async (req, res, next) => {
  const checkoutstartFeeRestController = new CheckoutstartFeeRestController(
    req,
    res,
  );
  try {
    await checkoutstartFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = checkoutstartFee;
