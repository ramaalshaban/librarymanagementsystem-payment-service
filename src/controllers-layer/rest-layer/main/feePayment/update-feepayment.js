const { UpdateFeePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class UpdateFeePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("updateFeePayment", "updatefeepayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateFeePaymentManager(this._req, "rest");
  }
}

const updateFeePayment = async (req, res, next) => {
  const updateFeePaymentRestController = new UpdateFeePaymentRestController(
    req,
    res,
  );
  try {
    await updateFeePaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateFeePayment;
