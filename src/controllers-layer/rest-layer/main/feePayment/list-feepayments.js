const { ListFeePaymentsManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class ListFeePaymentsRestController extends PaymentRestController {
  constructor(req, res) {
    super("listFeePayments", "listfeepayments", req, res);
    this.dataName = "feePayments";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListFeePaymentsManager(this._req, "rest");
  }
}

const listFeePayments = async (req, res, next) => {
  const listFeePaymentsRestController = new ListFeePaymentsRestController(
    req,
    res,
  );
  try {
    await listFeePaymentsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listFeePayments;
