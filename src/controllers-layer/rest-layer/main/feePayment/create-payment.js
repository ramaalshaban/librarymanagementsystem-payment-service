const { CreatePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CreatePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("createPayment", "createpayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreatePaymentManager(this._req, "rest");
  }
}

const createPayment = async (req, res, next) => {
  const createPaymentRestController = new CreatePaymentRestController(req, res);
  try {
    await createPaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createPayment;
