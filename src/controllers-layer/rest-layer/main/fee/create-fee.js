const { CreateFeeManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CreateFeeRestController extends PaymentRestController {
  constructor(req, res) {
    super("createFee", "createfee", req, res);
    this.dataName = "fee";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateFeeManager(this._req, "rest");
  }
}

const createFee = async (req, res, next) => {
  const createFeeRestController = new CreateFeeRestController(req, res);
  try {
    await createFeeRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createFee;
