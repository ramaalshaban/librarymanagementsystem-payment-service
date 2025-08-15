const { GetPaymentByOrderIdManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetPaymentByOrderIdRestController extends PaymentRestController {
  constructor(req, res) {
    super("getPaymentByOrderId", "getpaymentbyorderid", req, res);
    this.dataName = "feePayment";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPaymentByOrderIdManager(this._req, "rest");
  }
}

const getPaymentByOrderId = async (req, res, next) => {
  const getPaymentByOrderIdRestController =
    new GetPaymentByOrderIdRestController(req, res);
  try {
    await getPaymentByOrderIdRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPaymentByOrderId;
