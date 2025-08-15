const { ListPaymentsManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class ListPaymentsRestController extends PaymentRestController {
  constructor(req, res) {
    super("listPayments", "listpayments", req, res);
    this.dataName = "feePayments";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListPaymentsManager(this._req, "rest");
  }
}

const listPayments = async (req, res, next) => {
  const listPaymentsRestController = new ListPaymentsRestController(req, res);
  try {
    await listPaymentsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listPayments;
