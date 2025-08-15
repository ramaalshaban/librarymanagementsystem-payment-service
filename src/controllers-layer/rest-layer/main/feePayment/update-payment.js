const { UpdatePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class UpdatePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("updatePayment", "updatepayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdatePaymentManager(this._req, "rest");
  }
}

const updatePayment = async (req, res, next) => {
  const updatePaymentRestController = new UpdatePaymentRestController(req, res);
  try {
    await updatePaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updatePayment;
