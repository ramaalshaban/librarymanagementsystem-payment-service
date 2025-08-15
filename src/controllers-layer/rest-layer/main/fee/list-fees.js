const { ListFeesManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class ListFeesRestController extends PaymentRestController {
  constructor(req, res) {
    super("listFees", "listfees", req, res);
    this.dataName = "fees";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListFeesManager(this._req, "rest");
  }
}

const listFees = async (req, res, next) => {
  const listFeesRestController = new ListFeesRestController(req, res);
  try {
    await listFeesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listFees;
