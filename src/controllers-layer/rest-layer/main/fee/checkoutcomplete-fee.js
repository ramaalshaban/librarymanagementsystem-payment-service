const { CheckoutcompleteFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CheckoutcompleteFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("checkoutcompleteFee", "checkoutcompletefee", req, res);
    this.dataName = "fee";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new CheckoutcompleteFeeManager(this._req, "rest");
  }
}

const checkoutcompleteFee = async (req, res, next) => {
  const checkoutcompleteFeeRestController =
    new CheckoutcompleteFeeRestController(req, res);
  try {
    await checkoutcompleteFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = checkoutcompleteFee;
