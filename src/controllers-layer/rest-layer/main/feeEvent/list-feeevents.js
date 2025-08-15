const { ListFeeEventsManager } = require("managers");

const PaymentRestController = require("../../PaymentServiceRestController");

class ListFeeEventsRestController extends PaymentRestController {
  constructor(req, res) {
    super("listFeeEvents", "listfeeevents", req, res);
    this.dataName = "feeEvents";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListFeeEventsManager(this._req, "rest");
  }
}

const listFeeEvents = async (req, res, next) => {
  const listFeeEventsRestController = new ListFeeEventsRestController(req, res);
  try {
    await listFeeEventsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listFeeEvents;
