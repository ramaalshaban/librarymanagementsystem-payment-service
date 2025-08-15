const { ListethodsManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class ListethodsRestController extends PaymentRestController {
  constructor(req, res) {
    super("listethods", "listethods", req, res);
    this.dataName = "paymentMethods";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListethodsManager(this._req, "rest");
  }
}

const listethods = async (req, res, next) => {
  const listethodsRestController = new ListethodsRestController(req, res);
  try {
    await listethodsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listethods;
