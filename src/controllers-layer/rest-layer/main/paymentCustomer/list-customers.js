const { ListCustomersManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class ListCustomersRestController extends PaymentRestController {
  constructor(req, res) {
    super("listCustomers", "listcustomers", req, res);
    this.dataName = "paymentCustomers";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCustomersManager(this._req, "rest");
  }
}

const listCustomers = async (req, res, next) => {
  const listCustomersRestController = new ListCustomersRestController(req, res);
  try {
    await listCustomersRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCustomers;
