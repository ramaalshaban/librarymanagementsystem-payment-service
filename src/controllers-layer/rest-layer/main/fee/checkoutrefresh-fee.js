const { CheckoutrefreshFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CheckoutrefreshFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("checkoutrefreshFee", "checkoutrefreshfee", req, res);
    this.dataName = "fee";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new CheckoutrefreshFeeManager(this._req, "rest");
  }
}

const checkoutrefreshFee = async (req, res, next) => {
  const checkoutrefreshFeeRestController = new CheckoutrefreshFeeRestController(
    req,
    res,
  );
  try {
    await checkoutrefreshFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = checkoutrefreshFee;
