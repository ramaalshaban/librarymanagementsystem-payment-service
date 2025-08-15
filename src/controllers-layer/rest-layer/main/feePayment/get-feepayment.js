const { GetFeePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetFeePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("getFeePayment", "getfeepayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetFeePaymentManager(this._req, "rest");
  }
}

const getFeePayment = async (req, res, next) => {
  const getFeePaymentRestController = new GetFeePaymentRestController(req, res);
  try {
    await getFeePaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getFeePayment;
