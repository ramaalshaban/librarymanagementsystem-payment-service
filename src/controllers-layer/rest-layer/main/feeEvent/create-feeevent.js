const { CreateFeeEventManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class CreateFeeEventRestController extends PaymentRestController {
  constructor(req, res) {
    super("createFeeEvent", "createfeeevent", req, res);
    this.dataName = "feeEvent";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateFeeEventManager(this._req, "rest");
  }
}

const createFeeEvent = async (req, res, next) => {
  const createFeeEventRestController = new CreateFeeEventRestController(
    req,
    res,
  );
  try {
    await createFeeEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createFeeEvent;
