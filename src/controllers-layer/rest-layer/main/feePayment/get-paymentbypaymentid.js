const { GetPaymentByPaymentIdManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetPaymentByPaymentIdRestController extends PaymentRestController {
  constructor(req, res) {
    super("getPaymentByPaymentId", "getpaymentbypaymentid", req, res);
    this.dataName = "feePayment";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPaymentByPaymentIdManager(this._req, "rest");
  }
}

const getPaymentByPaymentId = async (req, res, next) => {
  const getPaymentByPaymentIdRestController =
    new GetPaymentByPaymentIdRestController(req, res);
  try {
    await getPaymentByPaymentIdRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPaymentByPaymentId;
