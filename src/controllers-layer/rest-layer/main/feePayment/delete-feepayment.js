const { DeleteFeePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class DeleteFeePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("deleteFeePayment", "deletefeepayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteFeePaymentManager(this._req, "rest");
  }
}

const deleteFeePayment = async (req, res, next) => {
  const deleteFeePaymentRestController = new DeleteFeePaymentRestController(
    req,
    res,
  );
  try {
    await deleteFeePaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteFeePayment;
