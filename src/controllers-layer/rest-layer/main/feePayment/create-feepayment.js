const { CreateFeePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CreateFeePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("createFeePayment", "createfeepayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateFeePaymentManager(this._req, "rest");
  }
}

const createFeePayment = async (req, res, next) => {
  const createFeePaymentRestController = new CreateFeePaymentRestController(
    req,
    res,
  );
  try {
    await createFeePaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createFeePayment;
