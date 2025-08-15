const { DeletePaymentManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class DeletePaymentRestController extends PaymentRestController {
  constructor(req, res) {
    super("deletePayment", "deletepayment", req, res);
    this.dataName = "feePayment";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeletePaymentManager(this._req, "rest");
  }
}

const deletePayment = async (req, res, next) => {
  const deletePaymentRestController = new DeletePaymentRestController(req, res);
  try {
    await deletePaymentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deletePayment;
