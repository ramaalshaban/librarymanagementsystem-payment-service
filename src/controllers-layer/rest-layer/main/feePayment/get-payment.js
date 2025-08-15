const { GetPaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetPaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("getPayment", "getpayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPaymentManager(this._req, "rest");
  }
}

const getPayment = async (req, res, next) => {
  const getPaymentRestController = new GetPaymentRestController(req, res);
  try {
    await getPaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPayment;
