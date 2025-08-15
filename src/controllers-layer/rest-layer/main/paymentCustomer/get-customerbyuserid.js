const { GetCustomerByUserIdManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class GetCustomerByUserIdRestController extends PaymentRestController {
  constructor(req, res) {
    super("getCustomerByUserId", "getcustomerbyuserid", req, res);
    this.dataName = "paymentCustomer";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCustomerByUserIdManager(this._req, "rest");
  }
}

const getCustomerByUserId = async (req, res, next) => {
  const getCustomerByUserIdRestController =
    new GetCustomerByUserIdRestController(req, res);
  try {
    await getCustomerByUserIdRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCustomerByUserId;
